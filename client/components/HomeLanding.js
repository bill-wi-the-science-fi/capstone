import React, {Component} from 'react'
import {Carousel, Jumbotron, Button, Card} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {getAllAwards} from '../store'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
class HomeLanding extends Component {
  componentDidMount() {
    this.props.getAllAwards()
  }

  render() {
    const card1 = this.props.awards[0]
    const card2 = this.props.awards[1]
    const card3 = this.props.awards[2]

    return (
      <div>
        <div className="container-fluid pr-0 pl-0">
          <div className="row no-gutters flex-wrap-reverse">
            <div className="col-md-5">
              <Carousel fade>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="https://cdn.stocksnap.io/img-thumbs/960w/alone-background_TJSWWAXG9T.jpg"
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h3>For the Common Good</h3>
                    <p>
                      Supporting do-gooders that make the world better for all
                      of us.
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="https://cdn.stocksnap.io/img-thumbs/960w/hipster-man_Y7VURRDV8Q.jpg"
                    alt="Second slide"
                  />

                  <Carousel.Caption>
                    <h3>Transparent</h3>
                    <p>Bringing the world of donations onto the blockchain.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="https://cdn.stocksnap.io/img-thumbs/960w/lgbtq-person_PA4GTSVKVB.jpg"
                    alt="Third slide"
                  />

                  <Carousel.Caption>
                    <h3>Spreading the word...</h3>
                    <p>...about good deeds and blockchain technology.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
            <div className="col-md-7">
              <Jumbotron className="mb-0">
                <h1>Pay it forward... in ETH..</h1>
                <p>
                  Help us bring the best people into a decentralized world where
                  we always pay it forward. We believe supporting those who
                  support everybody else.
                </p>
                <p>
                  <Button as={Link} to="/awards" variant="success">
                    See our Nominees
                  </Button>
                </p>
              </Jumbotron>
            </div>
          </div>
        </div>
        {!this.props.awards[0] ? (
          <div>Getting the best award nominees...</div>
        ) : (
          <div className="container mt-4">
            <div className="row flex-wrap">
              <div className="col-lg-4 mb-3">
                <Card border="success" style={{width: '18rem'}}>
                  <Card.Img variant="top" src={card1.imageUrl} />
                  <Card.Body>
                    <Card.Title>{card1.title}</Card.Title>
                    <Card.Text>{card1.description}</Card.Text>
                    <Button
                      as={Link}
                      to={`/awards/${card1.id}`}
                      variant="success"
                    >
                      Learn More
                    </Button>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-lg-4 mb-3">
                <Card border="success" style={{width: '18rem'}}>
                  <Card.Img variant="top" src={card2.imageUrl} />
                  <Card.Body>
                    <Card.Title>{card2.title}</Card.Title>
                    <Card.Text>{card2.description}</Card.Text>
                    <Button
                      as={Link}
                      to={`/awards/${card2.id}`}
                      variant="success"
                    >
                      Learn More
                    </Button>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-lg-4 mb-3">
                <Card border="success" style={{width: '18rem'}}>
                  <Card.Img variant="top" src={card3.imageUrl} />
                  <Card.Body>
                    <Card.Title>{card3.title}</Card.Title>
                    <Card.Text>{card3.description}</Card.Text>
                    <Button
                      as={Link}
                      to={`/awards/${card3.id}`}
                      variant="success"
                    >
                      Learn More
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.signedInUser.email,
    awards: state.awards
  }
}

const mapDispatch = (dispatch) => {
  return {
    getAllAwards: () => dispatch(getAllAwards())
  }
}

export default connect(mapState, mapDispatch)(HomeLanding)
