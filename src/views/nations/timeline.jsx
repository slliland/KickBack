import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../../assets/scss/partials/widget/_timeline.scss';
import { Modal } from 'react-bootstrap';
import { BsFullscreen, BsFullscreenExit } from 'react-icons/bs';
import { FaPlay, FaPause } from 'react-icons/fa';

const Timeline = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [currentYear, setCurrentYear] = useState(1960);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/nations/timeline`);
        setTimelineData(res.data.sort((a, b) => a.first_participation - b.first_participation));
      } catch (error) {
        console.error('Error fetching timeline:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  useEffect(() => {
    if (filter === 'decade' && isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentYear((prev) => (prev < 2024 ? prev + 1 : 1960));
      }, 1200);
    }
    return () => clearInterval(intervalRef.current);
  }, [filter, isPlaying]);

  const toggleAutoplay = () => setIsPlaying(prev => !prev);

  const filteredData = timelineData.filter(team => {
    if (filter === 'all') return true;
    if (filter === 'winners') return team.total_wins > 0;
    if (filter === 'finalists') return team.final_appearances > 0;
    if (filter === 'decade') return team.first_participation <= currentYear;
    return true;
  });

  const expansionMilestones = {
    1980: 'Expansion to 8 teams',
    1996: 'Expansion to 16 teams',
    2016: 'Expansion to 24 teams'
  };

  const uniqueYears = [...new Set(filteredData.map(d => d.first_participation))].sort((a, b) => a - b);

  if (loading) return <div className="timeline-loading">Loading timeline...</div>;

  return (
    <div className={`timeline-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="timeline-header">
        <h2 className="timeline-title">🏆 UEFA EURO Championship Timeline</h2>
        <div className="timeline-controls">
          <div className="timeline-filters">
            <button onClick={() => setFilter('all')}>All</button>
            <button onClick={() => setFilter('winners')}>🏆 Winners</button>
            <button onClick={() => setFilter('finalists')}>🥈 Finalists</button>
            <button onClick={() => setFilter('decade')}>📅 Animated Timeline</button>
            {filter === 'decade' && (
              <button className="autoplay-toggle" onClick={toggleAutoplay}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="timeline-wrapper">
        {uniqueYears.map((year, index) => (
          <div className="timeline-year-block" key={year}>
            {expansionMilestones[year] && (
              <div className="expansion-line below-flags">
                <div className="expansion-marker" />
                <span className="expansion-label">{expansionMilestones[year]}</span>
              </div>
            )}
            <div className={`year-label ${index % 2 === 0 ? 'above' : 'below'}`}>{year}</div>
            <div className="vertical-line" />
            <div className="flag-stack">
              {filteredData
                .filter(team => team.first_participation === year)
                .map((team, idx) => (
                  <div
                    className="flag-item"
                    key={`${team.team}-${idx}`}
                    onClick={() => setSelectedTeam(team)}
                    title={`${team.team}\nFirst: ${team.first_participation}\nWins: ${team.total_wins}`}
                  >
                    {team.flag_base64 ? (
                      <img
                        src={`data:image/png;base64,${team.flag_base64}`}
                        alt={team.team}
                        className="flag-img"
                      />
                    ) : (
                      <div className="flag-placeholder">🏳️</div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <button
        className="fullscreen-toggle"
        onClick={() => setIsFullscreen(prev => !prev)}
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? <BsFullscreenExit size={22} /> : <BsFullscreen size={22} />}
      </button>

      <Modal show={!!selectedTeam} onHide={() => setSelectedTeam(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedTeam?.team}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>First Participation:</strong> {selectedTeam?.first_participation}</p>
          <p><strong>Total Participations:</strong> {selectedTeam?.total_participations}</p>
          <p><strong>Final Appearances:</strong> {selectedTeam?.final_appearances}</p>
          <p><strong>Total Wins:</strong> {selectedTeam?.total_wins}</p>
        </Modal.Body>
      </Modal>

      <div className="timeline-insights">
        <h4>The First Eleven: Timeline Insights</h4>
        <p><strong>The Founding Squads:</strong> Soviet Union, Yugoslavia, France, and Czechoslovakia kicked off the EURO saga in 1960. France stands as the lone survivor in its original form!</p>
        <p><strong>Squad Expansion:</strong> Witness the significant influx in the 1990s, coinciding with the Iron Curtain's fall, ushering a wave of fresh talent onto the European stage.</p>
        <p><strong>Consistency in Change:</strong> Despite its growth, the tournament has maintained its four-year cycle. Quality and tradition in perfect harmony.</p>
        <p><strong>Fashionably Late:</strong> Some football giants took their time joining the EURO fiesta. Portugal, for instance, didn't step onto this stage until 1984!</p>
        <p><strong>Pivotal Penalties and Tactical Shifts:</strong> EURO's Game-Changing Moments</p>
        <ul>
          <li><strong>1960 ⚽</strong> - The inaugural whistle blows, with the Soviet Union claiming victory.</li>
          <li><strong>1968 🏆</strong> - Italy triumphs in the first EURO decided by a replay.</li>
          <li><strong>1976 🥅</strong> - The penalty shootout debuts, with Czechoslovakia outgunning West Germany.</li>
          <li><strong>1980 🔢</strong> - The tournament expands to 8 teams, introducing the group stage.</li>
          <li><strong>1996 📈</strong> - Another expansion sees 16 teams take the field.</li>
          <li><strong>2016 🌍</strong> - The 24-team format kicks off, spreading the game across the continent.</li>
          <li><strong>2020 🦠</strong> - EURO 2020 becomes the first to be held across multiple countries, delayed to 2021 due to the global pandemic.</li>
        </ul>
      </div>
    </div>
  );
};

export default Timeline;
