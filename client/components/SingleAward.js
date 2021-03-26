import React, {Component} from 'react'
import {Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {getSingleAward} from '../store'
import {DonateForm} from '../components'
import Web3 from 'web3'

/**
 * COMPONENT
 */

const web3 = new Web3()

class SingleAward extends Component {
  componentDidMount() {
    this.props.getSingleAward(this.props.match.params.id)
  }

  render() {
    const {singleAward} = this.props

    if (!singleAward.award_id) {
      return <h2> Loading award... </h2>
    }

    return (
      <div className="container">
        <Card className="m-3" border="success" style={{width: '60vw'}}>
          <Card.Img variant="top" src={singleAward.award_imageUrl} />
          <Card.Body>
            <Card.Title>{singleAward.award_title}</Card.Title>
            <Card.Text>{singleAward.award_description}</Card.Text>

            <Card.Text>
              Awarded to: {singleAward.recipient_firstName}{' '}
              {singleAward.recipient_lastName}
            </Card.Text>
            <Card.Text>
              Nominated by: {singleAward.giver_firstName}{' '}
              {singleAward.giver_lastName}
            </Card.Text>
            <div className="container mb-4 text-center">
              <DonateForm
                awardId={`${singleAward.award_id}`}
                history={this.props.history}
              />
            </div>
            <Card.Text className="text-right">
              Amount donated:{' '}
              {web3.utils.fromWei(singleAward.award_donationTotal, 'ether')}
              {' ETH with a limit of '}
              {web3.utils.fromWei(singleAward.award_donationLimit, 'ether')}
              {' ETH'}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    )
  }
}

/**
 * CONTAINER
 */

const mapState = (state) => {
  return {
    singleAward: state.singleAward
  }
}

const mapDispatch = (dispatch) => {
  return {
    getSingleAward: (id) => dispatch(getSingleAward(id))
  }
}

export default connect(mapState, mapDispatch)(SingleAward)
