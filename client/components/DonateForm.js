import React from 'react'
import {Button, Col, Form} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as yup from 'yup'
import getWeb3 from '../common/getWeb3'
import Nominate from '../contracts/Nominate.json'
import {postTransaction} from '../store'

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
              const networkId = await web3.eth.net.getId()
              //const deployedNetwork = Nominate.networks[networkId];
              const deployedNetwork = Nominate.networks[networkId]
              const contract = new web3.eth.Contract(
                Nominate.abi,
                deployedNetwork && deployedNetwork.address
              )
              try {
                const contractTxn = await contract.methods
                  .donateFunds(props.awardId)
                  .send({
                    from: accounts[0],
                    value: web3.utils.toWei(evt.donation.toString(), 'ether')
                  })
                // NEED TO PULL IN TRANSACTION HASH FROM SMART CONTRACT OUTPUT
                // REMOVE PATCHY LOGIC FROM THUNK
                // INVOKE THUNK THAT POSTS A NEW TXN TO DB
                // SHOULD BE RUNNING POST BELOW IF MM TXN IS SUCCESSFUL
                console.log('contractTxn---------------------', contractTxn)
                const txnBody = {
                  userId: props.signedInUser.id,
                  awardId: props.awardId,
                  trasnactionHash: null,
                  amountEther: evt.donation,
                  smartContractAddress: null
                }
                props.postTransaction(txnBody)
              } catch (error) {
                console.log(error)
              }
            } else {
              alert(
                'In order to donate, please connect at least 1 MetaMask account on the Ropsten Network'
              )
            }
          } catch (error) {
            alert(
              'In order to donate, please install Metamask and connect at least one account on the Ropsten Network'
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
  return {
    postTransaction: (txnData) => dispatch(postTransaction(txnData))
  }
}

export default connect(mapState, mapDispatch)(DonateForm)
