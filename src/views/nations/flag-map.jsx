import React, { useEffect, useState } from 'react';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import axios from 'axios';
import '../../assets/scss/partials/widget/_flagMap.scss';

const mapContainerStyle = {
  width: '100%',
  height: '700px'
};

const FlagMap = () => {
  const [locations, setLocations] = useState([]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  useEffect(() => {
    axios.get('http://localhost:5001/api/nations/map')
      .then(res => setLocations(res.data))
      .catch(err => console.error('Failed to fetch map data:', err));
  }, []);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="flag-map-container">
      <h2 className="section-title">🗺️ Interactive Team Flags Map</h2>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={3.5}
        center={{ lat: 50, lng: 10 }}
      >
        {locations.map(({ code, lat, lng, flag }) => (
          <MarkerF
            key={code}
            position={{ lat, lng }}
            icon={{
              url: flag,
              scaledSize: new window.google.maps.Size(32, 22)
            }}
            onClick={() => window.location.href = `/nations/profiles/${code}`}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default FlagMap;
