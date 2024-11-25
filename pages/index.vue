<template>
  <div class="relative h-screen w-full" ref="mapContainerRef">
    <div id="map-container" class="h-full relative flex items-center justify-center" ref="mapContainerRef">
      <!-- Left Map -->
      <div id="left" class="h-full relative ">
        <div
          id="map-left"
          class="absolute top-0 bottom-0 left-0 right-0 bg-yellow-400"
          ref="mapLeftRef"
        ></div>
      </div>
      <!-- Right Map -->
      <div id="right" class="h-full relative ">
        <div
          id="map-right"
          class="absolute top-0 bottom-0 left-0 right-0 bg-green-400"
          ref="mapRightRef"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useMapStore} from "~/store/map"
import {useAuth} from "~/store/auth"
import {useEe} from "~/store/ee"

const MapStore = useMapStore();
const AuthStore = useAuth();
const EeStore = useEe();

const mapContainerRef = ref(null);
const mapLeftRef = ref(null);
const mapRightRef = ref(null);
const split = ref(null);
const mapLeft = ref(null);
const mapRight = ref(null);

const {data:token} = await useFetch("/api/getToken")
console.log(token)

onMounted(async () => {
  // Initialize both maps
  const obj = MapStore.initializeMap(mapLeftRef.value, mapRightRef.value);
  mapLeft.value = obj.map1;
  mapRight.value = obj.map2;

  // Split the layout between the left and right map
  split.value = window.Split(["#left", "#right"], {
    sizes: [50, 50], // Split equally
    minSize: 200, // Minimum size of each pane
    gutterSize: 10, // Width of the gutter in pixels
    // gutter: (index, direction) => {
    //   const gutter = document.createElement('div');
    //   gutter.className = `gutter gutter-${direction}`;
    //   return gutter;
    // },
  });
  console.log("Split object sizes:", split.value.getSizes());

  // Optionally initialize drawing tools
  // MapStore.initDrawingManager(mapLeft.value);
});

// 1. authentication
  // AuthStore.getAuthTokenFromServerAndInitialize()
  // !process.server && setInterval(()=> AuthStore.getAuthTokenFromServer(), 100000)

  // 2. initialize map
  
  // 3. initialize the drawing manager
  // const initDrawingManager = () => {
  //   drawingManager.value = new window.google.maps.drawing.DrawingManager({
  //     drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
  //     drawingControl: true,
  //     drawingControlOptions: {
  //       position: window.google.maps.ControlPosition.TOP_LEFT,
  //       drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
  //     },
  //     polygonOptions: getUserDrawnPolygonOptions,
  //   });
  //   window.google.maps.event.addListener(
  //     drawingManager.value,
  //     "overlaycomplete",
  //     function (e) {
  //       if (e.type === "polygon") {
  //         MapStore.drawnPath = e.overlay.getPath().getArray();
  //         MapStore.drawnPolygon = createPolygon(MapStore.drawnPath, map.value);
  //       }
  //     }
  //   );

  //   drawingManager.value.setMap(map.value);
  // };
  // 4. add Image to map
  const addImage = () => {
    try {
      EeStore.landsat8()
      const coords = [];

      MapStore.drawnPath.forEach(function (point) {
        coords.push([point.lng(), point.lat()]);
      });

      console.log(EeStore.layers.aceh.getInfo())
      const col = EeStore.layers.aceh
      .filterDate("2020-01-01", "2020-12-31")
      .median()
      col.evaluate((image) => console.log(image))

      const geom = window.ee.Geometry.Polygon(coords)
      console.log(geom)

      // console.log(col.mosaic().getInfo())
      const mapId = EeStore.layers.aceh.median().clip(geom).getMap({bands: ["NDVI"],})
      const tileSource = new ee.layers.EarthEngineTileSource(mapId);
      const overlay = new ee.layers.ImageOverlay(tileSource);
      mapLeft.value.overlayMapTypes.push(overlay);
      mapLeft.value.addListener("click", (e) => {
        console.log("map clicked");
      });
          
    } catch (error) {
      console.error("something went wrong:", error)
    }


    // EeStore.displayCloudLayers(col, map.value, {bands: ['B4', 'B3', 'B2'], min: 0, max: 2500, gamma: 1.1})
    // EeStore.addEeLayer(col.mosaic(), {}, map.value)
  }




</script>

<style scoped>
  /* div .gutter {
    background-color: #ff0909;
    width: 5px;
    z-index: 100;
    height:20px;
  } */

  input[type="range"]{
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance:none;
    width:100%;
    outline: none;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    background: transparent;
  }

  input[type="range"]::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    height: 5px;
  }

  input[type="range"]::-moz-range-track {
    -moz-appearance: none;
    height: 5px;
  }

  input[type="range"]::-ms-track{
    appearance: none;
    height:5px;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height:1.2em;
    width:1.2em;
    background-color: blue;
    margin-top:-5px;
    border-radius: 10px;
    cursor: pointer;
    pointer-events: auto;
  }
  input[type="range"]::-moz-slider-thumb {
    -moz-appearance: none;
    height:1.2em;
    width:1.2em;
    background-color: blue;
    margin-top:-5px;
    border-radius: 10px;
    cursor: pointer;
    pointer-events: auto;
  }
  input[type="range"]::-ms-slider-thumb {
    appearance: none;
    height:1.2em;
    width:1.2em;
    background-color: blue;
    margin-top:-5px;
    border-radius: 10px;
    cursor: pointer;
    pointer-events: auto;
  }

  input[type="range"]:active::-webkit-slider-thumb {
    background-color: white;
    border: 3px solid blue;
  }
</style>
