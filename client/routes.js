import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Login,
  SignUpForm,
  HomeLanding,
  AllAwards,
  SingleAward,
  NominateForm,
  EditAwards,
  Intro,
  Confirmation,
  UserAwards
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
        <Route exact path="/" component={HomeLanding} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUpForm} />
        <Route path="/nominateLogin" component={Login} />

        {
          /* <Route path="/signup/nominated" component={SignUpForm} /> */
          // can we remove donate path}
        }

        {/* <Route path="/donate" component={DonateForm} /> */}
        <Route path="/confirmation" component={Confirmation} />
        <Route exact path="/awards/:id" component={SingleAward} />
        <Route path="/awards" component={AllAwards} />
        <Route path="/intro" component={Intro} />
        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}
            <Route path="/nominate" component={NominateForm} />
            <Route
              exact
              path="/user/:userId/awards/:id/edit"
              component={EditAwards}
            />
            <Route exact path="/" component={HomeLanding} />
            <Route path="/home" component={HomeLanding} />
            <Route path="/user/:id" component={UserAwards} />
          </Switch>
        )}
        <Route path="/nominate">
          <Redirect to="/nominateLogin" />
        </Route>
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
