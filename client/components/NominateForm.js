/* eslint-disable complexity */
import React, {Component} from 'react';
import {Button, Col, Form} from 'react-bootstrap';
import {connect} from 'react-redux';
import {Formik} from 'formik';
import * as yup from 'yup';
import {fetchWeb3AndContract} from '../store/contract';
import getWeb3 from '../common/getWeb3';
import Nominate from '../../build/contracts/Nominate.json';
import {
  nominateUser,
  getPriceConversion,
  postTransaction,
  newTransaction,
  clearTransaction
} from '../store';
import {storage} from '../firebase/index';

const regEx = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/;
// put in common
const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email('Invalid email').required('Required'),
  category: yup
    .string()
    .oneOf([
      'Open-Source',
      'Community',
      'Lifetime of Awesome',
      'Health and Wellness',
      'Volunteer',
      'Animals',
      'Heroic Act',
      'Enviornment',
      'Activism'
    ])
    .required(),
  donationTotal: yup.number().required().positive(),
  title: yup.string().required(),
  description: yup.string().required(),
  file: yup.mixed()
});

class NominateForm extends Component {
  constructor() {
    super();

    this.onSubmit = this.onSubmit.bind(this);
    this.startAwardAndDonate = this.startAwardAndDonate.bind(this);
    this.handleImage = this.handleImage.bind(this);
  }

