import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getDaysLeft } from '../../components/Effect/Utility';
import axios from 'axios';
import EuroExtremes from '../../components/Effect/EuroExtremes';


import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';

const DashDefault = () => {
  const [newsItems, setNewsItems] = useState([]);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  console.log(API_BASE); 

  useEffect(() => {
    axios.get(`${API_BASE}/api/euro/news`)
      .then(res => setNewsItems(res.data))
      .catch(err => console.error('Error fetching news:', err));
  }, []);

  const [topCountries, setTopCountries] = useState([]);
  const daysLeft = getDaysLeft();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/championships/top-countries`);
        setTopCountries(res.data);
      } catch (err) {
        console.error('Error fetching top countries:', err);
      }
    };

    fetchData();
  }, []);

  const tabContent = (
    <React.Fragment>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Silje Larsen</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
            3784
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar2} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Julie Vad</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
            3544
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar3} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Storm Hanse</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
            2739
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Frida Thomse</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
            1032
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar2} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Silje Larsen</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
            8750
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar3} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Storm Hanse</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
            8750
          </span>
        </div>
      </div>
      
    </React.Fragment>
  );
  return (
    <React.Fragment>
       <Row className="align-items-center mb-4">
        <Col md={5} className="text-center">
          <img
            src="https://bsmedia.business-standard.com/_media/bs/img/about-page/thumb/464_464/1623388886.jpg"
            alt="UEFA Euro Logo"
            style={{ maxWidth: '100%', height: 'auto', padding: '20px' }}
          />
        </Col>
        <Col md={7}>
          <Card>
            <Card.Body>
              <Card.Title as="h4">UEFA European Championship Overview</Card.Title>
              <Card.Text as="div">
                <p>
                  The UEFA European Championship, also known as the Euros, is one of the most prestigious football tournaments
                  in the world. Held every four years since 1960, it brings together top national teams from across Europe to
                  compete for continental glory. With dramatic matches, legendary players, and passionate fans, the tournament
                  has become a cornerstone of international football.
                </p>
                <p>
                  Before entering the tournament, all teams other than the host nations (which qualify automatically) compete in
                  a qualifying process. Until 2016, the championship winners could compete in the following year's FIFA
                  Confederations Cup. From 2020 onward, the winner competes in the Finalissima.
                </p>
                <p>
                  The most recent championship, held in Germany in 2024, was won by Spain, who lifted a record fourth European
                  title after beating England 2–1 in the final at the Olympiastadion in Berlin.
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="align-items-stretch">
        {/* Left Column */}
        <Col md={6} xl={8} className="d-flex flex-column">
          <Card className="Recent-Users widget-focus-lg flex-fill d-flex flex-column" id="top-countries">
            <Card.Header>
              <Card.Title as="h5">Top 10 Winning Countries</Card.Title>
            </Card.Header>
            <Card.Body className="px-0 py-2">
              <Table responsive hover className="recent-users">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }}>#</th>
                    <th>Country</th>
                    <th style={{ textAlign: 'center' }}>Wins</th>
                  </tr>
                </thead>
                <tbody>
                  {topCountries.map((item, index) => (
                    <tr key={index}>
                      <td
                        style={{ verticalAlign: 'middle', textAlign: 'center' }}
                      >
                        {index + 1}
                      </td>
                      <td
                        className="d-flex align-items-center"
                        style={{ verticalAlign: 'middle' }}
                      >
                        <img
                          src={item.flag}
                          alt={item.country}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginRight: '12px',
                          }}
                        />
                        <span style={{ fontWeight: 500 }}>{item.country}</span>
                      </td>
                      <td
                        style={{
                          verticalAlign: 'middle',
                          textAlign: 'center',
                          fontWeight: 500,
                        }}
                      >
                        {item.wins}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: two stacked cards */}
        <Col md={6} xl={4} className="d-flex flex-column">
          {/* Top Card (fixed height, no flex-fill) */}
          <Card className="card-event euro-card mb-3" id="euro-2028">
            <Card.Body>
              <div className="row align-items-center justify-content-between">
                <div className="col">
                  <h5 className="m-0 euro-title">Upcoming Euro Cup (2028)</h5>
                </div>
                <div className="col-auto">
                  <label className="label theme-bg2 text-white f-14 f-w-400 float-end">
                    {getDaysLeft()} days left
                  </label>
                </div>
              </div>

              <h2 className="mt-2 f-w-300 euro-teams-count">
                24 <sub className="text-muted f-14">Teams</sub>
              </h2>

              <h6 className="text-muted mt-3 mb-0 euro-links">
                Stay updated with the latest news:
                <br />
                <a
                  href="https://www.uefa.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="euro-link"
                >
                  UEFA Official Euro Site
                </a>
                <a
                  href="https://www.skysports.com/football/news"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="euro-link"
                >
                  Sky Sports Euro Coverage
                </a>
              </h6>

              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/UEFA_Euro_2028_logo.svg/2880px-UEFA_Euro_2028_logo.svg.png"
                alt="UEFA Euro 2028 Logo"
                className="euro-logo"
              />
            </Card.Body>
          </Card>

          {/* Bottom News Card (flex-fill) */}
          <Card className="card-event shadow-sm border-0 flex-fill d-flex flex-column" id="latest-news">
            <Card.Header className="bg-transparent border-bottom">
              <Card.Title as="h5" className="mb-0">
                Latest UEFA News
              </Card.Title>
            </Card.Header>
            {/* Make the body scrollable if content is too large */}
            <Card.Body
              className="flex-fill custom-scrollbar"
              style={{
                overflowY: 'auto',
                minHeight: 0,
                backdropFilter: 'blur(3px)',
              }}
            >
              {newsItems.map((item, idx) => (
                <div
                  className="news-item p-2 rounded mb-3"
                  key={idx}
                  style={{
                    transition: 'all 0.3s ease',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  <h6 className="mb-1">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="news-link"
                      style={{
                        color: '#3f4d67',
                        fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'color 0.2s ease-in-out',
                      }}
                    >
                      {item.title.length > 80
                        ? item.title.slice(0, 80) + '…'
                        : item.title}
                    </a>
                  </h6>
                  <small className="text-muted">
                    {new Date(item.fetched_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </small>
                  <hr className="my-2" />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4 mt-5" id="fun-facts">
        <Col>
          <h4 className="mb-1 text-center">⚽ Fun Facts About the UEFA Euro Cup</h4>
          <p className="text-muted text-center mb-4" style={{ fontSize: '0.95rem' }}>
            Discover the most exciting records and unforgettable moments from the history of the Euros.
          </p>
        </Col>
      </Row>
      <Row>
        <EuroExtremes />
      </Row>
    </React.Fragment>
  );
};

export default DashDefault;
