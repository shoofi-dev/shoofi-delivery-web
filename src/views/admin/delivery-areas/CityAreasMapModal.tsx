import React from "react";
import { GoogleMap, useLoadScript, Polygon } from "@react-google-maps/api";

interface Area {
  _id: string;
  name: string;
  geometry: any; // GeoJSON Polygon
}

interface CityAreasMapModalProps {
  open: boolean;
  onClose: () => void;
  areas: Area[];
  cityName: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const CityAreasMapModal: React.FC<CityAreasMapModalProps> = ({ open, onClose, areas, cityName }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
  });

  if (!open) return null;
  if (loadError) return <div>שגיאה בטעינת המפה</div>;
  if (!isLoaded) return <div>טוען מפה...</div>;

  // Center the map on the first area's first coordinate, or a default
  const defaultCenter = areas.length && areas[0].geometry?.coordinates?.[0]?.[0]
    ? { lat: areas[0].geometry.coordinates[0][0][1], lng: areas[0].geometry.coordinates[0][0][0] }
    : { lat: 32.11453261988036, lng: 34.97186886900658  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
        <button onClick={onClose} className="absolute top-2 left-2 text-lg">✕</button>
        <h2 className="text-xl font-bold mb-4">{cityName} - אזורים במפה</h2>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={12}
        >
          {areas.map(area => (
            area.geometry?.coordinates?.[0] && (
              <Polygon
                key={area._id}
                path={area.geometry.coordinates[0].map((coord: number[]) => ({ lng: coord[0], lat: coord[1] }))}
                options={{
                  fillColor: "#2196f3",
                  fillOpacity: 0.2,
                  strokeColor: "#1976d2",
                  strokeWeight: 2,
                  clickable: false,
                }}
              />
            )
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};

export default CityAreasMapModal; 