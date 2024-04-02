import { defineStore } from "pinia";
import { trueColor, ndviParams } from "~/assets/vizParams";
import { CLOUD_FILTER } from "~/assets/cloud_k";

export const useEe = defineStore("ee", () => {
  const layers = ref({});
  const assets = ref({});
  const year = ref("2022");
  const s2_sr_col = ref(null);
  const s2_cloudless_col = ref(null);

  function getS2SrCldCol(aoi, start_date, end_date) {
    //  Import and filter S2 SR.
    s2_sr_col.value = ee
      .ImageCollection("COPERNICUS/S2_SR")
      .filterBounds(aoi)
      .filterDate(start_date, end_date)
      .filter(ee.Filter.lte("CLOUDY_PIXEL_PERCENTAGE", CLOUD_FILTER));

    //  Import and filter s2cloudless.
    s2_cloudless_col.value = ee
      .ImageCollection("COPERNICUS/S2_CLOUD_PROBABILITY")
      .filterBounds(aoi)
      .filterDate(start_date, end_date);

    //  Join the filtered s2cloudless collection to the SR collection by the 'system:index' property.
    return ee.ImageCollection(
      ee.Join.saveFirst("s2cloudless").apply({
        primary: s2_sr_col.value,
        secondary: s2_cloudless_col.value,
        condition: ee.Filter.equals({
          leftField: "system:index",
          rightField: "system:index",
        }),
      })
    );
  }
  // s2_sr_cld_col_eval_disp = s2_sr_cld_col_eval.map(add_cld_shdw_mask)

  // display_cloud_layers(s2_sr_cld_col_eval_disp)
  // def add_ee_layer(self, ee_image_object, vis_params, name, show=True, opacity=1, min_zoom=0):

  function addEeLayer(eeImgObj, vizParams, embeddedMap) {
    const mapIdDict = ee.Image(eeImgObj).getMap(vizParams);
    const tileSource = new ee.layers.EarthEngineTileSource(mapIdDict);
    const overlay = new ee.layers.ImageOverlay(tileSource);
    embeddedMap.overlayMapTypes.push(overlay);
  }

  function displayCloudLayers(col, map) {
    // # Mosaic the image collection.
    const img = col.mosaic();
    console.log("this is img.mosaic()", img);
    // # Subset layers and prepare them for display.
    const clouds = img.select("clouds").selfMask();
    const shadows = img.select("shadows").selfMask();
    const dark_pixels = img.select("dark_pixels").selfMask();
    const probability = img.select("probability");
    const cloudmask = img.select("cloudmask").selfMask();
    const cloud_transform = img.select("cloud_transform");
    addEeLayer(
      img,
      {
        bands: ["B4", "B3", "B2"],
        min: 0,
        max: 2500,
        gamma: 1.1,
      },
      map
    );
    addEeLayer(clouds, { palette: "e056fd" }, map);
    addEeLayer(shadows, { palette: "yellow" }, map);
    addEeLayer(probability, { min: 0, max: 100 }, map);
    addEeLayer(dark_pixels, { palette: "orange" }, map);
  }

  return {
    layers,
    assets,
    getS2SrCldCol,
    displayCloudLayers,
    displayCloudLayers,
  };
});
