export const mapOptions = {
  center: { lat: 5.241351, lng: 96.089679 },
  zoom: 8,
  scaleControl: false,
  streetViewControl: false,
  mapTypeControl: false,
};

export const rectangleOptions = {
  fillColor: "#ededf4",
  fillOpacity: 1,
  strokeWeight: 1,
  clickable: true,
  editable: true,
  zIndex: 1,
};

export const polygonProps = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0,
};
export const getUserDrawnPolygonOptions = {
  editable: false,
  strokeColor: "#FF0000",
  strokeOpacity: 0.4,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.0,
};

export const splitOptions = {
  sizes: [25, 75],
  minSize: 0,
  expandToMin: true,
  gutterSize: 12,
  snapOffset: 100,
  cursor: "col-resize",
};