  async componentDidMount() {
    this.props.clearTransaction();
    try {
      // Get network provider and web3 instance. -> web3 attached to state
      const web3 = await getWeb3();
      // check if window object has ethereum object provided -> MM
      // Use web3 to get the user's accounts.
      // promps user to select which accounts the website shoul have access to -> pick first one
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      //const deployedNetwork = Nominate.networks[networkId];
      const deployedNetwork = Nominate.networks[networkId];
      const instance = new web3.eth.Contract(
        Nominate.abi,
        deployedNetwork && deployedNetwork.address
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.

      this.setState((state) => ({
        ...state,
        web3,
        accounts,
        contract: instance
      }));
    } catch (error) {
      // Catch any errors for any of the above operations.
      // *** if browser does not have metamask -> will throw error
      console.log(
        error,
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
    }
  }

  startAwardAndDonate = async (
    awardId,
    recipientAddress,
    amountOfDonation,
    recipientEmail,
    donationLimit,
    imageUrl
  ) => {
    try {
      const {accounts, contract, web3} = this.state;
      const contractTxn = await contract.methods
        .startAwardAndDonate(awardId, recipientAddress, donationLimit)
        .send({
          from: accounts[0],
          gas: '3000000',
          value: amountOfDonation
        })
        .on('transactionHash', async (hash) => {
          await this.props.newTransaction({
            status: 'pending',
            hash: hash,
            award: awardId,
            imageUrl: imageUrl
          });
          // similar behavior as an HTTP redirect
          this.props.history.push('/confirmation');
        });
      if (contractTxn.status) {
        // const txnBody = {
        //   userId: this.props.signedInUser.id,
        //   awardId: awardId,
        //   transactionHash: contractTxn.transactionHash,
        //   amountWei: amountOfDonation,
        //   smartContractAddress: contractTxn.to,
        //   recipientEmail: recipientEmail
        // }
        this.props.postTransaction({
          status: 'confirmed',
          // hash: hash,
          award: this.props.awardInfo
        });
      } else {
        // eslint-disable-next-line no-alert
        alert(
          `Transaction was not able to settle on the blockchain. Please refer to MetaMask for more information on transaction with hash ${contractTxn.transactionHash}`
        );
      }
      // Update state with the result.
      //const balance = await contract.methods.balanceOfContract().call();
      //this.setState({ storageValue: balance });
    } catch (error) {
      console.log(error);
    }
  };

  async onSubmit(formValues) {
    formValues.nominatorId = this.props.signedInUser.id;
    const donationAmountUSD = +formValues.donationTotal;
    const donationLimitUSD = +formValues.donationTotal * 1000;
    const {file} = this.state;
    const uploadTask = storage.ref(`images/${file.name}`).put(file);
    await uploadTask.on(
      'state_changed',
      () => {},
      (error) => {
        console.log(error);
      },
      () =>
        storage
          .ref('images')
          .child(file.name)
          .getDownloadURL()
          .then(async (url) => {
            formValues.imageUrl = url;

            try {
              const donationAmountETH = (
                await this.props.getPriceConversion(donationAmountUSD)
              ).toString();
              const donationLimitETH = (
                await this.props.getPriceConversion(donationLimitUSD)
              ).toString();
              const formData = {
                ...formValues,
                donationTotal: this.state.web3.utils.toWei(
                  donationAmountETH,
                  'ether'
                ),
                donationLimit: this.state.web3.utils.toWei(
                  donationLimitETH,
                  'ether'
                )
              };
              // formValues.donationTotal = this.state.web3.utils.toWei(
              //   donationAmountETH,
              //   'ether'
              // )
              // formValues.donationLimit = this.state.web3.utils.toWei(
              //   donationLimitETH,
              //   'ether'
              // )
              await this.props.nominateUser(formData);
              this.startAwardAndDonate(
                this.props.nominate.awardId,
                this.props.nominate.recipient,
                formData.donationTotal,
                formValues.email,
                formData.donationLimit,
                formData.imageUrl
              );
            } catch (error) {
              console.log(error);
            }
          })
    );
  }
  handleImage(e) {
    e.persist();
    if (e.target.files[0]) {
      this.setState({file: e.target.files[0]});
    }
  }
  render() {
    return (
      <Formik
        validationSchema={schema}
        onSubmit={this.onSubmit}
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          category: '',
          donationTotal: '',
          donationLimit: '',
          title: '',
          file: null,
          description: ''
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          errors
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="validationFormik101">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={values.firstName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isValid={touched.firstName && !errors.firstName}
                />
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormik102">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  onBlur={handleBlur}
                  value={values.lastName}
                  onChange={handleChange}
                  isValid={touched.lastName && !errors.lastName}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="validationFormikUsername2">
                <Form.Label>Email</Form.Label>
                {/* <InputGroup hasValidation> */}
                <Form.Control
                  type="text"
                  placeholder="email"
                  name="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isValid={touched.email && !errors.email}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormik104">
                <Form.Label>Award Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Award Title"
                  name="title"
                  value={values.title}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isValid={touched.title && !errors.title}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="validationFormik105">
                <Form.Label>Donation ($USD)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="0.00"
                  name="donationTotal"
                  value={values.donationTotal}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isValid={
                    touched.donationTotal &&
                    !errors.donationTotal &&
                    regEx.test(values.donationTotal)
                  }
                />
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormik106">
                <Form.Label>Donation Limit ($USD)</Form.Label>
                <Form.Control
                  readonly="readonly"
                  type="text"
                  placeholder="Donation Limit"
                  name="donationLimit"
                  value={Math.ceil(values.donationTotal * 1000)}
                  onBlur={handleBlur}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="validationFormik103">
                <Form.Label>Award Description</Form.Label>
                <Form.Control
                  type="text"
                  as="textarea"
                  rows={3}
                  placeholder="What are they doing that is so amazing"
                  name="description"
                  onBlur={handleBlur}
                  value={values.description}
                  onChange={handleChange}
                  isValid={touched.description && !errors.description}
                />
              </Form.Group>
              <Form.Group controlId="SelectCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={values.category}
                  name="category"
                  placeholder="Category"
                  onChange={handleChange}
                  isValid={!!touched.category}
                >
                  <option value={undefined} defaultValue>
                    Select a Category
                  </option>
                  <option value="Open-Source">Open-Source</option>
                  <option value="Community">Community</option>
                  <option value="Lifetime of Awesome">
                    Lifetime of Awesome
                  </option>
                  <option value="Health and Wellness">
                    Health and Wellness
                  </option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Animals">Animals</option>
                  <option value="Heroic Act">Heroic Act</option>
                  <option value="Enviornment">Enviornment</option>
                  <option value="Activism">Activism</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Row as={Col} md="5 mb-5 ml-0 mr-0 p-0">
              <Form.Group controlId="file">
                <Form.Label>Upload an image of their work:</Form.Label>
                <Form.File
                  name="file"
                  value={values.file}
                  onChange={(e) => this.handleImage(e)}
                  isInvalid={!!errors.file}
                  feedback={errors.file}
                  id="validationFormik107"
                  feedbackTooltip
                />
              </Form.Group>
            </Form.Row>

            <Button
              className="ml-3"
              variant="success"
              disabled={!regEx.test(values.donationTotal)}
              type="submit"
            >
              Submit form
            </Button>
          </Form>
        )}
      </Formik>
    );
  }
}

const mapState = (state) => {
  return {
    signedInUser: state.signedInUser,
    web3: state.contract.web3,
    contractInstance: state.contract.contractInstance,
    accounts: state.contract.accounts,
    ...state
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchWeb3AndContract: () => dispatch(fetchWeb3AndContract()),
    nominateUser: (formData) => dispatch(nominateUser(formData)),
    getPriceConversion: (donationAmountUSD) =>
      dispatch(getPriceConversion(donationAmountUSD)),
    postTransaction: (formData) => dispatch(postTransaction(formData)),
    newTransaction: (formData) => dispatch(newTransaction(formData)),
    clearTransaction: () => dispatch(clearTransaction())
  };
};

export default connect(mapState, mapDispatch)(NominateForm);
