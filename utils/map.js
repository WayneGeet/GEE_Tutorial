import { polygonProps } from "~/assets/drawing/drawingOpions";
export const createMap = (mapRef, options) => {
  return new window.google.maps.Map(mapRef, options);
};

export const createPolygon = (paths, map) => {
  const polygon = new window.google.maps.Polygon({
    paths,
    ...polygonProps,
  });
  polygon.setMap(map);
  return polygon;
};

export const convertPathToPolygon = (path) => {
  let polygon = [];
  path.forEach(function (point) {
    polygon.push([point.lng(), point.lat()]);
  });
  return polygon;
};
// export const addPolygon = (map) => {

// }
