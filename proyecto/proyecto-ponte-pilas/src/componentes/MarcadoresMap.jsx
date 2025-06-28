import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import iconoRobo from "../recursos/menuUser/LogoRobo.png";

const customIcon = new L.Icon({
  iconUrl: iconoRobo,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MarcadoresMap = ({ incidentes, onMarkerClick }) => (
  <>
    {incidentes.map((incidente) => (
      <Marker
        key={incidente.id}
        position={{ lat: -0.091172, lng: -78.438555 }} // O la posición real de cada incidente
        icon={customIcon}
        eventHandlers={{
          click: () => onMarkerClick(incidente.id),
        }}
      >
        <Tooltip direction="top" offset={[0, -32]} opacity={1} permanent={false}>
          {incidente.type}
        </Tooltip>
      </Marker>
    ))}
  </>
);

export default MarcadoresMap;