import React, {Component} from 'react'
import {Button, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {getSingleAward} from '../store'

/**
 * COMPONENT
 */

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
        <div className="row flex-wrap">
          <div className="col-lg-8 p-3">
            <Card border="success" style={{width: '26rem'}}>
              <Card.Img variant="top" src={singleAward.award_imageUrl} />
              <Card.Body>
                <Card.Title>{singleAward.award_title}</Card.Title>
                <Card.Text>{singleAward.award_description}</Card.Text>
                <Button variant="outline-secondary">Donate</Button>
              </Card.Body>
            </Card>
          </div>
        </div>
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
