import { defineStore } from "pinia";
import { trueColor, ndviParams } from "~/assets/vizParams";
export const useEe = defineStore("ee", () => {
  const layers = ref({});
  const assets = ref({});

  const addSentinel = async (bounds, map) => {
    let sentinelImage = ee
      .ImageCollection("COPERNICUS/S2_SR")
      .filter(ee.Filter.calendarRange(8, 12, "month"))
      .filterMetadata("CLOUDY_PIXEL_PERCENTAGE", "less_than", 10)
      .filterBounds(bounds)
      .median()
      .clip(bounds);
    // .medium();

    // const ndvi = sentinelImage
    //   .first()
    //   .normalizedDifference(["B5", "B4"])
    //   .rename("NDVI");
    // sentinelImage = sentinelImage.addBands(ndvi);
    // console.log("ndvi image", sentinelImage);

    // console.log(sentinelImage.select(["NDVI"]).getMap(trueColor));
    layers.value.sentinel = sentinelImage;
    // console.log("bands", sentinelImage.bandNames());

    const mapId = sentinelImage.getMap(trueColor);
    const tileSource = new ee.layers.EarthEngineTileSource(mapId);
    const overlay = new ee.layers.ImageOverlay(tileSource);
    console.log(overlay);
    map.overlayMapTypes.push(overlay);
  };

  return {
    layers,
    assets,
    addSentinel,
  };
});
