import React, { useRef, useEffect } from "react";

function GoogleMapPicker({ lng, lat, radius, onChange, onRadiusChange }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    let google = window.google;
    if (!google) return;
    let mapNode = mapRef.current;
    const myLatlng = new google.maps.LatLng(lat || 32.0853, lng || 34.7818);
    const mapOptions = {
      zoom: 12,
      center: myLatlng,
      scrollwheel: false,
      zoomControl: true,
    };
    const map = new google.maps.Map(mapNode, mapOptions);

    // Marker
    let marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      draggable: true,
    });
    markerRef.current = marker;
    marker.addListener("dragend", function (e) {
      onChange(e.latLng.lng(), e.latLng.lat());
      if (circleRef.current) {
        circleRef.current.setCenter(e.latLng);
      }
    });
    map.addListener("click", function (e) {
      marker.setPosition(e.latLng);
      onChange(e.latLng.lng(), e.latLng.lat());
      if (circleRef.current) {
        circleRef.current.setCenter(e.latLng);
      }
    });

    // Circle
    let circle = new google.maps.Circle({
      map: map,
      center: myLatlng,
      radius: radius || 1000,
      editable: true,
      draggable: false,
      fillColor: "#2196f3",
      fillOpacity: 0.2,
      strokeColor: "#2196f3",
      strokeOpacity: 0.7,
      strokeWeight: 2,
    });
    circleRef.current = circle;

    circle.addListener("radius_changed", function () {
      if (onRadiusChange) onRadiusChange(circle.getRadius());
    });
    circle.addListener("center_changed", function () {
      const c = circle.getCenter();
      if (c) onChange(c.lng(), c.lat());
    });

    // Keep circle in sync with props
    circle.setRadius(radius || 1000);
    circle.setCenter(myLatlng);

    return () => {
      marker.setMap(null);
      circle.setMap(null);
    };
  }, [lng, lat, radius]);

  return (
    <div className="rounded h-64 w-full" ref={mapRef} style={{ minHeight: 250 }} />
  );
}

export default GoogleMapPicker; 