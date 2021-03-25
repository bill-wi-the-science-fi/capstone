import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap'
import {logout} from '../store'

const NavbarBootstrap = ({handleClick, isLoggedIn}) => (
  <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
    <Navbar.Brand as={Link} to="/">
      Boilermaker
    </Navbar.Brand>

    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/">
          Home
        </Nav.Link>
        <Nav.Link as={Link} to="/awards">
          View Awards
        </Nav.Link>

        {isLoggedIn ? (
          <React.Fragment>
            <Nav.Link as={Link} to="/nominate">
              Nominate
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
      <Nav>
        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-success">Search</Button>
        </Form>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.signedInUser.id
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(NavbarBootstrap)

/**
 * PROP TYPES
 */
