import React from 'react'
import {Card} from 'react-bootstrap'
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
            className="col-lg-13 p-3 justify-content-center"
            key={award.award_id}
          >
            <Card border="success" style={{width: '60vw'}}>
              <Card.Body>
                <Card.Title>Your donation is pending approval! </Card.Title>
              </Card.Body>
            </Card>
            <Card border="success" style={{width: '60vw'}}>
              <Card.Img variant="top" src={award.award_imageUrl} />
              <Card.Body>
                <Card.Title>{award.award_title}</Card.Title>
                <Card.Text>{award.award_description}</Card.Text>
              </Card.Body>
            </Card>
            <Card border="success" style={{width: '60vw'}}>
              <Card.Body>
                <Card.Title>
                  Here is your hash:
                  <a
                    href={`https://ropsten.etherscan.io/tx/${hash}`}
                    target="_blank"
                    rel="noreferror noreferrer"
                  >
                    {hash}.
                  </a>
                  Click on the link to monitor the status of your transaction on
                  the blockchain. This page will automatically refresh upon the
                  donation being confirmed on the blockchain! Continue to look
                  at some other wonderful people at the time.
                </Card.Title>
              </Card.Body>
            </Card>
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
            <span>
              <Card border="success" style={{width: '60vw'}}>
                <Card.Img variant="top" src={award.award_imageUrl} />
                <Card.Body>
                  <Card.Title>{award.award_title}</Card.Title>
                  <Card.Text>{award.award_description}</Card.Text>
                </Card.Body>
              </Card>
            </span>
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
