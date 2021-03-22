import React, {Component} from 'react'
import {Button, Col, Form} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as yup from 'yup'
// import {getSingleAward} from '../store'

/**
 * COMPONENT
 */

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email('Invalid email').required('Required'),
  // category: yup.string().required(),
  donation: yup.number().required(),
  title: yup.string().required(),
  description: yup.string().required()

  // file: yup.mixed().required()
})

class FormExample extends Component {
  componentDidMount() {}

  render() {
    return (
      <Formik
        validationSchema={schema}
        onSubmit={console.log('hello')}
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          category: '',
          donation: '',
          title: '',
          description: '',
          file: null
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
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="validationFormik104">
                <Form.Label>Award Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Award Title"
                  name="title"
                  value={values.title}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isValid={touched.title && !errors.title}
                />
              </Form.Group>
              <Form.Group
                as={Col}
                md="4"
                controlId="exampleForm.ControlSelect1"
              >
                <Form.Label>Select Award Category</Form.Label>
                <Form.Control as="select">
                  <option>Open-Source</option>
                  <option>Community</option>
                  <option>Behind the scenes</option>
                  <option>Health and wellness</option>
                  <option>Volunteer</option>
                  <option>Animals</option>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormik105">
                <Form.Label>Donation</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Donation"
                  name="donation"
                  value={values.donation}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isValid={touched.donation && !errors.donation}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="validationFormik103">
                <Form.Label>Award Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="What are they doing that is so amazing"
                  name="awardDescription"
                  onBlur={handleBlur}
                  value={values.awardDescription}
                  onChange={handleChange}
                  isValid={touched.awardDescription && !errors.awardDescription}
                />
              </Form.Group>
            </Form.Row>

            <Form.Group>
              <Form.File
                className="position-relative"
                required
                name="Image: Show us the great work they're doing!"
                label="image"
                onChange={handleChange}
                isInvalid={!!errors.image}
                feedback={errors.image}
                id="validationFormik106"
                feedbackTooltip
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                required
                name="terms"
                label="I agree to donate"
                onChange={handleChange}
                isInvalid={!!errors.terms}
                feedback={errors.terms}
                id="validationFormik107"
                feedbackTooltip
              />
            </Form.Group>
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
  return {
    signedInUser: state.signedInUser
  }
}

const mapDispatch = (dispatch) => {
  return {}
}

export default connect(mapState, mapDispatch)(FormExample)
