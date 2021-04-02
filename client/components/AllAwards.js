import React, {Component} from 'react'
import {Button, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {getAllAwards} from '../store'
import {Link} from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import ReactLoading from 'react-loading'

/**
 * COMPONENT
 */

class AllAwards extends Component {
  constructor() {
    super()
    this.state = {
      startAwardIndex: 0,
      awardsLocal: [],
      perPage: 4,
      currentPage: 0,
      dataAvailable: true
    }
    this.pagination = this.pagination.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
  }

  pagination() {
    const {perPage, startAwardIndex} = this.state
    //data for awards to display on page
    const awards = this.props.awards.slice(
      startAwardIndex,
      startAwardIndex + perPage
    )
    //add to state how many pages, and the awards for current page
    this.setState((state) => ({
      awardsLocal: awards,
      pageCount: Math.ceil(this.props.awards.length / state.perPage)
    }))
  }
  //when user clicks on next, previous, or a page buttton
  handlePageClick = (e) => {
    //page that is selected and the new starting point in the index of data
    const {perPage} = this.state

    const selectedPage = e.selected
    const startAwardIndex = selectedPage * perPage

    //setting new State with new information of awards, current page, and start index
    this.setState(
      {
        currentPage: selectedPage,
        startAwardIndex: startAwardIndex
      },
      () => {
        this.pagination()
      }
    )
  }

  async componentDidMount() {
    await this.props.getAllAwards()
    this.pagination()
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
  componentDidUpdate(prevProps) {
    // current state is empty
    if (!this.props.awards.length && prevProps.awards.length) {
      this.setState((prevState) => ({
        awardsLocal: this.props.awards,
        currentPage: 0,
        pageCount: Math.ceil(this.props.awards.length / prevState.perPage)
      }))
    } else if (this.props.awards.length && !prevProps.awards.length) {
      // prev state is empty
      this.setState((prevState) => ({
        awardsLocal: this.props.awards,
        currentPage: 0,
        pageCount: Math.ceil(this.props.awards.length / prevState.perPage)
      }))
    } else if (
      this.props.awards.length &&
      prevProps.awards.length &&
      prevProps.awards[prevProps.awards.length - 1].id !==
        this.props.awards[this.props.awards.length - 1].id
    ) {
      // both states are full
      this.setState((prevState) => ({
        awardsLocal: this.props.awards,
        currentPage: 0,
        pageCount: Math.ceil(this.props.awards.length / prevState.perPage)
      }))
    }
  }
  render() {
    const {awardsLocal} = this.state
    console.log('all awards props---------------', this.props)
    console.log('all awards STATE---------------', this.state)
    if (!awardsLocal.length) {
      return this.state.dataAvailable ? (
        <div className="loading-container">
          <div>
            <strong>fetching awards...</strong>
          </div>
          <ReactLoading
            type="cubes"
            color="rgb(36, 225, 96)"
            height={100}
            width={150}
          />
        </div>
      ) : (
        <div className="loading-container">
          <strong>sorry, no active awards available at this time</strong>
          <Link to="/nominate">
            Nominate someone who has performed a kind gesture!
          </Link>
        </div>
      )
    }

    return (
      <div className="container">
        <div className="row flex-wrap">
          {awardsLocal.map((award) => (
            <div className="col-lg-6 p-3 award-card-container" key={award.id}>
              <Card border="success" style={{width: '26rem'}}>
                <Card.Img
                  variant="top"
                  src={award.imageUrl}
                  className="award-image"
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{award.title}</Card.Title>
                  <Card.Text>{award.description}</Card.Text>

                  <Button
                    as={Link}
                    to={`awards/${award.id}`}
                    variant="success ml-2"
                    className="mt-auto"
                  >
                    More Info
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
        <div className="centered">
          <ReactPaginate
            previousLabel="prev"
            nextLabel="next"
            breakLabel="..."
            breakClassName="break-me"
            pageCount={this.state.pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={1}
            onPageChange={this.handlePageClick}
            containerClassName="pagination"
            subContainerClassName="pages pagination"
            activeClassName="active"
          />
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
    awards: state.awards.allAwards
  }
}

const mapDispatch = (dispatch) => {
  return {
    getAllAwards: () => dispatch(getAllAwards())
  }
}

export default connect(mapState, mapDispatch)(AllAwards)
