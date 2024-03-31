import { getUserDrawnPolygonOptions } from "~/assets/drawing/drawingOpions";
import { defineStore } from "pinia";

export const useMapStore = defineStore("map", () => {
  const map = ref(null);
  const drawingManager = ref(null);
  const map_id = useRuntimeConfig().public.mapId;
  const drawnPath = ref([]);
  const drawnPolygon = ref(null);

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
      const advancedMarker = addMarker(map.value);
      console.log("advanced marker", advancedMarker);
    });
    map.value.addListener("idle", (e) => {
      console.log("map idle");
    });
  };

  const initDrawingManager = () => {
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
          drawnPolygon.value = createPolygon(drawnPath.value, map.value);
        }
      }
    );

    drawingManager.value.setMap(map.value);
  };

  const addMarker = (map) => {
    const pinElement = new window.google.maps.marker.PinElement({
      scale: 1.5,
      background: "#FBBC04",
      borderColor: "#137333",
      glyphColor: "yellow",
    });
    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      map,
      position: map.getCenter(),
      content: pinElement.element,
    });

    return marker;
  };

  return { createMap, map, initDrawingManager, addMarker, drawnPath };
});
