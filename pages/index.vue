<template>
  <div class="relative h-screen flex flex-col">
    <div class="absolute z-10 ">
      <button @click="addImage" class="z-50 px-7 py-3 bg-orange-400 hover:bg-orange-500 text-white">Show EE Layer</button>
    </div>
    
    <div ref="mapRef" class="w-full max-h-full  absolute top-0 right-0 left-0 bottom-0 z-10"></div>
  </div>
</template>

<script setup>
  import { getUserDrawnPolygonOptions } from "~/assets/drawing/drawingOpions";
  import {useMapStore} from "~/store/map"
  import {useAuth} from "~/store/auth"
  import {useEe} from "~/store/ee"
  const MapStore = useMapStore()
  const AuthStore = useAuth()
  const EeStore = useEe()

  const mapRef = ref(null)
  const map = ref(null)
  const drawingManager = ref(null)
  const map_id = useRuntimeConfig().public.mapId;

  onMounted( () => {
  createMap(mapRef.value)
  initDrawingManager()
  })

// 1. authentication
  AuthStore.getAuthTokenFromServerAndInitialize()
  !process.server && setInterval(()=> AuthStore.getAuthTokenFromServer(), 100000)

  // 2. initialize map
  const createMap = (mapRef) => {
    map.value = new window.google.maps.Map(mapRef, {
      center: { lat: -0.03, lng: 36 },
      zoom: 8,
      scaleControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      mapId: map_id,
    });
    map.value.addListener("tilesloaded", (e) => {
      console.log("tiles loaded");
    });
    map.value.addListener("idle", (e) => {
      console.log("map idle");
    });
  };
  // 3. initialize the drawing manager
  const initDrawingManager = () => {
    drawingManager.value = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_LEFT,
        drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: getUserDrawnPolygonOptions,
    });
    window.google.maps.event.addListener(
      drawingManager.value,
      "overlaycomplete",
      function (e) {
        if (e.type === "polygon") {
          MapStore.drawnPath = e.overlay.getPath().getArray();
          MapStore.drawnPolygon = createPolygon(MapStore.drawnPath, map.value);
        }
      }
    );

    drawingManager.value.setMap(map.value);
  };
  // 4. add Image to map
  const addImage = () => {
    const polygon = convertPathToPolygon(MapStore.drawnPath)
    console.log(polygon)
    const geom = ee.Geometry.Polygon([convertPathToPolygon(MapStore.drawnPath)])
    // EeStore.addSentinel(geom, map.value)
    // s2_sr_cld_col_eval_disp = s2_sr_cld_col_eval.map(add_cld_shdw_mask)
    const s2SrCldColEval = EeStore.getS2SrCldCol(geom, "2022-01-01", "2022-01-20")
    const col = s2SrCldColEval.map(addCldShdwMask)
    EeStore.displayCloudLayers(col, map.value)
  }


</script>

<style scoped>

</style>
<!-- getAuthTokenFromServer() {
  let that = this;
  that.$axios
    .$get("/ee-api/getAuthToken/")
    .then((response) => {
      const tokenArray = response.split(" ");
      const token = tokenArray[1];
      window.ee.data.setAuthToken(
        "",
        "Bearer",
        token,
        3600,
        [],
        undefined,
        false
      );
    })
    .catch((e) => {
      that.$message.error(e.toString());
    });
},
getAuthTokenFromServerAndInitialise() {
  let that = this;
  that.$axios
    .$get("/ee-api/getAuthToken/")
    .then((response) => {
      const tokenArray = response.split(" ");
      const token = tokenArray[1];
      window.ee.data.setAuthToken(
        "",
        "Bearer",
        token,
        3600,
        [],
        undefined,
        false
      );

      window.ee.initialize(
        null,
        null,
        () => {
          that.initialize();
        },
        (e) => {
          console.error("Initialization error: " + e);
        }
      );
    })
    .catch((e) => {
      that.$message.error(e.toString());
    });
},

async initialize() {
  await this.initializeMaps({
    vueInstance: this,
    mapLeftRef: this.$refs.mapLeft,
    mapRightRef: this.$refs.mapRight,
    mapContainerRef: this.$refs.mapContainer
  });

  await this.initializeDrawingManager();

  await this.initializeEeAssets(this.GEE_PROJECT_ASSET_PATH);
}, -->