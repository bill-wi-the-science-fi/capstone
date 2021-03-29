import React from 'react'
import {Button, Col, Form} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as yup from 'yup'
import getWeb3 from '../common/getWeb3'
import Nominate from '../contracts/Nominate.json'
import {postTransaction, newTransaction} from '../store'

// import {getSingleAward} from '../store'

/**
 * COMPONENT
 */

const regEx = /^\d+(?:\.\d{0,2})$/

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
          const donationAmount = evt.donation.toString()
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
                    value: web3.utils.toWei(donationAmount, 'ether')
                  })
                  .on('transactionHash', (hash) => {
                    //sending hash from pending transaction into state
                    props.newTransaction({hash: hash, award: props.awardInfo})

                    //sending user to a confirmation page with pending transaction
                    props.history.push('/confirmation')
                  })
                //console.log('contractTxn---------------------', contractTxn)
                // NEED TO PULL IN TRANSACTION HASH FROM SMART CONTRACT OUTPUT
                // REMOVE PATCHY LOGIC FROM THUNK
                // INVOKE THUNK THAT POSTS A NEW TXN TO DB
                // SHOULD BE RUNNING POST BELOW IF MM TXN IS SUCCESSFUL
                if (contractTxn.status) {
                  const txnBody = {
                    userId: props.signedInUser.id,
                    awardId: props.awardId,
                    transactionHash: contractTxn.transactionHash,
                    amountEther: web3.utils.toWei(donationAmount, 'ether'),
                    smartContractAddress: contractTxn.to
                  }
                  props.postTransaction(txnBody)
                } else {
                  // eslint-disable-next-line no-alert
                  alert(
                    `Transaction was not able to settle on the blockchain. Please refer to MetaMask for more information on transaction with hash ${contractTxn.transactionHash}`
                  )
                }
              } catch (error) {
                console.log(error)
              }
            } else {
              // eslint-disable-next-line no-alert
              alert(
                'In order to donate, please connect at least 1 MetaMask account on the Ropsten Network'
              )
            }
          } catch (error) {
            // eslint-disable-next-line no-alert
            alert(
              'In order to donate, please install Metamask and connect at least one account on the Ropsten Network'
            )
            console.log(error)
          }
        }
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
              isValid={
                touched.donation &&
                !errors.donation &&
                regEx.test(values.donation)
              }
            />
          </Form.Group>
          <Button className="m-2" variant="outline-success" type="submit">
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
    signedInUser: state.signedInUser,
    previousTransaction: state.transactions.previousTransaction
  }
}

const mapDispatch = (dispatch) => {
  return {
    postTransaction: (txnData) => dispatch(postTransaction(txnData)),
    newTransaction: (hash) => dispatch(newTransaction(hash))
  }
}

export default connect(mapState, mapDispatch)(DonateForm)
