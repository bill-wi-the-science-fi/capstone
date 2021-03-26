import React, {Component} from 'react'
import {Card} from 'react-bootstrap'
import {connect} from 'react-redux'

import {Link} from 'react-router-dom'

/**
 * COMPONENT
 */

export const Confirmation = (props) => {
  const {previousTransaction, pendingTransaction} = props.transactions
  const {hash, award} = pendingTransaction

  if (award && Object.keys(award).length) {
    if (!Object.keys(previousTransaction).length) {
      return (
        <div>
          <h2> Your donation is pending approval! </h2>

          <div className="col-lg-6 p-3" key={award.award_id}>
            <span>
              <Card border="success" style={{width: '26rem'}}>
                <Card.Img variant="top" src={award.award_imageUrl} />
                <Card.Body>
                  <Card.Title>{award.award_title}</Card.Title>
                  <Card.Text>{award.award_description}</Card.Text>
                </Card.Body>
              </Card>
              Here is your hash:
              <a href={`https://ropsten.etherscan.io/tx/${hash}`}> {hash}.</a>
              Click on the link to monitor the status of your transaction on the
              blockchain. The page will automatically refresh upon the donation
              being confirmed on the blockchain! Continue to look at some other
              wonderful people at the time.
            </span>
          </div>
        </div>
      )
    } else
      return (
        <div>
          <span>
            Your donation has been approved!!! Thank you for your donation and
            continue to browse some other extraordinary people on our website.
            <Card border="success" style={{width: '26rem'}}>
              <Card.Img variant="top" src={award.award_imageUrl} />
              <Card.Body>
                <Card.Title>{award.award_title}</Card.Title>
                <Card.Text>{award.award_description}</Card.Text>
              </Card.Body>
            </Card>
          </span>
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
