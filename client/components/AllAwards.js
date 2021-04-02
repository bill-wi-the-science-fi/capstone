import React, {Component} from 'react';
import {Button, Card, Nav, Dropdown, DropdownButton} from 'react-bootstrap';
import {connect} from 'react-redux';
import {getAllAwards, fetchFilteredAwards} from '../store';
import {Link} from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import ReactLoading from 'react-loading';

/**
 * COMPONENT
 */

class AllAwards extends Component {
  constructor() {
    super();
    this.state = {
      startAwardIndex: 0,
      awardsLocal: [],
      perPage: 4,
      currentPage: 0,
      dataAvailable: true
    };
    this.pagination = this.pagination.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  pagination() {
    const {perPage, startAwardIndex} = this.state;
    //data for awards to display on page
    const awards = this.props.awards.slice(
      startAwardIndex,
      startAwardIndex + perPage
    );
    //add to state how many pages, and the awards for current page
    this.setState((state) => ({
      awardsLocal: awards,
      pageCount: Math.ceil(this.props.awards.length / state.perPage)
    }));
  }
  //when user clicks on next, previous, or a page buttton
  handlePageClick = (e) => {
    console.log(e.selected);
    //page that is selected and the new starting point in the index of data
    const {perPage} = this.state;
    const selectedPage = e.selected;
    const startAwardIndex = selectedPage * perPage;
    //setting new State with new information of awards, current page, and start index
    this.setState(
      {
        currentPage: selectedPage,
        startAwardIndex: startAwardIndex
      },
      () => {
        this.pagination();
      }
    );
  };
  handleFilter = async (category) => {
    await this.props.fetchFilteredAwards(category);
    this.handlePageClick({selected: 0});
    this.setState((prevState) => ({
      ...prevState,
      pageCount: Math.ceil(this.props.awards.length / prevState.perPage),
      awardsLocal: this.props.awards
    }));
  };
  async componentDidMount() {
    await this.props.getAllAwards();
    this.pagination();
    if (this.state.dataAvailable) {
      this.timer = setTimeout(
        () =>
          this.setState((state) => ({
            ...state,
            dataAvailable: !state.dataAvailable
          })),
        5000
      );
    }
  }
  render() {
    const {awardsLocal} = this.state;
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
        <div className="container">
          <div id="award-filter-container">
            <Nav>
              <DropdownButton
                id="dropdown-button-drop-down"
                drop="down"
                variant="info"
                title="Select Award Category"
                onSelect={(evtValue) => {
                  this.handleFilter(evtValue);
                }}
              >
                <Dropdown.Item eventKey="all">All</Dropdown.Item>
                <Dropdown.Item eventKey="Open-Source">
                  Open-Source
                </Dropdown.Item>
                <Dropdown.Item eventKey="Community">Community</Dropdown.Item>
                <Dropdown.Item eventKey="Lifetime of Awesome">
                  Lifetime of Awesome
                </Dropdown.Item>
                <Dropdown.Item eventKey="Health and Wellness">
                  Health and Wellness
                </Dropdown.Item>
                <Dropdown.Item eventKey="Volunteer">Volunteer</Dropdown.Item>
                <Dropdown.Item eventKey="Animals">Animals</Dropdown.Item>
                <Dropdown.Item eventKey="Heroic Act">Heroic Act</Dropdown.Item>
                <Dropdown.Item eventKey="Enviornment">
                  Enviornment
                </Dropdown.Item>
                <Dropdown.Item eventKey="Activism">Activism</Dropdown.Item>
              </DropdownButton>
            </Nav>
          </div>
          <div className="loading-container">
            <strong>sorry, no active awards available at this time</strong>
            <Link to="/nominate">
              Nominate someone who has performed a kind gesture!
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <div id="award-filter-container">
          <Nav>
            <DropdownButton
              id="dropdown-button-drop-down"
              drop="down"
              variant="info"
              title="Select Award Category"
              onSelect={(evtValue) => {
                this.handleFilter(evtValue);
              }}
            >
              <Dropdown.Item eventKey="all">All</Dropdown.Item>
              <Dropdown.Item eventKey="Open-Source">Open-Source</Dropdown.Item>
              <Dropdown.Item eventKey="Community">Community</Dropdown.Item>
              <Dropdown.Item eventKey="Lifetime of Awesome">
                Lifetime of Awesome
              </Dropdown.Item>
              <Dropdown.Item eventKey="Health and Wellness">
                Health and Wellness
              </Dropdown.Item>
              <Dropdown.Item eventKey="Volunteer">Volunteer</Dropdown.Item>
              <Dropdown.Item eventKey="Animals">Animals</Dropdown.Item>
              <Dropdown.Item eventKey="Heroic Act">Heroic Act</Dropdown.Item>
              <Dropdown.Item eventKey="Enviornment">Enviornment</Dropdown.Item>
              <Dropdown.Item eventKey="Activism">Activism</Dropdown.Item>
            </DropdownButton>
          </Nav>
        </div>
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
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    awards: state.awards.allAwards
  };
};

const mapDispatch = (dispatch) => {
  return {
    getAllAwards: () => dispatch(getAllAwards()),
    fetchFilteredAwards: (category) => dispatch(fetchFilteredAwards(category))
  };
};

export default connect(mapState, mapDispatch)(AllAwards);
