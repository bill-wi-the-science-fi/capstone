import React from 'react'
import {Button, Col, Form, InputGroup} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as yup from 'yup'
// import {getSingleAward} from '../store'

/**
 * COMPONENT
 */

const schema = yup.object().shape({
  donation: yup.number().required(),
  donations: yup.number().required()
})

function DonateForm() {
  return (
    <Formik
      validationSchema={schema}
      onSubmit={console.log}
      initialValues={{
        donation: 0,
        donations: 0
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
          <Form.Group as={Col} md="1.5" controlId="validationFormik101">
            <Form.Label>Donation</Form.Label>
            <Form.Control
              type="number"
              placeholder="Please Donate!"
              name="donation"
              value={values.donation}
              onBlur={handleBlur}
              onChange={handleChange}
              isValid={touched.donation && !errors.donation}
            />
          </Form.Group>
          <Form.Group as={Col} md="1.5" controlId="validationFormik1012">
            <Form.Label>Donations</Form.Label>
            <Form.Control
              type="number"
              placeholder="Please Donates!"
              name="donations"
              value={values.donations}
              onBlur={handleBlur}
              onChange={handleChange}
              isValid={touched.donations && !errors.donations}
            />
          </Form.Group>
          <Button type="submit">Donate</Button>
        </Form>
      )}
    </Formik>
  )
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

export default connect(mapState, mapDispatch)(DonateForm)
