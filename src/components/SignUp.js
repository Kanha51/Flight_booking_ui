import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { Button, Alert, Card} from "react-bootstrap";
import { connect } from "react-redux";
import { compose } from "redux";
import * as actions from "../actions";
import CustomInput from "./CustomInput";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);   
  }

  redirect() {
     this.props.history.push("/signin");
  }

  handleSignIn = () => {
    this.props.history.push("/signin");
  };

  async onSubmit(formData) {
    console.log(formData);
    const res = await this.props.validateSignUp(formData);
    console.log(res);
    if (res) {
      await this.props.signUp(formData);
    }
    if (!this.props.errorMessage) {
      this.redirect();
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="row">
        <div className="col">
          <Card>
            <Card.Header>Create an account</Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit(this.onSubmit)}>
                <fieldset>
                  <Field
                    name="email"
                    type="email"
                    id="email"
                    label="Email address"
                    placeholder="Enter email"
                    required
                    component={CustomInput}
                  ></Field>
                </fieldset>
                <fieldset>
                  <Field
                    name="fName"
                    type="text"
                    id="fName"
                    label="First Name"
                    placeholder="Enter First Name"
                    required
                    component={CustomInput}
                  ></Field>
                </fieldset>
                <fieldset>
                  <Field
                    name="lName"
                    type="text"
                    id="lName"
                    label="Last Name"
                    placeholder="Enter Last Name"
                    required
                    component={CustomInput}
                  ></Field>
                </fieldset>
                <fieldset>
                  <Field
                    name="password1"
                    type="password"
                    id="password1"
                    label="Password"
                    placeholder="Password"
                    required
                    component={CustomInput}
                  ></Field>
                </fieldset>
                <fieldset>
                  <Field
                    name="password2"
                    type="password"
                    id="password2"
                    label="Confirm Password"
                    placeholder="Password"
                    required
                    component={CustomInput}
                  ></Field>
                </fieldset>
                {this.props.errorMessage ? (
                  <Alert variant="danger">{this.props.errorMessage} </Alert>
                ) : null}
                <Button variant="primary" type="submit">
                  Sign Up
                </Button>
              </form>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Text>Already have an account?</Card.Text>
              <Button variant="link" onClick={this.handleSignIn}>
                Sign in
              </Button>
            </Card.Body>
          </Card>
        </div>
       
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
    flight: state.flight.flight,
  };
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: "signup" })
)(SignUp);
