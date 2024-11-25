import { polygonProps } from "~/assets/options/map";
export const createMap = (mapRef, options) => {
  return new window.google.maps.Map(mapRef, options);
};

export const createPolygon = (paths, map) => {
  const polygon = new window.google.maps.Polygon({
    paths,
    ...polygonProps,
  });
  polygon.setMap(map);
  polygon.addListener("click", (e) => {
    console.log("polygon clicked", e);
  });
  return polygon;
};

export const convertPathToPolygon = (path) => {
  let polygon = [];
  path.forEach(function (point) {
    polygon.push([point.lng(), point.lat()]);
  });
  return polygon;
};

export const syncMaps = (...maps) => {
  let center, zoom;

  maps.forEach((map) => {
    map.addListener("bounds_changed", () => {
      const changedCenter = map.getCenter();
      const changedZoom = map.getZoom();

      if (changedCenter !== center || changedZoom !== zoom) {
        center = changedCenter;
        zoom = changedZoom;
        updateMaps(maps, map, center, zoom);
      }
    });
  });
};

export const updateMaps = (maps, changedMap, center, zoom) => {
  maps.forEach((map) => {
    if (map === changedMap) {
      return;
    }
    map.setCenter(center);
    map.setZoom(zoom);
  });
};
