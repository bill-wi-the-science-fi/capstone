import React, {Component} from 'react'
import {Button, Col, Form} from 'react-bootstrap'
import {connect} from 'react-redux'
import {getSingleAward, editSingleAward} from '../store'

import {Formik} from 'formik'
import * as yup from 'yup'

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  category: yup
    .string()
    .oneOf([
      'Open-Source',
      'Community',
      'Lifetime of Awesome',
      'Health and Wellness',
      'Volunteer',
      'Animals',
      'Heroic Act',
      'Enviornment',
      'Activism'
    ])
    .required(),
  title: yup.string().required(),
  description: yup.string().required(),
  imageUrl: yup.string()
})

class EditAwards extends Component {
  constructor() {
    super()

    this.onSubmit = this.onSubmit.bind(this)
  }
  async componentDidMount() {
    await this.props.getSingleAward(this.props.match.params.id)
  }

  async onSubmit(formValues) {
    try {
      console.log('submitted')
      await this.props.editSingleAward(this.props.match.params.id, formValues)
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const {singleAward} = this.props.singleAward

    return (
      <Formik
        enableReinitialize
        validationSchema={schema}
        onSubmit={this.onSubmit}
        initialValues={{
          firstName: '',
          lastName: '',
          category: '',
          title: '',
          description: '',
          imageUrl: ''
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
              <Form.Group as={Col} md="4" controlId="validationFormik103">
                <Form.Label>Award Description</Form.Label>
                <Form.Control
                  type="text"
                  as="textarea"
                  rows={3}
                  placeholder="What are they doing that is so amazing"
                  name="description"
                  onBlur={handleBlur}
                  value={values.description}
                  onChange={handleChange}
                  isValid={touched.description && !errors.description}
                />
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormik103">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Do you have a hosted image to share with us?"
                  name="imageUrl"
                  onBlur={handleBlur}
                  value={values.imageUrl}
                  onChange={handleChange}
                  isValid={touched.imageUrl && !errors.imageUrl}
                />
              </Form.Group>
              <Form.Group controlId="SelectCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={values.category}
                  name="category"
                  placeholder="Category"
                  onChange={handleChange}
                  isValid={!!touched.values}
                >
                  <option value={undefined} defaultValue>
                    Select a Category
                  </option>
                  <option value="Open-Source">Open-Source</option>
                  <option value="Community">Community</option>
                  <option value="Lifetime of Awesome">
                    Lifetime of Awesome
                  </option>
                  <option value="Health and Wellness">
                    Health and Wellness
                  </option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Animals">Animals</option>
                  <option value="Heroic Act">Heroic Act</option>
                  <option value="Enviornment">Enviornment</option>
                  <option value="Activism">Activism</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Button type="submit">Submit form</Button>
          </Form>
        )}
      </Formik>
    )
  }
}

const mapState = (state) => {
  return {
    signedInUser: state.signedInUser,
    singleAward: state.singleAward
  }
}

const mapDispatch = (dispatch) => {
  return {
    getSingleAward: (id) => dispatch(getSingleAward(id)),
    editSingleAward: (id, award) => dispatch(editSingleAward(id, award))
  }
}

export default connect(mapState, mapDispatch)(EditAwards)
