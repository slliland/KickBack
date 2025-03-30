import React from 'react';
import { ListGroup, Dropdown } from 'react-bootstrap';
import useWindowSize from '../../../../hooks/useWindowSize';
import NavSearch from './NavSearch';

const NavLeft = () => {
  const windowSize = useWindowSize();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  let navItemClass = ['nav-item'];
  if (windowSize.width <= 575) {
    navItemClass.push('d-none');
  }

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
        <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(' ')}>
          <Dropdown align="start">
            <Dropdown.Toggle variant="link" id="dropdown-basic">
              Explore
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => scrollToSection('top-countries')}>
                🏆 Top 10 Winning Countries
              </Dropdown.Item>
              <Dropdown.Item onClick={() => scrollToSection('euro-2028')}>
                🏟️ Upcoming Euro Cup (2028)
              </Dropdown.Item>
              <Dropdown.Item onClick={() => scrollToSection('latest-news')}>
                📰 Latest UEFA News
              </Dropdown.Item>
              <Dropdown.Item onClick={() => scrollToSection('fun-facts')}>
                🎉 Fun Facts About the UEFA Euro Cup
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>

        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <NavSearch windowWidth={windowSize.width} />
        </ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  );
};

export default NavLeft;
