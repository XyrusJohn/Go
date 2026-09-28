import { TileLayer } from "react-leaflet";

const OpenStreetMapLayer = () => {
  return (
    <TileLayer
      noWrap={true}
      attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
    />
  );
};

export default OpenStreetMapLayer;
