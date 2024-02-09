import { rectangleOptions } from "~/assets/drawing/drawingOpions";
import { defineStore } from "pinia";
export const useMapStore = defineStore("map", () => {
  const map = ref(null);
  const drawingManager = ref(null);
  const createMap = (mapRef) => {
    map.value = new window.google.maps.Map(mapRef, {
      center: { lat: -0.03, lng: 36 },
      zoom: 8,
      scaleControl: false,
      streetViewControl: false,
      mapTypeControl: false,
    });
  };

  const initDrawingManager = (map) => {
    drawingManager.value = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.RECTANGLE,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_LEFT,
        drawingModes: [window.google.maps.drawing.OverlayType.RECTANGLE],
      },
      rectangleOptions: rectangleOptions,
    });
    window.google.maps.event.addListener(
      drawingManager.value,
      "overlaycomplete",
      function (e) {
        console.log(e);
      }
    );
    drawingManager.value.setMap(map);
  };

  return { createMap, map, initDrawingManager };
});
