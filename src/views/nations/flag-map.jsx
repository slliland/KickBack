import React, { useEffect, useState } from 'react';
import { GoogleMap, MarkerF, InfoWindow, useLoadScript } from '@react-google-maps/api';
import axios from 'axios';
import '../../assets/scss/partials/widget/_flagMap.scss';

const mapContainerStyle = {
  width: '100%',
  height: '700px'
};

// Default center set to London, England
const defaultCenter = { lat: 51.5074, lng: -0.1278 };

// Custom map style for a European look (sample style)
const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#c9b2a6' }]
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#dcd2be' }]
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ae9e90' }]
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#dfd2ae' }]
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#dfd2ae' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#93817c' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#a5b076' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#447530' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#f5f1e6' }]
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#fdfcf8' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#f8c967' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e9bc62' }]
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [{ color: '#e98d58' }]
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#db8555' }]
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [{ color: '#dfd2ae' }]
  },
  {
    featureType: 'transit.line',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8f7d77' }]
  },
  {
    featureType: 'transit.line',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#ebe3cd' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b9d3c2' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#92998d' }]
  }
];

const FlagMap = () => {
  const [locations, setLocations] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const apiKey = 'AIzaSyAlGFXzYM5_5lYFSrdKJcdJmlrTFnGkmrE';

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    language: 'en',
  });

  useEffect(() => {
    axios.get('http://localhost:5001/api/nations/map')
      .then(res => {
        setLocations(res.data);
        setLoadingLocations(false);
      })
      .catch(err => {
        console.error('Failed to fetch map data:', err);
        setFetchError('Failed to load map data. Please try again later.');
        setLoadingLocations(false);
      });
  }, []);

  return (
    <div className="flag-map-container">
      <h2 className="section-title">Euro Cup Flags Map</h2>
      {loadError && (
        <div className="error-message">Error loading Google Maps. Please check your API key.</div>
      )}
      {(!isLoaded || loadingLocations) && (
        <div className="loading-message">Loading Map...</div>
      )}
      {fetchError && (
        <div className="error-message">{fetchError}</div>
      )}
      {isLoaded && !loadingLocations && !fetchError && !loadError && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={4}
          center={defaultCenter}
          options={{ styles: mapStyle, fullscreenControl: false }}
        >
          {locations.map(location => (
            <MarkerF
              key={location.team_code}
              position={{ lat: location.lat, lng: location.lng }}
              icon={{
                url: location.flag,
                scaledSize: new window.google.maps.Size(32, 32)
              }}
              onClick={() => setSelectedCountry(location)}
            />
          ))}
          {selectedCountry && (
            <InfoWindow
              position={{ lat: selectedCountry.lat, lng: selectedCountry.lng }}
              onCloseClick={() => setSelectedCountry(null)}
            >
              <div className="info-box">
                <h3>{selectedCountry.team} ({selectedCountry.team_code})</h3>
                <p><strong>Appearances:</strong> {selectedCountry.total_appearances}</p>
                <p><strong>Wins:</strong> {selectedCountry.total_wins}</p>
                <p><strong>Draws:</strong> {selectedCountry.total_draws}</p>
                <p><strong>Losses:</strong> {selectedCountry.total_losses}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default FlagMap;
