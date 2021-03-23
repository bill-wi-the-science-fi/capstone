import React, {Component} from 'react'
import {Button, Col, Form} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as yup from 'yup'
import {authSignUp} from '../store'
import getWeb3 from '../common/getWeb3'
/**
 * COMPONENT
 */

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email('Invalid email').required('Required'),
  password: yup
    .string()
    .required('Please enter your password')
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Password must contain at least 8 characters, one uppercase, one number and one special case character'
    ),
  passwordConfirm: yup
    .string()
    .required('Please confirm your password')
    .when('password', {
      is: (password) => !!(password && password.length > 0),
      then: yup.string().oneOf([yup.ref('password')], "Password doesn't match")
    }),
  imgUrl: yup.string(),
  pin: yup.string().required()
})

class SignUpForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      urlCheckForPin: this.props.match.path === '/signup',
      accounts: []
    }
  }
  async componentDidMount() {
    try {
      const web3 = await getWeb3()
      const accounts = await web3.eth.getAccounts()
      if (accounts) {
        this.setState((prevState) => ({
          ...prevState,
          accounts: accounts
        }))
      }
    } catch (error) {
      alert('In order to sign up please install and connect MetaMask')
      this.props.history.goBack()
    }
  }

  render() {
    return (
      <Formik
        validationSchema={schema}
        onSubmit={(evt, state) => this.props.onSubmit(evt, this.state)}
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          passwordConfirm: '',
          imgUrl: '',
          pin: ''
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          isValid,
          errors
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="validationFormik101">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={values.firstName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isValid={touched.firstName && !errors.firstName}
                />
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormik102">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  onBlur={handleBlur}
                  value={values.lastName}
                  onChange={handleChange}
                  isValid={touched.lastName && !errors.lastName}
                />
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormikUsername2">
                <Form.Label>Email</Form.Label>
                {/* <InputGroup hasValidation> */}
                <Form.Control
                  type="text"
                  placeholder="email"
                  name="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isValid={touched.email && !errors.email}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.email}
                </Form.Control.Feedback>
                {/* </InputGroup> */}
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isValid={touched.password && !errors.password}
                />
              </Form.Group>
              <Form.Group controlId="formBasicPasswordConfirm">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Please re-enter"
                  name="passwordConfirm"
                  value={values.passwordConfirm}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isValid={touched.passwordConfirm && !errors.passwordConfirm}
                />
              </Form.Group>
              {!this.state.urlCheckForPin ? (
                <Form.Group controlId="formBasicPasswordConfirm">
                  <Form.Label>PIN</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="PIN from email"
                    name="pin"
                    value={values.pin}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isValid={touched.pin && !errors.pin}
                  />
                </Form.Group>
              ) : (
                ''
              )}
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="validationFormik104">
                <Form.Label>Image Url</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Image Url"
                  name="imgUrl"
                  value={values.imgUrl}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isValid={touched.imgUrl && !errors.imgUrl}
                />
              </Form.Group>
            </Form.Row>
            <Button type="submit">Submit form</Button>
          </Form>
        )}
      </Formik>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {}
}

const mapDispatch = (dispatch) => {
  return {
    onSubmit(evt, state) {
      console.log(evt)
      const {firstName, lastName, email, password, imgUrl, pin} = evt
      const ethPublicAddress = state.accounts[0]
      dispatch(
        authSignUp(
          {ethPublicAddress, firstName, lastName, email, password, imgUrl, pin},
          'signup'
        )
      )
    }
  }
}

export default connect(mapState, mapDispatch)(SignUpForm)
