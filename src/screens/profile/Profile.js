import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./Profile.css";
import Header from "../../common/header/Header";

class Profile extends Component {
  render() {
    if (!localStorage.getItem("access-token")) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Header history={this.props.history} />
        <div className="profile-container">Profile Page</div>
      </div>
    );
  }
}

export default Profile;
