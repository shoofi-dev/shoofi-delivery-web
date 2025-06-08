import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "utils/http-interceptor";
import { GoogleMap, useLoadScript, DrawingManager, Polygon } from "@react-google-maps/api";

const libraries: ("drawing")[] = ["drawing"];

const CitiesForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [nameAR, setNameAR] = useState("");
  const [nameHE, setNameHE] = useState("");
  const [geometry, setGeometry] = useState<any>(null); // GeoJSON Polygon
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 32.23530210603023, lng: 34.951724518379834 });
  const geometryRef = useRef<any>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/delivery/city/${id}`).then((res: any) => {
        setNameAR(res.nameAR || "");
        setNameHE(res.nameHE || "");
        setGeometry(res.geometry || null);
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

  // When geometry changes, update the ref
  useEffect(() => {
    geometryRef.current = geometry;
  }, [geometry]);

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
    const latestGeometry = geometryRef.current;
    if (!latestGeometry) return alert("אנא צייר את גבולות העיר");
    if (!nameAR || !nameHE) return alert("אנא מלא את שני השדות");
    console.log('Submitting geometry:', latestGeometry);
    if (id) {
      await axiosInstance.post(`/delivery/city/update/${id}`, { nameAR, nameHE, geometry: latestGeometry });
    } else {
      await axiosInstance.post("/delivery/city/add", { nameAR, nameHE, geometry: latestGeometry });
    }
    navigate("/admin/cities");
  };

  const onPolygonComplete = useCallback((polygonObj: google.maps.Polygon) => {
    const geoJson = getGeoJsonFromPolygon(polygonObj);
    console.log('onPolygonComplete', geoJson);

    setGeometry(geoJson);
    geometryRef.current = geoJson; // update ref immediately
    polygonObj.setMap(null);
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
      <h2 className="text-2xl font-bold mb-4">{id ? 'ערוך' : 'הוסף'} עיר</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">שם (ערבית)</label>
          <input
            type="text"
            value={nameAR}
            onChange={e => setNameAR(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">שם (עברית)</label>
          <input
            type="text"
            value={nameHE}
            onChange={e => setNameHE(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">צייר גבולות העיר</label>
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
                    fillColor: "#007bff",
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded ">שמור</button>
      </form>
    </div>
  );
};

export default CitiesForm; 