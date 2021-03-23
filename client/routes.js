import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Login,
  Signup,
  HomeLanding,
  AllAwards,
  SingleAward,
  NominateForm,
  DonateForm
} from './components'
import {me} from './store'

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props

    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/nominate" component={NominateForm} />
        <Route path="/donate" component={DonateForm} />
        <Route exact path="/awards/:id" component={SingleAward} />
        <Route path="/awards" component={AllAwards} />
        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}
            <Route path="/home" component={HomeLanding} />
          </Switch>
        )}
        {/* Displays our Login component as a fallback - change this to homepage*/}
        <Route component={HomeLanding} />
      </Switch>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.signedInUser that has a truthy id.
    // Otherwise, state.signedInUser will be an empty object, and state.signedInUser.id will be falsey
    isLoggedIn: !!state.signedInUser.id
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
