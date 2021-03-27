import React, {Component} from 'react'
import {Button, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {getAllAwards} from '../store'
import {Link} from 'react-router-dom'
import ReactPaginate from 'react-paginate'

/**
 * COMPONENT
 */

class AllAwards extends Component {
  constructor() {
    super()
    this.state = {
      offset: 0,
      awards: [],
      perPage: 4,
      currentPage: 0
    }
    this.pagination = this.pagination.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
  }

  pagination() {
    //data for awards to display on page
    const awards = this.props.awards.slice(
      this.state.offset,
      this.state.offset + this.state.perPage
    )

    this.setState((state) => ({
      awards,
      pageCount: Math.ceil(this.props.awards.length / state.perPage)
    }))
  }
  handlePageClick = (e) => {
    const selectedPage = e.selected
    const offset = selectedPage * this.state.perPage

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset
      },
      () => {
        this.pagination()
      }
    )
  }

  async componentDidMount() {
    await this.props.getAllAwards()
    this.pagination()
  }

  render() {
    const {awards} = this.state

    if (!awards.length) {
      return <h2> Loading awards... </h2>
    }

    return (
      <div className="container">
        <div className="row flex-wrap">
          {awards.map((award) => (
            <div className="col-lg-6 p-3" key={award.id}>
              <Card border="success" style={{width: '26rem'}}>
                <Card.Img variant="top" src={award.imageUrl} />
                <Card.Body>
                  <Card.Title>{award.title}</Card.Title>
                  <Card.Text>{award.description}</Card.Text>
                  {/* <Button variant="outline-secondary">Donate</Button> */}
                  <Button
                    as={Link}
                    to={`awards/${award.id}`}
                    variant="success ml-2"
                  >
                    More Info
                  </Button>
                  {/* <DonateForm awardId={`${award.id}`} /> */}
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
    awards: state.awards
  }
}

const mapDispatch = (dispatch) => {
  return {
    getAllAwards: () => dispatch(getAllAwards())
  }
}

export default connect(mapState, mapDispatch)(AllAwards)
