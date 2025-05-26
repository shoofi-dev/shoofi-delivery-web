import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";
import { useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../styles.css";


export default function DeliveryArea() {
  // Store Polygon path in state
  const [path, setPath] = useState([
    { lat: 32.244116, lng: 34.964393 },
    { lat: 32.232372, lng: 34.982392 },
    { lat: 32.221893, lng: 34.959714 },
    { lat: 32.226892, lng: 34.941691 },
    { lat: 32.231383, lng: 34.937351 },
    { lat: 32.238318, lng: 34.937292 },
    { lat: 32.240742, lng: 34.944362 },
    { lat: 32.243767, lng: 34.953613 },
  ]);

  // Define refs for Polygon instance and listeners
  const polygonRef:any = useRef(null);
  const listenersRef:any = useRef([]);

  // Call setPath with new edited path
  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map((latLng:any) => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
      setPath(nextPath);
    }
  }, [setPath]);

  // Bind refs to current Polygon and listeners
  const onLoad = useCallback(
    (polygon:any) => {
      polygonRef.current = polygon;
      const path = polygon.getPath();
      listenersRef.current.push(
        path.addListener("set_at", onEdit),
        path.addListener("insert_at", onEdit),
        path.addListener("remove_at", onEdit)
      );
    },
    [onEdit]
  );

  // Clean up refs
  const onUnmount = useCallback(() => {
    listenersRef.current.forEach((lis:any) => lis.remove());
    polygonRef.current = null;
  }, []);

  console.log("The path state is", path);

  return (
    <div className="w-full h-full border b-1">
      xx
      <LoadScript
        id="script-loader"
        googleMapsApiKey="AIzaSyD0CSVYW-UxSDEnderEtAB9YDmYYZLu8q8"
        language="en"
        region="us"
      >
        <GoogleMap
          mapContainerClassName="App-map"
          center={{ lat: 32.233583, lng: 34.951661 }}
          zoom={15}
        >
          <Polygon
            // Make the Polygon editable / draggable
            editable
            draggable
            path={path}
            // Event used when manipulating and adding points
            onMouseUp={onEdit}
            // Event used when dragging the whole Polygon
            onDragEnd={onEdit}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{fillColor:'green'}}
            
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );

}
