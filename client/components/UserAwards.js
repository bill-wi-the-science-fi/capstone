import React, {Component} from 'react'
import {Button, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {getAllUserAwards, withdrawAward} from '../store'
import getWeb3 from '../common/getWeb3'
import {Link} from 'react-router-dom'
import Nominate from '../contracts/Nominate.json'

import ReactPaginate from 'react-paginate'

/**
 * COMPONENT
 */

class UserAwards extends Component {
  constructor() {
    super()
    this.state = {
      startAwardIndex: 0,
      awards: [],
      perPage: 4,
      currentPage: 0
    }
    this.pagination = this.pagination.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.withdraw = this.withdraw.bind(this)
  }

  //only contracts that are expired and not withdrawn will have this function
  async withdraw(e) {
    try {
      e.persist()
      //invoking contract method that payouts
      // const contractTxn = await this.state.contract.methods
      //   .expireAward(e.target.value)
      //   .send({
      //     from: this.state.accounts[0],
      //     value: 0
      //   })
      //if transaction is accepted, we will update db award status
      console.log('e.target ----------------------------', e.target)
      await this.props.withdrawAward({id: e.target.value, open: 'closed'})
      //this.props.history.push('/user')

      //if transaction works, change db award status to closed
    } catch (error) {
      console.log(error)
    }
  }

  pagination() {
    const {perPage, startAwardIndex} = this.state
    // awards to display on page
    const awards = this.props.awards.slice(
      startAwardIndex,
      startAwardIndex + perPage
    )
    //add to state how many pages, and the awards for current page
    this.setState((state) => ({
      awards,
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
    try {
      //creates a web3 instance with metamask
      const web3 = await getWeb3()

      //grabs account information (public address)
      const accounts = await web3.eth.getAccounts()
      if (accounts) {
        //grabs network information that smart contract is on
        const networkId = await web3.eth.net.getId()
        //const deployedNetwork = Nominate.networks[networkId];
        const deployedNetwork = Nominate.networks[networkId]
        //create a contract instance
        const contract = new web3.eth.Contract(
          Nominate.abi,
          deployedNetwork && deployedNetwork.address
        )
        this.setState({contract, accounts})
      }
      //grab all awards for a user, active, pending, or closed
      await this.props.getAllUserAwards(this.props.signedInUser.id)
      this.setState({awards: this.props.awards})

      //paginate page
      this.pagination()
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    const {awards} = this.state

    if (this.props.loading) {
      return <h2> Loading awards... </h2>
    }
    console.log('ea', this.props)
    const date = new Date()
    if (
      awards.length > 0 &&
      this.props.match.params.id == this.props.signedInUser.id
    ) {
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
                    {date > new Date(award.timeConstraint).getTime() &&
                    award.open === 'open' ? (
                      <Button
                        type="button"
                        value={award.id}
                        onClick={(e) => this.withdraw(e)}
                      >
                        Withdraw
                      </Button>
                    ) : date > new Date(award.timeConstraint).getTime() ? (
                      <div> Award Accepted </div>
                    ) : (
                      <div>
                        Award Pending
                        <Link
                          to={`/user/${this.props.signedInUser.id}/awards/${award.id}/edit`}
                        >
                          <Button type="button">Edit</Button>
                        </Link>
                      </div>
                    )}

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
    } else if (this.props.match.params.id != this.props.signedInUser.id) {
      return <div>Unauthorized Access</div>
    } else {
      return (
        <div>
          You have not been nominated for your excellent work yet! Here are some
          charities to get started!
        </div>
      )
    }
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    awards: state.awards.userAwards,
    loading: state.awards.loading,
    signedInUser: state.signedInUser
  }
}

const mapDispatch = (dispatch) => {
  return {
    getAllUserAwards: (id) => dispatch(getAllUserAwards(id)),
    withdrawAward: (info) => dispatch(withdrawAward(info))
  }
}

export default connect(mapState, mapDispatch)(UserAwards)
