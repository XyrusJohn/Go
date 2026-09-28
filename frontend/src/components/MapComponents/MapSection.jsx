import { useState } from "react";
import { MapContainer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import OpenStreetMapLayer from "./OpenStreetMapLayer.jsx";
import "leaflet/dist/leaflet.css";

const ZoomScalingMarker = ({ position }) => {
  const [zoomLevel, setZoomLevel] = useState(15);

  const map = useMapEvents({
    zoom: () => {
      setZoomLevel(map.getZoom());
    },
  });
  const zoomScales = {
    6: 0.5,
    7: 0.5,
    8: 0.5,
    9: 0.6,
    10: 0.7,
    11: 0.8,
    12: 0.9,
    13: 1.0,
    14: 1.0,
    15: 1.0,
  };

  const sizeMultiplier = zoomScales[zoomLevel] || 1.0;

  const width = 25 * sizeMultiplier;
  const height = 41 * sizeMultiplier;

  const dynamicIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [1, -height],
    shadowSize: [41 * sizeMultiplier, 41 * sizeMultiplier],
  });

  return (
    <Marker position={position} icon={dynamicIcon}>
      <Popup className="text-black">
        Location check! <br /> Quezon City
      </Popup>
    </Marker>
  );
};

const MapSection = ({ position }) => {
  const philippinesBounds = [
    [4.25, 116.93],
    [21.34, 126.6],
  ];

  return (
    <div className="flex-1 h-full z-0 relative">
      <MapContainer
        center={position}
        zoom={15}
        minZoom={6}
        maxBounds={philippinesBounds}
        maxBoundsViscosity={1.0}
        className="w-full h-full"
        attributionControl={false}
        zoomControl={false}
      >
        <OpenStreetMapLayer />

        {/* 5. Palitan ang default Marker ng custom scaling marker mo */}
        <ZoomScalingMarker position={position} />
      </MapContainer>
    </div>
  );
};

export default MapSection;
