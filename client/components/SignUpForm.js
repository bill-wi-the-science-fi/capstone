import React, {Component} from 'react';
import {Button, Col, Form} from 'react-bootstrap';
import {connect} from 'react-redux';
import {Formik} from 'formik';
import * as yup from 'yup';
import {authSignUp, checkPin, createVerifiedUser, auth} from '../store';
import {storage} from '../firebase/index';

import getWeb3 from '../common/getWeb3';
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
  file: yup.mixed()
});

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlCheckForPin: this.props.match.path === '/signup',
      accounts: [],
      pin: ''
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleImage = this.handleImage.bind(this);
  }
  handleImage(e) {
    e.persist();
    if (e.target.files[0]) {
      this.setState({file: e.target.files[0]});
    }
  }

  async componentDidMount() {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      if (accounts) {
        this.setState((prevState) => ({
          ...prevState,
          accounts: accounts
        }));
      }
      const params = new URLSearchParams(window.location.search);
      if (params) {
        const email = params.get('email');
        const pin = params.get('pin');
        this.setState({pin});
        await this.props.checkPin({email, pin});
      }
    } catch (error) {
      alert(
        'In order to sign up please install and connect MetaMask on the Ropsten Network'
      );
      this.props.history.goBack();
    }
  }
  async onSubmit(evt) {
    // const {pin} = evt
    const {firstName, lastName, email, password} = evt;
    const {file} = this.state;
    const uploadTask = storage.ref(`images/${file.name}`).put(file);
    await uploadTask.on(
      'state_changed',
      () => {},
      (error) => {
        console.log(error);
      },
      () =>
        storage
          .ref('images')
          .child(file.name)
          .getDownloadURL()
          .then(async (imageUrl) => {
            const ethPublicAddress = this.state.accounts[0];
            if (this.props.singleUser.userHasPin) {
              await this.props.createVerifiedUser({
                ethPublicAddress,
                firstName,
                lastName,
                email,
                password,
                imageUrl,
                pin: this.state.pin
              });
              await this.props.auth(email, password, 'login');
            } else {
              this.props.authSignUp(
                {
                  ethPublicAddress,
                  firstName,
                  lastName,
                  email,
                  password,
                  imageUrl
                },
                'signup'
              );
            }
          })
    );
  }
  render() {
    return (
      <Formik
        validationSchema={schema}
        onSubmit={(evt) => {
          return this.onSubmit(evt);
        }}
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          passwordConfirm: ''
          //pin: ''
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
          <div className="container">
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Row>
                <Form.Group
                  as={Col}
                  md="6 ml-0 mr-0 pl-1 pr-2"
                  controlId="validationFormik101"
                >
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
                <Form.Group
                  as={Col}
                  md="6 ml-0 mr-0 pl-1 pr-2"
                  controlId="validationFormik102"
                >
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
              </Form.Row>
              <Form.Row>
                <Form.Group
                  as={Col}
                  md="6 ml-0 mr-0 pl-1 pr-2"
                  controlId="validationFormikUsername2"
                >
                  <Form.Label>Email</Form.Label>
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
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="6 ml-0 mr-0 pl-1 pr-2"
                  controlId="formBasicPassword"
                >
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
              </Form.Row>

              <Form.Row>
                <Form.Group
                  as={Col}
                  md="6 ml-0 mr-0 pl-1 pr-2"
                  controlId="formBasicPasswordConfirm"
                >
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
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} md="5 ml-0" controlId="file">
                  <Form.File
                    className="position-relative ml-0"
                    name="file"
                    label="Upload an image"
                    onChange={(e) => this.handleImage(e)}
                    isInvalid={!!errors.file}
                    feedback={errors.file}
                    id="validationFormik107"
                    feedbackTooltip
                  />
                </Form.Group>
              </Form.Row>

              <Button
                className="ml-6 ml-0 mr-0 pl-2 pr-2"
                variant="success"
                type="submit"
              >
                Submit
              </Button>
            </Form>
          </div>
        )}
      </Formik>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {singleUser: state.singleUser};
};

const mapDispatch = (dispatch) => {
  return {
    checkPin: (info) => dispatch(checkPin(info)),
    createVerifiedUser: (info) => dispatch(createVerifiedUser(info)),
    auth: (email, password, type) => {
      dispatch(auth(email, password, type));
    },
    authSignUp: (
      {ethPublicAddress, firstName, lastName, email, password, imageUrl},
      type
    ) =>
      dispatch(
        authSignUp(
          {ethPublicAddress, firstName, lastName, email, password, imageUrl},
          type
        )
      )
  };
};

export default connect(mapState, mapDispatch)(SignUpForm);
