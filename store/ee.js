import { defineStore } from "pinia";
import { trueColor, ndviParams } from "~/assets/vizParams";
import { CLOUD_FILTER } from "~/assets/cloud_k";
import { getData, setData } from "nuxt-storage/local-storage";
import { ACEH } from "../constants/AREAS";

export const useEe = defineStore("ee", () => {
  const layers = ref({});
  // const AREAS_DATA = ref();
  const AREAS_AOI_TEXT = ref({
    aceh: "Aceh",
  });
  function landsat8() {
    var sr14 = window.ee
      .ImageCollection("LANDSAT/LC08/C02/T1_L2")
      .sort("CLOUD_COVER", true)
      .filterMetadata("CLOUD_COVER", "less_than", 20);

    // Temporally composite the images with a maximum value function.
    // var visParams = {bands: ['SR_B4', 'SR_B3', 'SR_B2'], min:7590.96,max: 18245.04};
    var getQABits = function (image, start, end, newName) {
      // Compute the bits we need to extract.
      var pattern = 0;
      for (var i = start; i <= end; i++) {
        pattern += Math.pow(2, i);
      }
      // Return a single band image of the extracted QA bits, giving the band
      // a new name.
      return image.select([0], [newName]).bitwiseAnd(pattern).rightShift(start);
    };

    // A function to mask out cloudy pixels.
    var cloud_shadows = function (image) {
      // Select the QA band.
      var QA = image.select(["QA_PIXEL"]);
      // Get the internal_cloud_algorithm_flag bit.
      return getQABits(QA, 3, 3, "cloud_shadows").eq(0);
      // Return an image masking out cloudy areas.
    };

    // A function to mask out cloudy pixels.
    var clouds = function (image) {
      // Select the QA band.
      var QA = image.select(["QA_PIXEL"]);
      // Get the internal_cloud_algorithm_flag bit.
      return getQABits(QA, 5, 5, "Cloud").eq(0);
      // Return an image masking out cloudy areas.
    };

    var maskClouds = function (image) {
      var cs = cloud_shadows(image);
      var c = clouds(image);
      image = image.updateMask(cs);
      return image.updateMask(c);
    };

    function calculateNDVI(image) {
      var ndvi = image.normalizedDifference(["SR_B5", "SR_B4"]).rename("NDVI");
      return ndvi.copyProperties(image, image.propertyNames());
    }

    var composite_free = sr14.map(maskClouds);

    function getNDVIImageForYear(region, year) {
      var startDate = window.ee.Date.fromYMD(year, 1, 1);
      var endDate = window.ee.Date.fromYMD(year, 12, 31);
      var landsat8SR = composite_free.filterDate(startDate, endDate);

      return landsat8SR
        .median()
        .clip(region)
        .set("year", year, "region", region);
    }

    // // Generate NDVI collections for each region and year
    var yearList = window.ee.List.sequence(2018, 2024);

    const areaList = [{ name: "aceh", data: ACEH }];

    var ndviCollections = areaList.map(function (item) {
      var region = window.ee.Geometry.Polygon(item.data);
      return yearList.map(function (year) {
        var img = getNDVIImageForYear(region, year).set(
          "regionName",
          item.name
        );
        return img;
      });
    });

    layers.value = {
      aceh: window.ee.ImageCollection.fromImages(ndviCollections[0]).map(
        calculateNDVI
      ),
    };

    // const textArr = Object.keys(AREAS_AOI_TEXT.value);

    // const serializedArray = ndviCollections.map((arr, i) => {
    //   return window.ee.Serializer.toJSON(
    //     window.ee.ImageCollection.fromImages(arr)
    //   );
    // });
    // setData("arrayOfCollections", serializedArray, 9999, "d");

    // // Iterate through each serialized collection
    // serializedArray.forEach((col, i) => {
    //   // Deserialize the collection
    //   const deserializedCollection = window.ee.Deserializer.fromJSON(col);
    //   const areaName = `L8NDVI_${AREAS_AOI_TEXT.value[textArr[i]]}`;

    //   // Update the layers object with the new key-value pair
    //   layers.value.push(deserializedCollection);
    // });
  }

  return {
    layers,
    landsat8,
  };
});
