import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "utils/http-interceptor";
import { GoogleMap, useLoadScript, DrawingManager, Polygon } from "@react-google-maps/api";

const libraries: ("drawing")[] = ["drawing"];

interface City {
  _id: string;
  nameAR: string;
  nameHE: string;
}

const DeliveryAreaForm = () => {
  const { id, cityId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [city, setCity] = useState<City | null>(null);
  const [geometry, setGeometry] = useState<any>(null); // GeoJSON Polygon
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 32.11453261988036, lng: 34.97186886900658  });
  const [minETA, setMinETA] = useState<number | ''>('');
  const [maxETA, setMaxETA] = useState<number | ''>('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  // Load city details
  useEffect(() => {
    if (cityId) {
      axiosInstance.get(`/delivery/city/${cityId}`).then((res: any) => setCity(res));
    }
  }, [cityId]);

  // Load area for edit
  useEffect(() => {
    if (id) {
      axiosInstance.get(`/delivery/area/${id}`).then((res: any) => {
        setName(res.name);
        setGeometry(res.geometry); // Should be GeoJSON Polygon
        setMinETA(res.minETA ?? '');
        setMaxETA(res.maxETA ?? '');
        if (res.geometry?.coordinates?.[0]) {
          // Calculate center of polygon
          const coords = res.geometry.coordinates[0];
          const bounds = new google.maps.LatLngBounds();
          coords.forEach((coord: number[]) => {
            bounds.extend({ lat: coord[1], lng: coord[0] });
          });
          setMapCenter({
            lat: bounds.getCenter().lat(),
            lng: bounds.getCenter().lng()
          });
        }
      });
    }
  }, [id]);

  // Convert Google Maps Polygon to GeoJSON Polygon
  const getGeoJsonFromPolygon = (polygonObj: google.maps.Polygon) => {
    const path = polygonObj.getPath();
    const coordinates: number[][] = [];
    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coordinates.push([point.lng(), point.lat()]);
    }
    // GeoJSON polygons must be closed (first = last)
    if (coordinates.length > 0 && (coordinates[0][0] !== coordinates[coordinates.length-1][0] || coordinates[0][1] !== coordinates[coordinates.length-1][1])) {
      coordinates.push([...coordinates[0]]);
    }
    return {
      type: "Polygon",
      coordinates: [coordinates],
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!geometry) return alert("Please draw a polygon on the map");
    if (!cityId) return alert("City ID is missing");
    const data = { name, geometry, cityId, minETA: minETA === '' ? undefined : minETA, maxETA: maxETA === '' ? undefined : maxETA };
    if (id) {
      await axiosInstance.post(`/delivery/area/update/${id}`, data);
    } else {
      await axiosInstance.post("/delivery/area/add", data);
    }
    navigate("/admin/delivery-areas");
  };

  const onPolygonComplete = useCallback((polygonObj: google.maps.Polygon) => {
    const geoJson = getGeoJsonFromPolygon(polygonObj);
    setGeometry(geoJson);
    polygonObj.setMap(null); // Remove drawn polygon

    // Center map on the new polygon
    const bounds = new google.maps.LatLngBounds();
    const path = polygonObj.getPath();
    for (let i = 0; i < path.getLength(); i++) {
      bounds.extend(path.getAt(i));
    }
    map?.fitBounds(bounds);
    setMapCenter({
      lat: bounds.getCenter().lat(),
      lng: bounds.getCenter().lng()
    });
  }, [map]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Convert GeoJSON to Google Maps LatLng array for rendering
  const renderPolygonPath = geometry?.coordinates?.[0]?.map((coord: number[]) => ({ lng: coord[0], lat: coord[1] })) || [];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">{id ? "עריכת" : "הוספת"} אזור משלוח</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">שם</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">עיר</label>
          <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50">
            {city ? `${city.nameAR} / ${city.nameHE}` : 'Loading...'}
          </div>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">זמן הגעה מינימלי (דקות)</label>
            <input
              type="number"
              min="0"
              value={minETA}
              onChange={e => setMinETA(e.target.value === '' ? '' : Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="הזן זמן מינימלי"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">זמן הגעה מקסימלי (דקות)</label>
            <input
              type="number"
              min="0"
              value={maxETA}
              onChange={e => setMaxETA(e.target.value === '' ? '' : Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="הזן זמן מקסימלי"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">צייר גבולות האזור</label>
          <div style={{ height: "400px", width: "100%" }}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={mapCenter}
              zoom={13.5}
              onLoad={onMapLoad}
            >
              {geometry && renderPolygonPath.length > 0 && (
                <Polygon
                  path={renderPolygonPath}
                  options={{
                    fillColor: "#000",
                    fillOpacity: 0.3,
                    strokeColor: "#111",
                    strokeWeight: 2,
                  }}
                />
              )}
              {map && (
                <DrawingManager
                  onPolygonComplete={onPolygonComplete}
                  options={{
                    drawingMode: null,
                    drawingControl: true,
                    drawingControlOptions: {
                      position: google.maps.ControlPosition.TOP_CENTER,
                      drawingModes: [google.maps.drawing.OverlayType.POLYGON]
                    }
                  }}
                />
              )}
            </GoogleMap>
          </div>
        </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">שמור</button>
      </form>
    </div>
  );
};

export default DeliveryAreaForm; 