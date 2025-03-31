import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Spinner } from 'react-bootstrap';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import '../../assets/scss/partials/widget/_trends.scss';

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const TeamTrends = () => {
  const [selectedTeams, setSelectedTeams] = useState(['GER', 'ESP']);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  const teamList = ['GER', 'ESP', 'ITA', 'FRA', 'ENG', 'NED', 'POR', 'BEL', 'CRO'];

  useEffect(() => {
    if (selectedTeams.length > 0) {
      fetchTrends(selectedTeams);
    }
  }, [selectedTeams]);

  const fetchTrends = async (codes) => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5001/api/nations/trends', {
        params: { team_codes: codes.join(',') }
      });
      setTrendData(res.data);
    } catch (err) {
      console.error('Error fetching trends:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSelection = (code) => {
    setSelectedTeams(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const colors = ['#FFD700', '#1E90FF', '#32CD32', '#FF69B4', '#FF8C00', '#8A2BE2', '#FF4500'];

  const metrics = [
    { key: 'goals_scored', label: 'Goals Scored', type: 'line' },
    { key: 'wins', label: 'Wins', type: 'bar' },
    { key: 'win_ratio', label: 'Win Ratio', type: 'line' },
    { key: 'total_attendance', label: 'Total Attendance', type: 'bar' },
    { key: 'red_cards', label: 'Red Cards', type: 'bar' },
    { key: 'penalties', label: 'Penalties Taken', type: 'bar' },
    { key: 'avg_temperature', label: 'Avg Temperature (°C)', type: 'line' }
  ];

  const years = trendData.length > 0 ? trendData[0].stats.map(d => d.year) : [];

  const getChartDataset = (metric) => trendData.map((team, idx) => ({
    label: team.team_code,
    data: team.stats.map(s => s[metric.key]),
    borderColor: colors[idx % colors.length],
    backgroundColor: colors[idx % colors.length],
    tension: 0.4,
    fill: metric.type === 'line' ? false : true
  }));

  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>;
  }

  return (
    <div className="trends-container">
      <h2 className="section-title">📊 UEFA EURO Team Performance Trends</h2>

      <Form className="team-selection mb-4">
        {teamList.map(code => (
          <Form.Check
            key={code}
            type="checkbox"
            label={code}
            checked={selectedTeams.includes(code)}
            onChange={() => handleTeamSelection(code)}
            className="team-checkbox me-3"
            inline
          />
        ))}
      </Form>

      {metrics.map((metric, idx) => (
        <div key={idx} className="chart-block">
          <h5 className="chart-title">{metric.label}</h5>
          {metric.type === 'line' ? (
            <Line
              data={{ labels: years, datasets: getChartDataset(metric) }}
              options={{ responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }}
            />
          ) : (
            <Bar
              data={{ labels: years, datasets: getChartDataset(metric) }}
              options={{ responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TeamTrends;
