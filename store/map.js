import { defineStore } from "pinia";

export const useMapStore = defineStore("map", () => {
  const map = ref(null);

  const createMap = (mapRef) => {
    map.value = new window.google.maps.Map(mapRef, {
      center: { lat: 2.218, lng: 115.6628 },
      zoom: 5,
      scaleControl: false,
      streetViewControl: false,
      mapTypeControl: false,
    });
  };

  return { createMap, map };
});
