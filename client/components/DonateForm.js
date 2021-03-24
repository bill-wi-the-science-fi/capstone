import React from 'react'
import {Button, Col, Form} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as yup from 'yup'
import getWeb3 from '../common/getWeb3'
import Nominate from '../contracts/Nominate.json'

// import {getSingleAward} from '../store'

/**
 * COMPONENT
 */

const schema = yup.object().shape({
  donation: yup.number().min(0).required()
})

function DonateForm(props) {
  return (
    <Formik
      validationSchema={schema}
      onSubmit={
        //if !metamask get MM
        async (evt) => {
          try {
            const web3 = await getWeb3()
            const accounts = await web3.eth.getAccounts()
            if (accounts) {
              console.log('accounts', accounts)
              console.log(props.awardId)
              console.log('evt', evt.donation)
              const networkId = await web3.eth.net.getId()
              //const deployedNetwork = Nominate.networks[networkId];
              const deployedNetwork = Nominate.networks[networkId]
              const contract = new web3.eth.Contract(
                Nominate.abi,
                deployedNetwork && deployedNetwork.address
              )

              try {
                await contract.methods.donateFunds(props.awardId).send({
                  from: accounts[0],
                  value: web3.utils.toWei(evt.donation.toString(), 'ether')
                })
              } catch (error) {
                console.log(error)
              }
            } else {
              alert(
                'In order to donate, please connect at least 1 MetaMask account'
              )
            }
          } catch (error) {
            alert(
              'In order to donate, please install Metamask and connect at least one account'
            )
            console.log(error)
          }
        }

        //if metamask... execute
      }
      initialValues={{
        donation: 0
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
          <Form.Group as={Col} md="7" controlId="validationFormik101">
            <Form.Label>Donate to this Award</Form.Label>
            <Form.Control
              type="number"
              min="0"
              placeholder="Donate in Ether"
              name="donation"
              value={values.donation}
              onBlur={handleBlur}
              onChange={handleChange}
              isValid={touched.donation && !errors.donation}
            />
          </Form.Group>
          <Button variant="outline-success" type="submit">
            Donate
          </Button>
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
