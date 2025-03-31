import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Form,
  Spinner,
  Row,
  Col,
  Accordion,
  Button
} from 'react-bootstrap';
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
import { allTeamCode, teamNameData, teamColor } from '../utils/teamMap';


ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const allTeams = allTeamCode;

const teamNameMap = teamNameData;

const teamMetadata = Object.fromEntries(
  allTeams.map(code => {
    const region = ['ISL', 'NOR', 'SWE', 'FIN', 'DEN'].includes(code)
      ? 'Northern Europe'
      : ['ESP', 'POR', 'ITA', 'GRE', 'ALB', 'MKD'].includes(code)
      ? 'Southern Europe'
      : ['GER', 'SUI', 'AUT', 'CZE', 'SVK', 'HUN', 'TCH'].includes(code)
      ? 'Central Europe'
      : ['FRA', 'ENG', 'BEL', 'NED', 'IRL', 'SCO', 'WAL'].includes(code)
      ? 'Western Europe'
      : 'Eastern Europe';

    const achievement =
      ['GER', 'ESP', 'FRA', 'ITA', 'NED', 'GRE', 'CZE', 'TCH', 'USSR', 'YUG'].includes(code)
        ? 'EURO Winners'
        : ['ENG', 'POR', 'BEL', 'RUS', 'CRO'].includes(code)
        ? 'EURO Finalists'
        : ['FIN', 'ALB', 'ISL', 'MKD'].includes(code)
        ? 'EURO Debutants'
        : 'Others';

    return [code, { region, achievement }];
  })
);

const TeamTrends = () => {
  const [selectedTeams, setSelectedTeams] = useState(['GER', 'ESP']);
  const [trendData, setTrendData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('All');
  const [loading, setLoading] = useState(true);

  const groupedByRegion = allTeams.reduce((acc, code) => {
    const region = teamMetadata[code]?.region || 'Other';
    if (!acc[region]) acc[region] = [];
    acc[region].push(code);
    return acc;
  }, {});

  const handleSelectAll = () => setSelectedTeams(allTeams);
  const handleClearAll = () => setSelectedTeams([]);

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

  const filterTeamList = () => {
    return allTeams.filter(code => {
      const name = teamNameMap[code]?.toLowerCase() || '';
      const region = teamMetadata[code]?.region || '';
      const ach = teamMetadata[code]?.achievement || '';
      const matchesSearch = name.includes(searchTerm.toLowerCase()) || code.includes(searchTerm.toUpperCase());
      const matchesFilter = filterBy === 'All' || region === filterBy || ach === filterBy;
      return matchesSearch && matchesFilter;
    });
  };

  const colors = teamColor;

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
    fill: metric.type !== 'line'
  }));

  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>;
  }

  return (
    <div className="trends-container">
      <h2 className="section-title">📊 UEFA EURO Team Performance Trends</h2>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by name or code..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select onChange={e => setFilterBy(e.target.value)} value={filterBy}>
            <option>All</option>
            <option>Western Europe</option>
            <option>Eastern Europe</option>
            <option>Southern Europe</option>
            <option>Northern Europe</option>
            <option>Central Europe</option>
            <option>EURO Winners</option>
            <option>EURO Finalists</option>
            <option>EURO Debutants</option>
            <option>Others</option>
          </Form.Select>
        </Col>
      </Row>

      <div className="d-flex justify-content-between mb-2">
        <Button variant="outline-primary" onClick={handleSelectAll}>Select All</Button>
        <Button variant="outline-secondary" onClick={handleClearAll}>Clear All</Button>
      </div>

      <Accordion defaultActiveKey="0" alwaysOpen className="team-accordion mb-4">
        {Object.entries(groupedByRegion).map(([region, codes], idx) => (
          <Accordion.Item eventKey={idx.toString()} key={region}>
            <Accordion.Header>{region}</Accordion.Header>
            <Accordion.Body className="d-flex flex-wrap">
              {codes.map(code => (
                <Form.Check
                  key={code}
                  type="checkbox"
                  label={`${teamNameMap[code]} (${code})`}
                  checked={selectedTeams.includes(code)}
                  onChange={() => handleTeamSelection(code)}
                  className="team-checkbox me-3 mb-2"
                  inline
                />
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {metrics.map((metric, idx) => (
        <div key={idx} className="chart-block mb-5">
          <h5 className="chart-title">{metric.label}</h5>
          {metric.type === 'line' ? (
            <Line
              data={{ labels: years, datasets: getChartDataset(metric) }}
              options={{
                responsive: true,
                plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } },
                scales: { y: { beginAtZero: true } }
              }}
            />
          ) : (
            <Bar
              data={{ labels: years, datasets: getChartDataset(metric) }}
              options={{
                responsive: true,
                plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } },
                scales: { y: { beginAtZero: true } }
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TeamTrends;
