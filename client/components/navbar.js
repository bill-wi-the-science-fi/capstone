import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap'
import {logout} from '../store'

const NavbarBootstrap = ({handleClick, isLoggedIn}) => (
  <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
    <Navbar.Brand href="#home">Boilermaker</Navbar.Brand>

    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="home">Home</Nav.Link>
        <Nav.Link href="nominate">Nominate</Nav.Link>
        {isLoggedIn ? (
          <Nav.Link href="home" onClick={handleClick}>
            Logout
          </Nav.Link>
        ) : (
          <React.Fragment>
            <Nav.Link href="login">Login</Nav.Link>
            <Nav.Link href="signup">Sign Up</Nav.Link>
          </React.Fragment>
        )}
      </Nav>
      <Nav>
        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-light">Search</Button>
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
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
