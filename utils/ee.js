import {
  CLD_PRB_THRESH,
  BUFFER,
  NIR_DRK_THRESH,
  CLD_PRJ_DIST,
  CLOUD_FILTER,
  START_DATE,
  END_DATE,
} from "~/assets/cloud_k";
// 😂😂😂You play too much my boy

// export const maskS2clouds = (image) => {
//   var qa = image.select('QA60');

//   // Bits 10 and 11 are clouds and cirrus, respectively.
//   var cloudBitMask = 1 << 10;
//   var cirrusBitMask = 1 << 11;

//   // Both flags should be set to zero, indicating clear conditions.
//   var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
//       .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

//   return image.updateMask(mask).divide(10000);
// }
export const addCloudBands = (img) => {
  //  Get s2cloudless image, subset the probability band.
  const cld_prb = ee.Image(img.get("s2cloudless")).select("probability");

  // Condition s2cloudless by the probability threshold value.
  const is_cloud = cld_prb.gt(CLD_PRB_THRESH).rename("clouds");

  //  Add the cloud probability layer and cloud mask as image bands.
  return img.addBands(ee.Image([cld_prb, is_cloud]));
};

export const addShadowBands = (img) => {
  // Identify water pixels from the SCL band.
  const not_water = img.select("SCL").neq(6);

  // Identify dark NIR pixels that are not water (potential cloud shadow pixels).
  const SR_BAND_SCALE = 1e4;
  const dark_pixels = img
    .select("B8")
    .lt(NIR_DRK_THRESH * SR_BAND_SCALE)
    .multiply(not_water)
    .rename("dark_pixels");

  // Determine the direction to project cloud shadow from clouds (assumes UTM projection).
  const shadow_azimuth = ee
    .Number(90)
    .subtract(ee.Number(img.get("MEAN_SOLAR_AZIMUTH_ANGLE")));

  // Project shadows from clouds for the distance specified by the CLD_PRJ_DIST input.
  const cld_proj = img
    .select("clouds")
    .directionalDistanceTransform(shadow_azimuth, CLD_PRJ_DIST * 10)
    .reproject({ crs: img.select(0).projection(), scale: 100 })
    .select("distance")
    .mask()
    .rename("cloud_transform");

  // Identify the intersection of dark pixels with cloud shadow projection.
  const shadows = cld_proj.multiply(dark_pixels).rename("shadows");

  // Add dark pixels, cloud projection, and identified shadows as image bands.
  return img.addBands(ee.Image([dark_pixels, cld_proj, shadows]));
};

export const addCldShdwMask = (img) => {
  //  Add cloud component bands.
  const img_cloud = addCloudBands(img);

  //  Add cloud shadow component bands.
  const img_cloud_shadow = addShadowBands(img_cloud);

  //  Combine cloud and shadow mask, set cloud and shadow as value 1, else 0.
  let is_cld_shdw = img_cloud_shadow
    .select("clouds")
    .add(img_cloud_shadow.select("shadows"))
    .gt(0);

  //  Remove small cloud-shadow patches and dilate remaining pixels by BUFFER input.
  //  20 m scale is for speed, and assumes clouds don't require 10 m precision.
  is_cld_shdw = is_cld_shdw
    .focalMin(2)
    .focalMax((BUFFER * 2) / 20)
    .reproject({ crs: img.select([0]).projection(), scale: 20 })
    .rename("cloudmask");

  //  Add the final cloud-shadow mask to the image.
  return img.addBands(is_cld_shdw);
};
