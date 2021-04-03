import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {getAllUserAwards, withdrawAward, getAllUserNoms} from '../store';
import {Link} from 'react-router-dom';
import Web3 from 'web3';

import ReactLoading from 'react-loading';

/**
 * COMPONENT
 */
const web3 = new Web3();

class UserDashboard extends Component {
  constructor() {
    super();
    this.state = {
      startAwardIndex: 0,
      awards: [],
      perPage: 4,
      currentPage: 0,
      dataAvailable: true
    };
    this.handlePageClick = this.handlePageClick.bind(this);
    this.withdraw = this.withdraw.bind(this);
    this.convertDonation = this.convertDonation.bind(this);
  }

  convertDonation(donation) {
    return web3.utils.fromWei(donation, 'ether');
  }

  //only contracts that are expired and not withdrawn will have this function
  async withdraw(e) {
    try {
      e.persist();
      //invoking contract method that payouts
      // const contractTxn = await this.state.contract.methods
      //   .expireAward(e.target.value)
      //   .send({
      //     from: this.state.accounts[0],
      //     value: 0
      //   })
      //if transaction is accepted, we will update db award status
      await this.props.withdrawAward({id: e.target.value, open: 'withdrawn'});
      //this.props.history.push('/user')

      //if transaction works, change db award status to withdrawn
    } catch (error) {
      console.log(error);
    }
  }

  //when user clicks on next, previous, or a page buttton
  handlePageClick = (e) => {
    //page that is selected and the new starting point in the index of data
    const {perPage} = this.state;

    const selectedPage = e.selected;
    const startAwardIndex = selectedPage * perPage;

    //setting new State with new information of awards, current page, and start index
    this.setState({
      currentPage: selectedPage,
      startAwardIndex: startAwardIndex
    });
  };

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
        );
      }

      //grab all awards for a user, active, pending, or withdrawn
      await this.props.getAllUserAwards(this.props.signedInUser.id);
      await this.props.getAllUserNoms(this.props.signedInUser.id);

      this.setState({awards: this.props.awards});
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const {awards} = this.state;
    const {nominations} = this.props;
    const date = new Date();

    if (this.props.loading) {
      return (
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
      );
    }
    if (this.props.match.params.id == this.props.signedInUser.id) {
      return (
        <div className="container">
          <h2 className="ml-5 mt-1">Your awards:</h2>

          <div className="col flex-wrap award">
            {awards.length > 0 ? (
              awards.map((award) => (
                <div
                  className="border border-success rounded row flex-wrap m-4 p-4"
                  key={award.id}
                >
                  <div className="col-lg-2 flex-wrap">
                    <img
                      className="user-dash-img rounded"
                      src={award.imageUrl}
                    />
                  </div>
                  <div className="col-lg-6 flex-wrap">
                    <Link to={`/awards/${award.id}/`} className="black-dark">
                      <h3>{award.title}</h3>
                    </Link>
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
              ))
            ) : (
              <p className="ml-4 mb-5 mt-3 pl-3">
                You have not been nominated for your excellent work yet!
                #patience
              </p>
            )}
          </div>

          <h2 className="ml-5">Awards you've nominated people for: </h2>
          <div className="col flex-wrap award">
            {!nominations.length ? (
              <p className="ml-4 mb-5 mt-3 pl-3">
                You have note yet nominated anyone for an award. Why not start
                now?
              </p>
            ) : (
              nominations.map((nom) => (
                <div
                  className="border border-success rounded row flex-wrap m-4 p-4"
                  key={nom.id}
                >
                  <div className="col-lg-2 flex-wrap">
                    <img className="user-dash-img rounded" src={nom.imageUrl} />
                  </div>
                  <div className="col-lg-6 flex-wrap">
                    {' '}
                    <Link to={`/awards/${nom.id}/`} className="black-dark">
                      <h3>{nom.title}</h3>
                    </Link>
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
                      {date < new Date(nom.timeConstraint).getTime() &&
                      (nom.open === 'pending' || nom.open === 'open') ? (
                        <Button variant="success" type="button">
                          Edit
                        </Button>
                      ) : null}
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    } else if (this.props.match.params.id != this.props.signedInUser.id) {
      return (
        <div className="forbidden-container">
          <div>
            <p className="ml-4 mb-5 mt-3 pl-1 text-center">
              Unauthorized Access
            </p>
            <img className="forbidden-img" src="/403-img.webp"></img>
          </div>
        </div>
      );
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
  };
};

const mapDispatch = (dispatch) => {
  return {
    getAllUserAwards: (id) => dispatch(getAllUserAwards(id)),
    getAllUserNoms: (id) => dispatch(getAllUserNoms(id)),

    withdrawAward: (info) => dispatch(withdrawAward(info))
  };
};

export default connect(mapState, mapDispatch)(UserDashboard);
