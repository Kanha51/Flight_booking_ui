import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { Button, Alert, Card } from "react-bootstrap";
import { connect } from "react-redux";
import { compose } from "redux";

import * as actions from "../actions";
import CustomInput from "./CustomInput";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  redirect() {
    this.props.history.push("/bookings");
  }

  async onSubmit(formData) {
    console.log(formData);
    const res = await this.props.validateSignIn(formData);
    console.log(res);
    if (res) {
      await this.props.userSignIn(formData);
    }
    if (!this.props.errorMessage) {
      this.redirect();
    }
  }

  handleSignUp = () => {
    this.props.history.push("/signup");
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="row">
        <div className="col">
          <Card>
            <Card.Header>Sign in to your account</Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit(this.onSubmit)}>
                <fieldset>
                  <Field
                    name="username"
                    type="email"
                    id="username"
                    label="Username"
                    placeholder="Enter Username"
                    // pattern="/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/"
                    required
                    component={CustomInput}
                  ></Field>
                </fieldset>
                <fieldset>
                  <Field
                    name="password"
                    type="password"
                    id="password"
                    label="Password"
                    placeholder="Password"
                    required
                    component={CustomInput}
                  ></Field>
                </fieldset>
                {this.props.errorMessage ? (
                  <Alert variant="danger">{this.props.errorMessage} </Alert>
                ) : null}
                <Button variant="primary" type="submit">
                  Sign In
                </Button>
              </form>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Text>Don't have an account?</Card.Text>
              <Button variant="link" onClick={this.handleSignUp}>
                Create account
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
    user: state.auth.user,
  };
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: "signin" })
)(SignIn);
