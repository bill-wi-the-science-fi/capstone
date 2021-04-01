import React from 'react'
import {Card, Row} from 'react-bootstrap'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */

export const Confirmation = (props) => {
  console.log('help', props)
  const {previousTransaction, pendingTransaction} = props.transactions
  const {hash, award} = pendingTransaction

  if (award && Object.keys(pendingTransaction).length) {
    if (!Object.keys(previousTransaction).length) {
      return (
        <div className="container-fluid text-center">
          <div
            className="col-lg-12 p-3 justify-content-center"
            key={award.award_id}
          >
            <Row className="m-3 justify-content-center">
              <h2>Your donation is pending approval!</h2>
            </Row>
            <Row className="m-3 justify-content-center">
              <img
                className="confirmation-img rounded"
                src={award.award_imageUrl}
              />
            </Row>
            <Row className="m-3 justify-content-center">
              <p>
                {award.award_recipient_firstName}{' '}
                {award.award_recipient_firstName}
              </p>
              <p>{award.award_title}</p>
              <p>{award.award_description}</p>
            </Row>
            <Row className="m-3 justify-content-center">
              <p className="m-3 p-3">
                Here is your hash (a.k.a. your blockchain transaction ID):{' '}
                <a
                  href={`https://ropsten.etherscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noreferror noreferrer"
                >
                  {hash}.
                </a>{' '}
                Click on the link to monitor the status of your transaction on
                the blockchain to see when it's been confirmed. You can also
                click on MetaMask and look at your "Activity" tab. Continue to
                look at some other
                <a href="https://pay-eth-forward.herokuapp.com/awards">
                  {' wonderful people in the meantime.'}
                </a>
              </p>
            </Row>
          </div>
        </div>
      )
    } else
      return (
        <div className="text-center">
          <div className="col-lg-13 p-3 justify-content-center">
            <Card border="success" style={{width: '60vw'}}>
              <Card.Body>
                <Card.Title>
                  Your donation has been approved!!! Thank you for your donation
                  and continue to browse some other extraordinary people on our
                  website.
                </Card.Title>
              </Card.Body>
            </Card>
          </div>
        </div>
      )
  } else {
    return <div>You currently have no donations</div>
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    transactions: state.transactions
  }
}

export default connect(mapState, null)(Confirmation)
