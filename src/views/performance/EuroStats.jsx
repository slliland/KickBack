import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { extent } from 'd3-array';
import { scaleQuantize } from 'd3-scale';
import { geoCentroid } from 'd3-geo';
import { Chart as ChartJS, ScatterController, LinearScale, PointElement, Tooltip, Title } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import trophyIcon from '../../assets/icons/trophy.png';
import '../../assets/scss/partials/widget/_euroStats.scss';

ChartJS.register(ScatterController, LinearScale, PointElement, Tooltip, Title);

// GeoJSON & API endpoints
const GEO_URL = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson";
const STATS_URL = "http://127.0.0.1:5000/api/euro/stats";
const MATCHES_ENDPOINT = (code) => `http://127.0.0.1:5000/api/euro/matches/${code}`;

const Dashboard = () => {
  // State
  const [geoData, setGeoData] = useState(null);
  const [countryStats, setCountryStats] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [goalsData, setGoalsData] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  // 1) Load Europe's GeoJSON
  useEffect(() => {
    fetch(GEO_URL)
      .then(res => res.json())
      .then(data => {
        setGeoData(data);
        console.log("Loaded Europe GeoJSON:", data);
      })
      .catch(err => console.error("Failed to load GeoJSON:", err));
  }, []);

  // 2) Load aggregated stats (including success_score)
  useEffect(() => {
    fetch(STATS_URL)
      .then(res => res.json())
      .then(data => {
        setCountryStats(data);
        console.log("Country stats loaded:", data);
      })
      .catch(err => console.error("Failed to load stats:", err));
  }, []);

  // 3) Dynamic domain for success_score
  const [minScore, maxScore] = extent(countryStats, d => d.success_score);
  const domainMin = minScore !== undefined ? minScore : 0;
  const domainMax = maxScore !== undefined ? maxScore : 1;

  // 4) Diverging color scale across your actual success_score range
  const colorScale = scaleQuantize()
    .domain([domainMin, domainMax])
    .range([
      "#d73027", "#f46d43", "#fdae61", "#fee08b",
      "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"
    ]);

  // 5) On country click => set selected & fetch match data
  const handleCountryClick = (countryCode) => {
    console.log("Clicked country code:", countryCode);
    const clickedStat = countryStats.find(
      s => (s.country_code ?? "").toUpperCase() === countryCode.toUpperCase()
    );
    console.log("Clicked stat object:", clickedStat);
    setSelectedCountry(clickedStat || null);

    // Fetch match data for the chart
    fetch(MATCHES_ENDPOINT(countryCode))
      .then(res => res.json())
      .then(data => {
        console.log(`Match data for ${countryCode}:`, data);
        setGoalsData(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Failed to load match data:", err);
        setGoalsData([]);
      });
  };

  // 6) Scatter chart data
  const chartData = {
    datasets: [
      {
        label: selectedCountry
          ? `Goals over the years for ${selectedCountry.country}`
          : "No Country Selected",
        data: goalsData.map(d => ({ x: d.year, y: d.goals_scored })),
        backgroundColor: goalsData.map(d => {
          if (d.result === 'win') return 'green';
          if (d.result === 'draw') return 'orange';
          return 'red';
        })
      }
    ]
  };

  return (
    <div className="dashboard-container">
      <h1>UEFA EURO Performance Dashboard</h1>
      <p className="subtitle">Analyzing Success Scores and Goal Statistics Across Europe</p>
      <p className="subtitle">Click on a country to view details</p>

      <div
        className="map-container"
        style={{
          width: "900px",
          height: "600px",
          margin: "0 auto"
        }}
      >
        {geoData ? (
          <ComposableMap
            projection="geoAzimuthalEqualArea"
            projectionConfig={{
              rotate: [-10, -52, 0],
              scale: 700
            }}
            width={900}
            height={600}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={geoData}>
              {({ geographies }) => {
                console.log("Geographies count:", geographies.length);
                return geographies.map(geo => {
                  // Retrieve the ISO code
                  const isoA3 = (geo.properties.ISO3 || geo.properties.iso3 || "").toUpperCase();
                  if (!isoA3) return null; // skip if none

                  // Find success score for this code
                  const stat = countryStats.find(
                    c => (c.country_code ?? "").toUpperCase() === isoA3
                  );
                  // Default to 0 if not found
                  const score = stat?.success_score ?? 0;
                  const fillColor = colorScale(score);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredCountry(stat || null)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => stat && handleCountryClick(stat.country_code)}
                      style={{
                        default: {
                          fill: fillColor,
                          stroke: "#fff",
                          strokeWidth: 1,
                          outline: "none"
                        },
                        hover: {
                          fill: "#ffd700",
                          stroke: "#fff",
                          strokeWidth: 1.5,
                          outline: "none"
                        },
                        pressed: {
                          fill: "#ffa500",
                          stroke: "#fff",
                          strokeWidth: 1.5,
                          outline: "none"
                        }
                      }}
                    />
                  );
                });
              }}
            </Geographies>

            {/* TROPHY MARKERS: For countries with tournament_wins > 0 */}
            {geoData.features.map(feature => {
              const isoA3 = (feature.properties.ISO3 || "").toUpperCase();
              if (!isoA3) return null; 
              // find matching stats
              const stat = countryStats.find(
                c => (c.country_code ?? "").toUpperCase() === isoA3
              );
              if (!stat || stat.tournament_wins <= 0) return null;

              // get centroid for placing the marker
              const [lng, lat] = geoCentroid(feature);

              // occasionally, geoCentroid might return [NaN, NaN]
              if (isNaN(lng) || isNaN(lat)) return null;

              return (
                <Marker key={isoA3} coordinates={[lng, lat]}>
                  <image
                    href={trophyIcon}
                    width={20}
                    height={20}
                    style={{ pointerEvents: "none" }}
                  />
                </Marker>
              );
            })}
          </ComposableMap>
        ) : (
          <p>Loading Europe map...</p>
        )}

        {hoveredCountry && hoveredCountry.country_code && (
          <div
            className="tooltip"
            style={{
              position: "absolute",
              top: 50,
              left: 50
            }}
          >
            <strong>
              {hoveredCountry.country} ({hoveredCountry.country_code})
            </strong>
            <br />
            Score: {hoveredCountry.success_score?.toFixed(2) || 0}
            <br />
            Trophies: {hoveredCountry.tournament_wins || 0}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="legend">
        <h4>Success Score</h4>
        <div className="legend-colors">
          {colorScale.range().map((color) => {
            const domain = colorScale.invertExtent(color);
            return (
              <div key={color} className="legend-color-item">
                <span className="color-box" style={{ background: color }} />
                <span>
                  {domain.map(d => d.toFixed(2)).join(" - ")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Panel */}
      {selectedCountry && (
        <div className="country-info">
          <h2>
            {selectedCountry.country} ({selectedCountry.country_code})
          </h2>
          <p>
            <strong>Success Score:</strong> {selectedCountry.success_score}
          </p>
          <p>
            <strong>Tournaments:</strong> {selectedCountry.tournament_appearances}
          </p>
          <p>
            <strong>Wins:</strong> {selectedCountry.total_wins}
          </p>
          <p>
            <strong>Draws:</strong> {selectedCountry.total_draws}
          </p>
          <p>
            <strong>Losses:</strong> {selectedCountry.total_losses}
          </p>
          <p>
            <strong>Goals Scored:</strong> {selectedCountry.total_goals_scored}
          </p>
          <p>
            <strong>Goals Conceded:</strong> {selectedCountry.total_goals_conceded}
          </p>
          <p>
            <strong>Finals Appearances:</strong> {selectedCountry.finals_appearances}
          </p>
          <p>
            <strong>Tournament Wins:</strong> {selectedCountry.tournament_wins}
          </p>
        </div>
      )}

      {/* Chart */}
      <div className="chart-container">
        {selectedCountry ? (
          <>
            <h2>{selectedCountry.country}: Goals Over the Years</h2>
            {goalsData.length > 0 ? (
              <Scatter
                data={{
                  datasets: [
                    {
                      label: `Goals of ${selectedCountry.country}`,
                      data: goalsData.map(d => ({ x: d.year, y: d.goals_scored })),
                      backgroundColor: goalsData.map(d => {
                        if (d.result === "win") return "green";
                        if (d.result === "draw") return "orange";
                        return "red";
                      })
                    }
                  ]
                }}
                options={{
                  scales: {
                    x: {
                      type: "linear",
                      title: { display: true, text: "Tournament Year" },
                      ticks: { stepSize: 4 }
                    },
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: "Goals Scored" }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (ctx) => {
                          const point = goalsData[ctx.dataIndex];
                          return `Year: ${point.year}, Goals: ${point.goals_scored}, Result: ${point.result}`;
                        }
                      }
                    }
                  }
                }}
              />
            ) : (
              <p>No match data found for {selectedCountry.country}.</p>
            )}
          </>
        ) : (
          <p className="no-country">Click a country on the map to see goals data.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
