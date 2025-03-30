import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import axios from 'axios';

const EuroExtremes = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5001/api/euro/extremes')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return null;

  return (
    <Row>
      <Col md={6} xl={4}>
        <Card>
          <Card.Body>
            <h6 className="mb-3 text-uppercase text-muted">Most Goals</h6>
            <div className="d-flex align-items-center">
              <i className="feather icon-target f-30 text-c-red me-3" />
              <div>
                <h3 className="f-w-300">{data.maxGoals.goals}</h3>
                <span className="text-muted">Goals in {data.maxGoals.year}</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} xl={4}>
        <Card>
          <Card.Body>
            <h6 className="mb-3 text-uppercase text-muted">Highest Attendance</h6>
            <div className="d-flex align-items-center">
              <i className="feather icon-users f-30 text-c-green me-3" />
              <div>
                <h3 className="f-w-300">{data.maxAttendance.attendance.toLocaleString()}</h3>
                <span className="text-muted">In {data.maxAttendance.year}</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} xl={4}>
        <Card>
          <Card.Body>
            <h6 className="mb-3 text-uppercase text-muted">Most Red Cards</h6>
            <div className="d-flex align-items-center">
              <i className="feather icon-alert-triangle f-30 text-c-orange me-3" />
              <div>
                <h3 className="f-w-300">{data.maxRedCards.red_cards}</h3>
                <span className="text-muted">In {data.maxRedCards.year}</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} xl={4}>
        <Card>
          <Card.Body>
            <h6 className="mb-3 text-uppercase text-muted">Most Matches</h6>
            <div className="d-flex align-items-center">
              <i className="feather icon-calendar f-30 text-c-blue me-3" />
              <div>
                <h3 className="f-w-300">{data.maxMatches.matches}</h3>
                <span className="text-muted">In {data.maxMatches.year}</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} xl={4}>
        <Card>
          <Card.Body>
            <h6 className="mb-3 text-uppercase text-muted">Top Winner</h6>
            <div className="d-flex align-items-center">
              <i className="feather icon-award f-30 text-c-purple me-3" />
              <div>
                <h3 className="f-w-300">{data.topWinner.winner}</h3>
                <span className="text-muted">{data.topWinner.titles} titles</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default EuroExtremes;
