import {
  CLD_PRB_THRESH,
  BUFFER,
  NIR_DRK_THRESH,
  CLD_PRJ_DIST,
} from "~/assets/cloud_k";
/* 1. Using qa band */
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
/* 2. Using s2cloudless */
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

export const applyCldShdwMask = (img) => {
  // Subset the cloudmask band and invert it so clouds/shadow are 0, else 1.
  const not_cld_shdw = img.select("cloudmask").not();
  // Subset reflectance bands and update their masks, return the result.
  return img.select("B.*").updateMask(not_cld_shdw);
};
/*3. Using community based code from thanh... */
//Function to score shadows based on clouds
function projectShadows(cloudMask, sunAzimuth, offset) {
  const azimuth = ee
    .Number(sunAzimuth)
    .multiply(Math.PI)
    .divide(180.0)
    .add(ee.Number(0.5).multiply(Math.PI));
  const x = azimuth.cos().multiply(10.0).round();
  const y = azimuth.sin().multiply(10.0).round();
  const shadow = cloudMask.changeProj(
    cloudMask.projection(),
    cloudMask
      .projection()
      .translate(x.multiply(ee.Number(offset)), y.multiply(ee.Number(offset)))
  );
  return shadow;
}

//Function to detect clouds and shadows
export const clds3 = function (image) {
  const cld = image.select("B2").multiply(image.select("B9")).divide(1e4);
  const cloud = cld.gt(310);
  const scale = ee.Image.pixelArea().sqrt();
  const buffer = cloud
    .updateMask(cloud)
    .fastDistanceTransform(250, "pixels")
    .sqrt()
    .multiply(scale);
  const clouds = cloud.not().updateMask(buffer.gt(250));
  const shadows = projectShadows(
    clouds,
    image.get("MEAN_SOLAR_AZIMUTH_ANGLE"),
    7.5
  );
  const locmay = image.mask().reduce("min").and(clouds).and(shadows);
  return image.updateMask(locmay);
};
