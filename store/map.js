import {
  getUserDrawnPolygonOptions,
  splitOptions,
  mapOptions,
} from "~/assets/options/map";
import { defineStore } from "pinia";

export const useMapStore = defineStore("map", () => {
  const map = ref(null);
  const drawingManager = ref(null);
  const mapId = useRuntimeConfig().public.mapId;
  const drawnPath = ref([]);
  const drawnPolygon = ref(null);

  const initializeMap = (...refs) => {
    let map1, map2, split;
    map1 = new window.google.maps.Map(refs[0], { ...mapOptions, mapId });
    map2 = new window.google.maps.Map(refs[1], {
      ...mapOptions,
      mapId,
    });
    syncMaps(map1, map2);
    split = window.Split(["#left", "#right"], splitOptions);

    return { map1, map2, split };
  };

  const initDrawingManager = (mapLeft) => {
    console.log("start drawing");
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
          drawnPath.value = e.overlay.getPath().getArray();
          drawnPolygon.value = createPolygon(drawnPath.value, mapLeft);
        }
      }
    );

    drawingManager.value.setMap(mapLeft);
  };

  const addMarker = (map) => {
    const pinElement = new window.google.maps.marker.PinElement({
      scale: 1.5,
      background: "#FBBC04",
      borderColor: "#137333",
      glyphColor: "yellow",
    });
    const marker = new window.google.maps.Marker({
      map,
      position: { lat: -0.277021, lng: 36.125151 },
      // content: pinElement.element,
    });

    return marker;
  };

  return { initializeMap, map, initDrawingManager, addMarker, drawnPath };
});
