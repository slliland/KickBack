import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Image, Card as BsCard, Button, Toast, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Card from '../../components/Card/MainCard';

const ProfilePage = () => {
  const [showEmailCard, setShowEmailCard] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const emailCardRef = useRef(null);
  const mailIconRef = useRef(null);
  const email = 'yuchiensong@gmail.com';

  // Click-away-to-close behavior
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emailCardRef.current &&
        !emailCardRef.current.contains(e.target) &&
        !mailIconRef.current.contains(e.target)
      ) {
        setShowEmailCard(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const renderTooltip = (text) => <Tooltip>{text}</Tooltip>;

  return (
    <React.Fragment>
      <Row className="justify-content-center">
        <Col md={8} className="position-relative">
          <Card title="👋 Welcome to My Space">
            <div className="d-flex flex-column align-items-center text-center">
              <Image
                src="https://avatars.githubusercontent.com/u/98658345?v=4"
                roundedCircle
                width="120"
                height="120"
                alt="Yujian Song"
                className="mb-3"
              />
              <h4>Yujian Song</h4>
              <p className="text-muted mb-2">Software Engineer | CMU MSE Student</p>
              <p className="text-center">
                Passionate about AI, software architecture, and building engaging digital experiences. Experienced in full-stack development, data-driven design, and cloud platforms.
              </p>
              <div className="mt-3 d-flex gap-4">
                <OverlayTrigger placement="top" overlay={renderTooltip('GitHub')}>
                  <a href="https://github.com/slliland" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github fa-lg"></i>
                  </a>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={renderTooltip('LinkedIn')}>
                  <a href="https://www.linkedin.com/in/yujian-song-839394309/" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-linkedin fa-lg"></i>
                  </a>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={renderTooltip('Email')}>
                  <span
                    ref={mailIconRef}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowEmailCard(!showEmailCard)}
                  >
                    <i className="fas fa-envelope fa-lg"></i>
                  </span>
                </OverlayTrigger>
              </div>
            </div>
          </Card>

          {/* Floating Email Card */}
          {showEmailCard && (
            <div
              ref={emailCardRef}
              className="email-card position-absolute"
              style={{
                top: '100%',
                right: '10%',
                zIndex: 10,
                animation: 'fadeIn 0.3s ease-in-out'
              }}
            >
              <BsCard className="shadow-sm border-0" style={{ width: '260px' }}>
                <BsCard.Body>
                  <h6 className="mb-2">📧 Email</h6>
                  <p className="mb-2 text-muted" style={{ wordBreak: 'break-all' }}>{email}</p>
                  <Button variant="outline-primary" size="sm" onClick={handleCopy}>
                    Copy to Clipboard
                  </Button>
                </BsCard.Body>
              </BsCard>
            </div>
          )}

          {/* Toast for Copy */}
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={2000}
            autohide
            className="position-absolute top-0 end-0 m-3"
            bg="success"
          >
            <Toast.Body className="text-white">Copied!</Toast.Body>
          </Toast>
        </Col>
      </Row>

      {/* Inline Fade-In Style */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .email-card {
            margin-top: 10px;
          }
        `}
      </style>
    </React.Fragment>
  );
};

export default ProfilePage;
