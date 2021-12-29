import React, { Component } from "react";
import { Button, Alert, Card, Modal, Breadcrumb } from "react-bootstrap";
import { reduxForm, Field } from "redux-form";
import { compose } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import * as actions from "../actions";
import CustomInput from "./CustomInput";
import { DISCOUNT_CHECK } from "../actions/urlConstant";

class BookFlight extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);

    this.state = {
      showForm: false,
      show: false,
      userDetails: {},
      passangers: [],
      number: 0,
      seatTypes: 0,
      reqDetails: {},
      couponValue: 0,
      total: this.props.flight.cost + this.props.flight.tax,
      discount: 0,
    };
    // console.log(this.props.user.userDetails);
  }

  onClick() {
    this.setState({ showForm: true });
  }

  async bookFlight(userDetails) {
    console.log(userDetails._id);
    await this.setState({ userDetails });
    this.props.storeUserDetails(userDetails);
    this.handleShow();
  }

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  async onSubmit(formData) {
    const res = await this.props.validateUserDetails(formData);
    this.state.reqDetails = formData;
    this.handleShow();
  }
  handleShow = () => this.setState({ show: true });
  handleClose = () => this.setState({ show: false });

  bookTicket = () => {
    console.log(this.state.reqDetails);

    this.props.addUserDetails(
      this.state.reqDetails,
      this.props.flight,
      this.state
    );

    this.state.showForm = false;
    this.props.history.push("/bookinghistory");
  };
  changeBusinessType = () => {
    if (this.state.seatTypes === 0) {
      this.state.seatTypes = 1;
    } else if (this.state.seatTypes === 1) {
      this.state.seatTypes = 0;
    }
  };

  async checkDiscount() {
    const data = {
      discountCode: this.state.couponValue,
    };
    console.log(data);
    axios.post(DISCOUNT_CHECK, data).then((res) => {
      this.setState({ discount: res.data.discountPercentage });
      this.setState({
        total:
          this.state.total -
          (this.state.total / 100) * res.data.discountPercentage,
      });
    });
  }

  redirect() {
    this.props.history.push("/bookinghistory");
  }
  render() {
    const { handleSubmit } = this.props;

    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">Search Flight</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Traveller Details</Breadcrumb.Item>
        </Breadcrumb>
        {this.state.userDetails.hasOwnProperty("id") ? (
          <Modal
            show={this.state.show}
            onHide={this.handleClose}
            backdrop="static"
            keyboard={false}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Review Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Card style={{ marginBottom: "2rem" }}>
                <Card.Header>Flight Details</Card.Header>
                <Card.Body>
                  <Card.Title>
                    {this.props.flight.airlineName} {this.props.flight.flightNo}
                  </Card.Title>
                  <Card.Text>
                    From : {this.props.flight.fromFlight} To :{" "}
                    {this.props.flight.toFlight}
                    <br />
                    Fare : &#8377;{this.props.flight.cost} <br />
                    Date : {this.props.flight.date.substring(0, 10)}
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card style={{ marginBottom: "2rem" }}>
                <Card.Header>Traveller Details</Card.Header>
                <Card.Body>
                  <Card.Title>
                    {this.state.userDetails.firstName}{" "}
                    {this.state.userDetails.lastName}{" "}
                  </Card.Title>
                  <Card.Text>
                    Birthdate:{" "}
                    {this.state.userDetails.birthdate.substring(0, 10)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Cancel
              </Button>

              <Button variant="primary" onClick={this.confirmFlight}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        ) : null}
        <h1>Book Flight</h1>
        {this.props.flight.flightNo ? (
          <>
            <Card style={{ marginBottom: "2rem" }}>
              <Card.Header>
                {this.props.flight.flightNo} {"          "} Take Off Time :{" "}
                {moment(this.props.flight.takeOffTime).format("h:mm A")}{" "}
                {"          "} Landing Time :{" "}
                {moment(this.props.flight.landingTime).format("h:mm A")}
              </Card.Header>
              <Card.Body>
                <Card.Title>{this.props.flight.airlineName}</Card.Title>
                <Card.Text>
                  <table style={{ width: "100%", tableLayout: "fixed" }}>
                    <tbody>
                      <tr>
                        <td style={{ fontSize: "1.8rem" }}>
                          {this.props.flight.fromFlight}
                        </td>
                        <td>
                          <span class="plane">
                            <svg
                              clip-rule="evenodd"
                              fill-rule="evenodd"
                              height="50"
                              width="50"
                              image-rendering="optimizeQuality"
                              shape-rendering="geometricPrecision"
                              text-rendering="geometricPrecision"
                              viewBox="0 0 500 500"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g stroke="#222">
                                <line
                                  fill="none"
                                  stroke-linecap="round"
                                  stroke-width="30"
                                  x1="300"
                                  x2="55"
                                  y1="390"
                                  y2="390"
                                />
                                <path
                                  d="M98 325c-9 10 10 16 25 6l311-156c24-17 35-25 42-50 2-15-46-11-78-7-15 1-34 10-42 16l-56 35 1-1-169-31c-14-3-24-5-37-1-10 5-18 10-27 18l122 72c4 3 5 7 1 9l-44 27-75-15c-10-2-18-4-28 0-8 4-14 9-20 15l74 63z"
                                  fill="#222"
                                  stroke-linejoin="round"
                                  stroke-width="10"
                                />
                              </g>
                            </svg>
                          </span>
                        </td>
                        <td style={{ fontSize: "1.8rem" }}>
                          {this.props.flight.toFlight}
                        </td>
                        <td style={{ fontSize: "1.8rem" }}>
                          {/* <span style={{ float: "right" }}> */}
                          &#8377;{this.props.flight.cost}
                          {/* </span> */}
                        </td>
                        <td style={{ fontSize: "1.8rem" }}>
                          {this.props.flight.date}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Text>
              </Card.Body>
            </Card>
            <h4>Book flight for</h4>
            <Card>
              <Card.Body>
                <form onSubmit={handleSubmit(this.onSubmit)}>
                  <fieldset>
                    <Field
                      name="firstName"
                      type="text"
                      id="firstName"
                      label="First Name"
                      placeholder="First Name"
                      required
                      component={CustomInput}
                    ></Field>
                    <Field
                      name="lastName"
                      type="text"
                      id="lastName"
                      label="Last Name"
                      placeholder="Last Name"
                      required
                      component={CustomInput}
                    ></Field>
                    <Field
                      name="birthdate"
                      type="date"
                      id="birthdate"
                      label="Birthdate"
                      placeholder="Birthdate"
                      required
                      component={CustomInput}
                    ></Field>
                    <Field
                      name="govtProof"
                      type="text"
                      id="govtProof"
                      label="Govt. Proof"
                      placeholder="Govt. Proof"
                      required
                      component={CustomInput}
                    ></Field>
                    <Field
                      name="govtProofId"
                      type="text"
                      id="govtProofId"
                      label="Govt. Proof Id"
                      placeholder="Govt. Proof Id"
                      required
                      component={CustomInput}
                    ></Field>
                  </fieldset>
                  {this.props.errorMessage ? (
                    <Alert variant="danger">{this.props.errorMessage} </Alert>
                  ) : null}
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </form>
              </Card.Body>
            </Card>
          </>
        ) : (
          <Card>
            <Card.Body>
              <Card.Text>You have not selected any flight to book</Card.Text>
              <Button variant="primary">
                <Link
                  to="/"
                  style={{ color: "inherit", textDecoration: "inherit" }}
                >
                  Search flight
                </Link>
              </Button>
            </Card.Body>
          </Card>
        )}

        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Final Submit</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Please Select Seat Type
            <select
              id="seatType"
              onChange={this.changeBusinessType}
              value={this.state.value}
            >
              <option value="0">Business</option>
              <option value="1">Non - Business</option>
            </select>
            <div>
              <table>
                <tr>
                  <th>Seat Cost </th>
                  <th> {this.props.flight.cost}</th>
                </tr>
                <tr>
                  <th>Tax</th>
                  <th> {this.props.flight.tax}</th>
                </tr>
                <tr>
                  <th>Discount Cupon</th>
                  <th>
                    <input
                      type="text"
                      id="input"
                      value={this.state.couponValue}
                      onChange={(e) =>
                        this.setState({ couponValue: e.target.value })
                      }
                    />
                    <button type="submit" onClick={() => this.checkDiscount()}>
                      Apply
                    </button>
                  </th>
                </tr>
                <tr>
                  <th>Discount %</th>
                  <th> {this.state.discount}</th>
                </tr>
                <tr>
                  <th>Total</th>
                  <th> {this.state.total}</th>
                </tr>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.bookTicket}>
              Book
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    flight: state.flight.flight,
    user: state.auth.user,
  };
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: "addPassenger" })
)(BookFlight);
