<template>
  <div>
      <button @click="addImage">Google Earth Engine w Nuxt 3</button>
      <div ref="mapRef" class="w-full max-h-full h-screen"></div>
  </div>
</template>

<script setup>
  import {useMapStore} from "~/store/map"
  import {useAuth} from "~/store/auth"
  import {useEe} from "~/store/ee"
  const MapStore = useMapStore()
  const AuthStore = useAuth()
  const EeStore = useEe()

  const mapRef = ref(null)
  const map = ref(null)

  onMounted( () => {
    const map_id = useRuntimeConfig().public.mapId;
    // map.value = new window.google.maps.Map(mapRef.value, {
    //   center: { lat: -0.03, lng: 36 },
    //   zoom: 8,
    //   scaleControl: false,
    //   streetViewControl: false,
    //   mapTypeControl: false,
    //   mapId: map_id,
    // });

    // const pinElement = new window.google.maps.marker.PinElement({
    //   scale: 1.5,
    //   background: "#FBBC04",
    //   borderColor: "#137333",
    //   glyphColor: "yellow",
    // });
    // const marker = new window.google.maps.marker.AdvancedMarkerElement({
    //   map:map.value,
    //   position: {lat: -0.03, lng: 36 },
    //   content: pinElement.element,
    // });

    // authentication
    initialize()
    
  })
  const initialize = () => {
      MapStore.createMap(mapRef.value)
      MapStore.initDrawingManager(MapStore.map);
      // EeStore.addSentinel()
    }

  AuthStore.getAuthTokenFromServerAndInitialize()
  !process.server && setInterval(()=> AuthStore.getAuthTokenFromServer(), 100000)

  const addImage = () => {
    const polygon = convertPathToPolygon(MapStore.drawnPath)
    console.log(polygon)
    const geom = ee.Geometry.Polygon([convertPathToPolygon(MapStore.drawnPath)])
    EeStore.addSentinel(geom, MapStore.map)
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