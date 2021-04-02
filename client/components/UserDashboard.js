import React, {Component} from 'react'
import {Button, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {getAllUserAwards, withdrawAward, getAllUserNoms} from '../store'
import getWeb3 from '../common/getWeb3'
import {Link} from 'react-router-dom'
import Nominate from '../../build/contracts/Nominate.json'
import Web3 from 'web3'

// import ReactPaginate from 'react-paginate'
//import ReactPaginate from 'react-paginate'
import ReactLoading from 'react-loading'

/**
 * COMPONENT
 */
const web3Global = new Web3()

class UserDashboard extends Component {
  constructor() {
    super()
    this.state = {
      startAwardIndex: 0,
      awards: [],
      perPage: 4,
      currentPage: 0,
      dataAvailable: true
    }
    // this.pagination = this.pagination.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.withdraw = this.withdraw.bind(this)
    this.convertDonation = this.convertDonation.bind(this)
  }

  convertDonation(donation) {
    return web3Global.utils.fromWei(donation, 'ether')
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

  // pagination() {
  //   const {perPage, startAwardIndex} = this.state
  //   // awards to display on page
  //   const awards = this.props.awards.slice(
  //     startAwardIndex,
  //     startAwardIndex + perPage
  //   )
  //   //add to state how many pages, and the awards for current page
  //   this.setState((state) => ({
  //     awards,
  //     pageCount: Math.ceil(this.props.awards.length / state.perPage)
  //   }))
  // }

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
      await this.props.getAllUserNoms(this.props.signedInUser.id)

      this.setState({awards: this.props.awards})

      //paginate page
      this.pagination()
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    const {awards} = this.state
    const {nominations} = this.props

    if (this.props.loading) {
      return this.state.dataAvailable ? (
        <div className="loading-container">
          <div>
            <strong>fetching your awards...</strong>
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
          <strong>no awards available at this time</strong>
        </div>
      )
    }
    console.log('ea', this.props)
    const date = new Date()
    if (
      awards.length > 0 &&
      this.props.match.params.id == this.props.signedInUser.id
    ) {
      return (
        <div className="container">
          <h2 className="ml-5 mt-1">Your awards</h2>

          <div className="col flex-wrap award">
            {awards.map((award) => (
              <div
                className="border border-success rounded row flex-wrap m-4 p-4"
                key={award.id}
              >
                <div className="col-lg-2 flex-wrap">
                  <img className="user-dash-img rounded" src={award.imageUrl} />
                </div>
                <div className="col-lg-6 flex-wrap">
                  {' '}
                  <h3>{award.title}</h3>
                  <p>{award.description}</p>
                </div>
                <div className="col-lg-2 flex-wrap">
                  <h3>Donation total</h3>
                  <p>
                    {this.convertDonation(award.donationTotal)}
                    {' ETH'}
                  </p>
                </div>
                <div className="col-lg-2 flex-wrap">
                  {date > new Date(award.timeConstraint).getTime() &&
                  award.open === 'open' ? (
                    <Button
                      variant="success"
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
                        <Button variant="success" type="button">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* <div className="centered">
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
          </div> */}

          <h2 className="ml-5">Awards you've nominated people for: </h2>
          <div className="col flex-wrap award">
            {nominations.map((nom) => (
              <div
                className="border border-success rounded row flex-wrap m-4 p-4"
                key={nom.id}
              >
                <div className="col-lg-2 flex-wrap">
                  <img className="user-dash-img rounded" src={nom.imageUrl} />
                </div>
                <div className="col-lg-6 flex-wrap">
                  {' '}
                  <h3>{nom.title}</h3>
                  <p>{nom.description}</p>
                </div>
                <div className="col-lg-2 flex-wrap">
                  <h3>Donation total</h3>
                  <p>
                    {this.convertDonation(nom.donationTotal)}
                    {' ETH'}
                  </p>
                </div>
                <div className="col-lg-2 flex-wrap">
                  <Link
                    to={`/user/${this.props.signedInUser.id}/awards/${nom.id}/edit`}
                  >
                    <Button variant="success" type="button">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
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
    nominations: state.awards.userNominations,

    loading: state.awards.loading,
    signedInUser: state.signedInUser
  }
}

const mapDispatch = (dispatch) => {
  return {
    getAllUserAwards: (id) => dispatch(getAllUserAwards(id)),
    getAllUserNoms: (id) => dispatch(getAllUserNoms(id)),

    withdrawAward: (info) => dispatch(withdrawAward(info))
  }
}

export default connect(mapState, mapDispatch)(UserDashboard)
