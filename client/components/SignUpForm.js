import React, {Component} from 'react'
import {Button, Col, Form} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as yup from 'yup'
import {auth} from '../store'

/**
 * COMPONENT
 */

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().required(),
  imgUrl: yup.string()
})

class SignUpForm extends Component {
  constructor() {
    super()
    this.onSubmit = this.onSubmit.bind(this)
  }
  async componentDidMount() {
    //make a call to get the email, first and last IF it already is coming from a referral link?
  }

  async onSubmit(formValues) {
    // formValues.preventDefault()
    // formValues.nominatorId = this.props.signedInUser.id
    // await this.props.nominateUser(formValues)
    // let didIwork = await this.startAwardAndDonate(
    //   this.props.nominate.awardId,
    //   this.props.nominate.recipient,
    //   formValues.donationTotal
    // )
  }

  render() {
    console.log(this.state, 'state -------------------')
    return (
      <Formik
        validationSchema={schema}
        onSubmit={this.props.onSubmit}
        initialValues={{
          firstName: '',
          lastName: '',
          email: 'default from server?',
          password: '',
          imgUrl: ','
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
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
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
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target[0].value
      const password = evt.target[1].value
      const firstName = evt.target[1].value
      const lastName = evt.target[1].value

      dispatch(auth(email, password, formName))
      //Sending different things?
    }
  }
}

export default connect(mapState, mapDispatch)(SignUpForm)
