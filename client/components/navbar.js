import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap';
import {logout} from '../store';

const NavbarBootstrap = ({handleClick, isLoggedIn, userId}) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Navbar.Brand as={Link} to="/">
        Pay Eth Forward
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-0">
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link href="/awards">All Awards</Nav.Link>
        </Nav>

        {isLoggedIn ? (
          <React.Fragment>
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/nominate">
                Nominate
              </Nav.Link>
            </Nav>

            <Nav className="pull-right">
              <Nav.Link as={Link} to={`/user/${userId}`}>
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/" onClick={handleClick}>
                Logout
              </Nav.Link>
            </Nav>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/nominateLogin">
                Nominate
              </Nav.Link>
            </Nav>

            <Nav className="pull-right">
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/signup">
                Sign Up
              </Nav.Link>
            </Nav>
          </React.Fragment>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.signedInUser.id,
    userId: state.signedInUser.id
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    }
  };
};

export default connect(mapState, mapDispatch)(NavbarBootstrap);

/**
 * PROP TYPES
 */
