import React, { useEffect, useState } from 'react';
import { Table, Card, Col } from 'react-bootstrap';
import axios from 'axios';

const TopChampions = () => {
  const [winners, setWinners] = useState([]);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/championships/top-countries`)
      .then((res) => setWinners(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Col md={6} xl={8}>
      <Card className="Recent-Users widget-focus-lg">
        <Card.Header>
          <Card.Title as="h5">Top 10 Winning Countries</Card.Title>
        </Card.Header>
        <Card.Body className="px-0 py-2">
          <Table responsive hover className="recent-users">
            <thead>
              <tr>
                <th>#</th>
                <th>Country</th>
                <th>Titles</th>
              </tr>
            </thead>
            <tbody>
              {winners.map((team, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="d-flex align-items-center gap-2">
                    <img
                      src={team.flag}
                      alt={team.country}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginRight: '10px'
                      }}
                    />
                    <span>{team.country}</span>
                  </td>
                  <td>{team.wins}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default TopChampions;
