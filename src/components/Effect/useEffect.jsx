import React, { useEffect, useState } from 'react';
import { Table, Card, Col } from 'react-bootstrap';
import axios from 'axios';

const TopChampions = () => {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/euro/winners')
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
            <tbody>
              {winners.map((team, index) => (
                <tr key={index}>
                  <td>
                    <img
                      className="rounded-circle"
                      style={{ width: '40px' }}
                      src={`/flags/${team.country_code}.png`}
                      alt={team.country}
                    />
                  </td>
                  <td>
                    <h6 className="mb-1">{team.country}</h6>
                    <p className="m-0">{team.wins} titles</p>
                  </td>
                  <td>
                    <h6 className="text-muted">Rank #{index + 1}</h6>
                  </td>
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
