import React, {Component} from 'react';
import {Row, Image, ProgressBar, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {getSingleAward, clearTransaction} from '../store';
import Web3 from 'web3';
import {ShareButton} from './ShareButton';
import {DonateForm} from './index';
import ReactLoading from 'react-loading';
import {Link} from 'react-router-dom';

/**
 * COMPONENT
 */

const web3 = new Web3();

class SingleAward extends Component {
  constructor() {
    super();
    this.state = {dataAvailable: true};
  }
  componentDidMount() {
    this.props.getSingleAward(this.props.match.params.id);
    this.props.clearTransaction();
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
    const {singleAward} = this.props;

    if (!singleAward.award_id) {
      return this.state.dataAvailable ? (
        <div className="loading-container">
          <div>
            <strong>fetching award...</strong>
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
          <strong>sorry, we are not able to retrieve this award</strong>
        </div>
      );
    }

    const amountDonatedETH = web3.utils.fromWei(
      singleAward.award_donationTotal,
      'ether'
    );
    const donationLimitETH = web3.utils.fromWei(
      singleAward.award_donationLimit,
      'ether'
    );

    const percentDonated = Math.ceil(
      (amountDonatedETH / donationLimitETH) * 100
    );

    return (
      <div className="container-fluid">
        <div className="container-fluid mt-5 mr-4 ml-4 mb-0">
          <ProgressBar className="pr-4" now={percentDonated} />
          <p className="mb-0">
            Amount donated: {amountDonatedETH}
            {' ETH with a limit of '}
            {donationLimitETH}
            {' ETH'}
          </p>
        </div>

        <Row className="ml-5 mr-5 mt-1 flex-wrap-reverse">
          <div className="col-md-4 pt-2 pr-5 pl-5 pb-2">
            <Row className="mt-3">
              <Image
                className="single-award-recipient-img"
                src={singleAward.recipient_imageUrl}
                rounded
              />
            </Row>
            <Row className="mb-5">
              <h3>Award Recipient: </h3>
              <h3>
                {singleAward.recipient_firstName}{' '}
                {singleAward.recipient_lastName}
              </h3>
            </Row>

            <Row className="mb-5">
              <p className="m-0">Nominated by: </p>
              <p className="m-0">
                {singleAward.giver_firstName} {singleAward.giver_lastName}
              </p>
            </Row>
            <Row>
              <ShareButton
                url={`https://pay-eth-forward.herokuapp.com/awards/${singleAward.award_id}`}
              />
            </Row>
          </div>
          <div className="col-md-8 pt-2 pr-5 pl-5 pb-2">
            <Row className="mt-5">
              <h2>{singleAward.award_title}</h2>
            </Row>
            <Row className="mt-3">
              <p>{singleAward.award_description}</p>
            </Row>
            <Row>
              <Image
                className="single-award-img mt-3"
                src={singleAward.award_imageUrl}
                rounded
              />
            </Row>
            <Row>
              <DonateForm
                awardId={`${singleAward.award_id}`}
                history={this.props.history}
                awardInfo={singleAward}
              />
            </Row>
          </div>
        </Row>
      </div>
    );
  }
}

/**
 * CONTAINER
 */

const mapState = (state) => {
  return {
    singleAward: state.singleAward
  };
};

const mapDispatch = (dispatch) => {
  return {
    getSingleAward: (id) => dispatch(getSingleAward(id)),
    clearTransaction: () => dispatch(clearTransaction())
  };
};

export default connect(mapState, mapDispatch)(SingleAward);
