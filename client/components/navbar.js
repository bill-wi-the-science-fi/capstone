import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Dropdown,
  DropdownButton
} from 'react-bootstrap'
import {logout, fetchFilteredAwards} from '../store'

const NavbarBootstrap = (props, {handleClick, isLoggedIn, userId}) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Navbar.Brand as={Link} to="/">
        Pay Eth Forward
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/awards">
            All Awards
          </Nav.Link>
          {isLoggedIn ? (
            <React.Fragment>
              <Nav.Link as={Link} to="/nominate">
                Nominate
              </Nav.Link>
              <Nav.Link as={Link} to={`/user/${userId}`}>
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/" onClick={handleClick}>
                Logout
              </Nav.Link>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Nav.Link as={Link} to="/nominateLogin">
                Nominate
              </Nav.Link>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/signup">
                Sign Up
              </Nav.Link>
            </React.Fragment>
          )}
        </Nav>
        {props.location.pathname === '/awards' ? (
          <Nav>
            <DropdownButton
              id="dropdown-button-drop-left"
              drop="left"
              variant="info"
              title="Select Award Category"
              onSelect={(evtValue) => props.fetchFilteredAwards(evtValue)}
            >
              <Dropdown.Item eventKey="all">All Awards</Dropdown.Item>
              <Dropdown.Item eventKey="Open-Source">Open-Source</Dropdown.Item>
              <Dropdown.Item eventKey="Community">Community</Dropdown.Item>
              <Dropdown.Item eventKey="Lifetime of Awesome">
                Lifetime of Awesome
              </Dropdown.Item>
              <Dropdown.Item eventKey="Health and Wellness">
                Health and Wellness
              </Dropdown.Item>
              <Dropdown.Item eventKey="Volunteer">Volunteer</Dropdown.Item>
              <Dropdown.Item eventKey="Animals">Animals</Dropdown.Item>
              <Dropdown.Item eventKey="Heroic Act">Heroic Act</Dropdown.Item>
              <Dropdown.Item eventKey="Enviornment">Enviornment</Dropdown.Item>
              <Dropdown.Item eventKey="Activism">Activism</Dropdown.Item>
            </DropdownButton>
          </Nav>
        ) : (
          ''
        )}
      </Navbar.Collapse>
    </Navbar>
  )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.signedInUser.id,
    userId: state.signedInUser.id
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchFilteredAwards: (category) => dispatch(fetchFilteredAwards(category)),
    handleClick() {
      dispatch(logout())
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(NavbarBootstrap))

/**
 * PROP TYPES
 */
