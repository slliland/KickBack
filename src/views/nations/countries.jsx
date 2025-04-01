import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Spinner, Table, Dropdown } from 'react-bootstrap';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import '../../assets/scss/partials/widget/_country-profiles.scss';

const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

const defaultCenter = {
  lat: 47,
  lng: 9,
};

const CountryProfiles = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAlGFXzYM5_5lYFSrdKJcdJmlrTFnGkmrE',
    language: 'en',
    region: 'US',
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios.get(`${API_BASE}/api/nations/profiles`)
      .then(res => {
        setCountries(res.data);
        setSelectedCountry(res.data[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading country profiles:', err);
        setLoading(false);
      });
  }, []);

  const handleSelect = (code) => {
    const country = countries.find(c => c.team_code === code);
    setSelectedCountry(country);
  };

  if (loading || !isLoaded) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="country-profiles-container">
      <h2 className="section-title"> UEFA EURO Country Profiles</h2>

      <Dropdown onSelect={handleSelect} className="text-center mb-3">
        <Dropdown.Toggle variant="warning">
          {selectedCountry?.team || 'Select a Country'}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {countries.map(c => (
            <Dropdown.Item key={c.team_code} eventKey={c.team_code}>
              {c.team}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {selectedCountry && (
        <Card className="mt-4 shadow">
          <Card.Header>
            <h4>{selectedCountry.team}</h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5> General Stats</h5>
                <ul>
                  <li><strong>Appearances:</strong> {selectedCountry.total_appearances}</li>
                  <li><strong>Wins:</strong> {selectedCountry.total_wins}</li>
                  <li><strong>Losses:</strong> {selectedCountry.total_losses}</li>
                  <li><strong>Draws:</strong> {selectedCountry.total_draws}</li>
                </ul>
              </Col>
              <Col md={6}>
                <h5> Location on Map</h5>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  zoom={4}
                  center={{
                    lat: selectedCountry.lat || defaultCenter.lat,
                    lng: selectedCountry.lng || defaultCenter.lng
                  }}
                  options={{
                    styles: [
                      {
                        elementType: 'geometry',
                        stylers: [{ color: '#1d2c4d' }]
                      },
                      {
                        elementType: 'labels.text.stroke',
                        stylers: [{ color: '#1a3646' }]
                      },
                      {
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#ffffff' }]
                      },
                      {
                        featureType: 'administrative.country',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#4b6878' }]
                      },
                      {
                        featureType: 'poi',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#ffffff' }]
                      }
                    ],
                    disableDefaultUI: true,
                    zoomControl: true,
                  }}
                >
                  <Marker
                    position={{
                      lat: selectedCountry.lat || defaultCenter.lat,
                      lng: selectedCountry.lng || defaultCenter.lng
                    }}
                  />
                </GoogleMap>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col>
                <h5> Top 5 Scorers</h5>
                <Table striped bordered hover size="sm" responsive>
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>Goals</th>
                      <th>Position</th>
                      <th>Height (cm)</th>
                      <th>Birth Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCountry.top_scorers?.length > 0 ? (
                      selectedCountry.top_scorers.map((scorer, idx) => (
                        <tr key={idx}>
                          <td>{scorer.name}</td>
                          <td>{scorer.goals}</td>
                          <td>{scorer.position || '—'}</td>
                          <td>{scorer.height || '—'}</td>
                          <td>{scorer.birth_date || '—'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default CountryProfiles;
