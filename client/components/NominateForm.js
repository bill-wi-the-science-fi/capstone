import React, {Component} from 'react'
import {Button, Col, Form} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as yup from 'yup'
import getWeb3 from '../common/getWeb3'
import Nominate from '../contracts/Nominate.json'
import {nominateUser} from '../store'

/**
 * COMPONENT
 */

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email('Invalid email').required('Required'),
  category: yup.string().required(),
  donation: yup.number().required(),
  title: yup.string().required(),
  awardDescription: yup.string().required()

  // file: yup.mixed().required()
})

class NominateForm extends Component {
  constructor() {
    super()
    this.onSubmit = this.onSubmit.bind(this)
  }
  async componentDidMount() {
    try {
      // Get network provider and web3 instance. -> web3 attached to state
      const web3 = await getWeb3()
      // check if window object has ethereum object provided -> MM

      // Use web3 to get the user's accounts.
      // promps user to select which accounts the website shoul have access to -> pick first one
      const accounts = await web3.eth.getAccounts()
      console.log('accounts from componentDidMount', accounts)
      // Get the contract instance.
      const networkId = await web3.eth.net.getId()
      console.log('networkId---------------------', networkId)
      //const deployedNetwork = Nominate.networks[networkId];
      const deployedNetwork = Nominate.networks[networkId]
      const instance = new web3.eth.Contract(
        Nominate.abi,
        deployedNetwork && deployedNetwork.address
      )
      const balance = await instance.methods.balanceOfContract().call()
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.

      this.setState((state) => ({
        ...state,
        web3,
        accounts,
        contract: instance,
        storageValue: web3.utils.fromWei(balance.toString(), 'ether')
      }))
    } catch (error) {
      // Catch any errors for any of the above operations.
      // *** if browser does not have metamask -> will throw error
      console.log(
        error,
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
    }
  }

  /* async  */ onSubmit(formValues) {
    // formValues.preventDefault()
    // const {
    //   title,
    //   category,
    //   description,
    //   // imgUrl,
    //   donationLimit,
    //   // nominatorId,
    //   nomineeEmail,
    //   nomineeFirst,
    //   nomineeLast,
    //   donationTotal
    // } = formValues
    formValues.nominatorId = this.props.signedInUser.id
    // this.props.nominateUser(formValues)
    // await this.startAwardAndDonate(
    //   this.state.form.awardId,
    //   null,
    //   this.state.form.amount
    // )
    console.log(formValues)
  }

  render() {
    console.log(this.state)
    return (
      <Formik
        validationSchema={schema}
        onSubmit={this.onSubmit}
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          category: '',
          donation: '',
          title: '',
          awardDescription: ''
          // file: null
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
              <Form.Group as={Col} md="4" controlId="validationFormik103">
                <Form.Label>Award Description</Form.Label>
                <Form.Control
                  type="text"
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
              <Form.Group as={Col} md="4" controlId="validationFormik105">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Category"
                  name="category"
                  value={values.category}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isValid={touched.category && !errors.category}
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
  return {
    ...state,
    signedInUser: state.signedInUser
  }
}

const mapDispatch = (dispatch) => {
  return {
    nominateUser: (formData) => dispatch(nominateUser(formData))
  }
}

export default connect(mapState, mapDispatch)(NominateForm)
