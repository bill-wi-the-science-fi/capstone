import React from 'react'
import {Carousel, Jumbotron, Button, Card} from 'react-bootstrap'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const HomeLanding = () => {
  return (
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
                  Supporting do-gooders that make the world better for all of
                  us.
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
            <h1>Pay it forward</h1>
            <p>
              Help us bring the best people into a decentralized world where we
              always pay it forward. We believe supporting those who support
              everybody else.
            </p>
            <p>
              <Button href="/awards" variant="success">
                See our Nominees
              </Button>
            </p>
          </Jumbotron>
        </div>
      </div>
      <div className="container mt-4">
        <div className="row flex-wrap">
          <div className="col-lg-4 mb-3">
            <Card border="success" style={{width: '18rem'}}>
              <Card.Img
                variant="top"
                src="https://cdn.stocksnap.io/img-thumbs/960w/businessman-thinking_TGG4JHNHB8.jpg"
              />
              <Card.Body>
                <Card.Title>Open Source Creator</Card.Title>
                <Card.Text>
                  Nimit has contributed to hundreds of open source projects that
                  with over 1,000,000 downloads.
                </Card.Text>
                <Button variant="success">Learn More</Button>
              </Card.Body>
            </Card>
          </div>
          <div className="col-lg-4 mb-3">
            <Card border="success" style={{width: '18rem'}}>
              <Card.Img
                variant="top"
                src="https://cdn.stocksnap.io/img-thumbs/960w/woman-wheelbarrow_NSDVZHHF64.jpg"
              />
              <Card.Body>
                <Card.Title>Sustainable Farm Girl</Card.Title>
                <Card.Text>
                  Kelsey has been active in sustainability for the last 3 years,
                  and is engaged in her community.
                </Card.Text>
                <Button variant="success">Learn More</Button>
              </Card.Body>
            </Card>
          </div>
          <div className="col-lg-4 mb-3">
            <Card border="success" style={{width: '18rem'}}>
              <Card.Img
                variant="top"
                src="https://cdn.stocksnap.io/img-thumbs/960w/business-work_1QH1QRSAF2.jpg"
              />
              <Card.Body>
                <Card.Title>Restoration Guru</Card.Title>
                <Card.Text>
                  Carl has dedicated years of his career to repurpose old trash
                  into amazing decorative pieces.
                </Card.Text>
                <Button variant="success">Learn More</Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.signedInUser.email
  }
}

export default connect(mapState)(HomeLanding)
