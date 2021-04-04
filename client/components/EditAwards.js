import React, {Component} from 'react';
import {Button, Col, Form} from 'react-bootstrap';
import {connect} from 'react-redux';
import {getSingleAward, editSingleAward, clearSingleAward} from '../store';
import ReactLoading from 'react-loading';
import {storage} from '../firebase/index';

import {Formik} from 'formik';
import * as yup from 'yup';

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
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
  title: yup.string().required(),
  description: yup.string().required(),
  file: yup.mixed()
});

class EditAwards extends Component {
  constructor() {
    super();
    this.state = {dataAvailable: true, file: {}};
    this.onSubmit = this.onSubmit.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.editSingleAwardMethod = this.editSingleAwardMethod.bind(this);
  }
  async componentDidMount() {
    await this.props.getSingleAward(this.props.match.params.id);
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
  async editSingleAwardMethod(formValues) {
    try {
      await this.props.editSingleAward(this.props.match.params.id, formValues);
      this.props.clearSingleAward();
    } catch (error) {
      console.log(error);
    }
  }

  handleImage(e) {
    e.persist();
    if (e.target.files[0]) {
      this.setState({file: e.target.files[0]});
    }
  }

  componentWillUnmount() {
    this.props.clearSingleAward();
  }
  async onSubmit(formValues) {
    const {file} = this.state;
    if (file.name) {
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
            .then((url) => {
              formValues.imageUrl = url;
              this.editSingleAwardMethod(formValues);
            })
      );
    } else {
      this.editSingleAwardMethod(formValues);
    }
  }

  // eslint-disable-next-line complexity
  render() {
    console.log('render', this.props);
    if (
      (Object.keys(this.props.singleAward).length === 0 &&
        Object.keys(this.props.signedInUser).length === 0 &&
        this.state.dataAvailable) ||
      (Object.keys(this.props.singleAward).length === 0 &&
        Object.keys(this.props.signedInUser).length &&
        this.state.dataAvailable)
    ) {
      return (
        <div className="loading-container">
          <div>
            <strong>fetching award to edit...</strong>
          </div>
          <ReactLoading
            type="cubes"
            color="rgb(36, 225, 96)"
            height={100}
            width={150}
          />
        </div>
      );
    } else if (
      Object.keys(this.props.singleAward).length === 0 &&
      Object.keys(this.props.signedInUser).length === 0
    ) {
      return (
        <div className="loading-container">
          <strong>this award can not be editted</strong>
        </div>
      );
    } else if (
      this.props.match.params.userId != this.props.signedInUser.id ||
      (this.props.singleAward.recipient_id != this.props.signedInUser.id &&
        this.props.singleAward.giver_id != this.props.signedInUser.id &&
        !this.state.dataAvailable)
    ) {
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
    } else if (
      this.props.singleAward &&
      this.props.singleAward.recipient_firstName
    ) {
      const {
        recipient_firstName,
        recipient_lastName,
        award_title,
        award_category,
        award_description,
        award_imageUrl
      } = this.props.singleAward;
      return (
        <div className="container">
          <Formik
            enableReinitialize
            validationSchema={schema}
            onSubmit={this.onSubmit}
            initialValues={{
              firstName: recipient_firstName,
              lastName: recipient_lastName,
              category: award_category,
              title: award_title,
              description: award_description,
              imageUrl: award_imageUrl
            }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              isValid,
              errors
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Row>
                  <Form.Group
                    as={Col}
                    md="6 ml-0 mr-0 pl-1 pr-1"
                    controlId="validationFormik101"
                  >
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={this.props.singleAward.recipient_firstName}
                      name="firstName"
                      value={values.firstName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      isValid={touched.firstName && !errors.firstName}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="6 ml-0 mr-0 pl-1 pr-1"
                    controlId="validationFormik102"
                  >
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
                  <Form.Group
                    as={Col}
                    md="6 ml-0 mr-0 pl-1 pr-1"
                    controlId="validationFormik104"
                  >
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
                  <Form.Group
                    as={Col}
                    md="6 ml-0 mr-0 pl-1 pr-1"
                    controlId="validationFormik103"
                  >
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
                </Form.Row>
                <Form.Row>
                  <Form.Group
                    as={Col}
                    md="6 ml-0 mr-0 pl-1 pr-1"
                    controlId="SelectCategory"
                  >
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      as="select"
                      value={values.category}
                      name="category"
                      placeholder="Category"
                      onChange={handleChange}
                      isValid={!!touched.values}
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
                  <Form.File
                    className="col-md-6 ml-0 mr-0 pl-1 pr-1 position-relative"
                    name="file"
                    label="File"
                    onChange={(e) => this.handleImage(e)}
                    isInvalid={!!errors.file}
                    feedback={errors.file}
                    id="validationFormik107"
                    feedbackTooltip
                  />
                </Form.Row>

                <Button variant="success" className="m-0" type="submit">
                  Submit form
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      );
    }
  }
}

const mapState = (state) => {
  return {
    signedInUser: state.signedInUser,
    singleAward: state.singleAward
  };
};

const mapDispatch = (dispatch) => {
  return {
    getSingleAward: (id) => dispatch(getSingleAward(id)),
    editSingleAward: (id, award) => dispatch(editSingleAward(id, award)),
    clearSingleAward: () => dispatch(clearSingleAward())
  };
};

export default connect(mapState, mapDispatch)(EditAwards);
