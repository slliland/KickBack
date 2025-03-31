import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Dropdown, Spinner } from 'react-bootstrap';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const TeamTrends = () => {
  const [teamCode, setTeamCode] = useState('GER');
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrends = async (code) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/nations/trends/${code}`);
      setTrendData(res.data);
    } catch (err) {
      console.error('Error fetching trends:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends(teamCode);
  }, [teamCode]);

  const years = trendData.map(d => d.year);
  const goals = trendData.map(d => d.goals_scored);
  const wins = trendData.map(d => d.wins);
  const attendance = trendData.map(d => d.total_attendance);

  return (
    <div className="p-4">
      <h2 className="mb-3">📊 Team Performance Trends</h2>

      <Dropdown onSelect={(key) => setTeamCode(key)} className="mb-4">
        <Dropdown.Toggle variant="warning">{teamCode}</Dropdown.Toggle>
        <Dropdown.Menu>
          {['GER', 'FRA', 'ESP', 'ITA', 'ENG', 'NED', 'POR'].map(code => (
            <Dropdown.Item eventKey={code} key={code}>{code}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <div>
          <Line
            data={{
              labels: years,
              datasets: [
                {
                  label: 'Goals Scored',
                  data: goals,
                  borderColor: 'blue',
                  fill: false
                },
                {
                  label: 'Wins',
                  data: wins,
                  borderColor: 'green',
                  fill: false
                },
                {
                  label: 'Total Attendance',
                  data: attendance,
                  borderColor: 'orange',
                  fill: false
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top'
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TeamTrends;
