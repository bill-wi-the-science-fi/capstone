import React, {Component} from 'react'
import {Carousel, Jumbotron, Button, Card, Image} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {getAllAwards} from '../store'
import {connect} from 'react-redux'
import ReactLoading from 'react-loading'
/**
 * COMPONENT
 */
class HomeLanding extends Component {
  constructor() {
    super()
    this.state = {
      dataAvailable: true
    }
  }
  componentDidMount() {
    console.log('homelandoing')
    this.props.getAllAwards()
    if (this.state.dataAvailable) {
      this.timer = setTimeout(
        () =>
          this.setState((state) => ({
            ...state,
            dataAvailable: !state.dataAvailable
          })),
        5000
      )
    }
  }

  render() {
    const awards = []
    for (let i = 0; i < Math.min(this.props.awards.allAwards.length, 3); i++) {
      awards.push(this.props.awards.allAwards[i])
    }

    return (
      <div>
        <div className="container-fluid pr-0 pl-0">
          <div className="row no-gutters flex-wrap-reverse">
            <div className="col-md-5">
              <Carousel fade>
                <Carousel.Item>
                  <img
                    className="home-carousel d-block w-100"
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
                    className="home-carousel d-block w-100"
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
                    className="home-carousel d-block w-100"
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
        {!this.props.awards.allAwards[0] ? (
          this.state.dataAvailable ? (
            <div className="loading-container">
              <div>fetching today's top awards...</div>
              <ReactLoading
                type="cubes"
                color="rgb(36, 225, 96)"
                height={100}
                width={150}
              />
            </div>
          ) : (
            ''
          )
        ) : (
          <div className="container-fluid mt-4 top-three-container">
            <div className="row flex-wrap top-three">
              {awards.map((awardObject) => (
                <div
                  key={awardObject.id}
                  className="col-md-4 mb-3 award-card-container"
                >
                  <Card
                    className="award-card"
                    border="success"
                    style={{width: 'vw20'}}
                  >
                    <Card.Img
                      className="award-image"
                      variant="top"
                      src={awardObject.imageUrl}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{awardObject.title}</Card.Title>
                      {/* <Card.Text>{awardObject.description}</Card.Text> */}
                      <Button
                        as={Link}
                        to={`/awards/${awardObject.id}`}
                        variant="success"
                        className="mt-auto"
                      >
                        Learn More
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="container-fluid pr-0 pl-0">
          <div className="row no-gutters flex-wrap">
            <div className="col-md-7">
              <Jumbotron className="mb-0">
                <h1>Your first gift of crypto...</h1>
                <p className="mt-3">
                  We understand the world of crypto is realativly new.
                </p>
                <p>
                  Learn why you may have recieved ETH, why that is, and how to
                  get started!
                </p>
                <p>
                  <Button as={Link} to="/intro" variant="success">
                    Learn more
                  </Button>
                </p>
              </Jumbotron>
            </div>
            <div className="col-md-5 p-1">
              <Image
                className="home-image"
                src="https://i.pinimg.com/564x/93/f6/d6/93f6d6cc10039a46c5ada9fede57585d.jpg"
                rounded
              />
            </div>
          </div>
        </div>
        <div className="footer"></div>
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
