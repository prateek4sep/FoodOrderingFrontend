import React, { Component } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import {
  Tab,
  Tabs,
  Box,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  Snackbar
} from "@material-ui/core";
import {
  loginCustomer,
  signUpCustomer
} from "../api/Customer";
import "./Login.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "320px"
  }
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

//mobile number pattern
let mobileNumber = /^\d{10}$/;

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSnackbarComponent: false,
      snackBarMessage: "",
      selectedTab: 0,
      errorPasswordSignup: "",
      errorContactNoSignup: "",
      signUpError: false,
      signUpErrorMessage: "",
      loginError: false,
      loginErrorMsg: "",
      loginResponse: { code: "", message: "" },
      signUpFirstName: "",
      signUpLastName: "",
      loginContactNo: "",
      loginPassword: "",
      errorContactNo: "",
      errorPassword: "",
      signUpEmail: "",
      signUpPassword: "",
      signUpContactNo: "",
      errorFirstName: "",
      errorEmail: "",
     
      signUpResponse: { code: "", message: "" }
    };
  }
// This will be used to switch tabs in login modal
  tabsChangeHandler = (event, newValue) => {
    this.setState({
      selectedTab: newValue
    });
  };

  //This will set value to particular state varible based on user input in Login form
  loginFormValueChangeHandler = (value, field) => {
    this.setState({
      [field]: value
    });
  };

  //This will set value to particular state varible based on user input in signup form
  signUpFormValueChangeHandler = (value, field) => {
    this.setState({
      [field]: value
    });
  };

  // This will signup customer if all the required fields are provided and are in correct format
  signUpCustomerHandler = () => {
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpContactNo
    } = this.state;

    if (
      !signUpFirstName ||
      !signUpPassword ||
      !signUpEmail ||
      !signUpContactNo
    ) {
      this.setState({
        signUpError: true,
        signUpErrorMessage: "required",
        errorFirstName: !signUpFirstName,
        errorEmail: !signUpEmail,
        errorPasswordSignup: !signUpPassword,
        errorContactNoSignup: !signUpContactNo
      });
    } else if (!mobileNumber.test(signUpContactNo)) {
      this.setState({
        signUpError: true,
        signUpErrorMessage:
          "Contact No. must contain only numbers and must be 10 digits long",
        errorContactNoSignup:
          "Contact No. must contain only numbers and must be 10 digits long",
        errorFirstName: "",
        errorEmail: "",
        errorPasswordSignup: ""
      });
    } else {
      let reqBody = {
        contact_number: signUpContactNo,
        email_address: signUpEmail,
        first_name: signUpFirstName,
        last_name: signUpLastName,
        password: signUpPassword
      };

      signUpCustomer(reqBody)
        .then(response => {
          if (response && response.code) {
            this.setState({
              signUpError: true,
              signUpResponse: {
                code: response.code,
                message: response.message
              },
              errorFirstName: "",
              errorEmail: "",
              errorPasswordSignup: "",
              errorContactNoSignup: ""
            });
          } else {
            this.setState(
              {
                showSnackbarComponent: true,
                errorFirstName: "",
                errorEmail: "",
                errorPasswordSignup: "",
                errorContactNoSignup: "",
                snackBarMessage: "Registered successfully! Please login now!",
                signUpFirstName: "",
                signUpLastName: "",
                signUpEmail: "",
                signUpPassword: "",
                signUpContactNo: "",
                signUpError: false,
                signUpErrorMessage: "",
                signUpResponse: { code: "", message: "" }
              },
              () => {
                this.tabsChangeHandler("", 0);
              }
            );
          }
        })
        .catch(error => {
          console.log("error after signup", error);
        });
    }
  };

  //This will loginn to customer if all required values are provided.otherwise show some useful message
  loginCustomerHandler = () => {
    const { loginContactNo, loginPassword } = this.state;
    if (!loginPassword || !loginContactNo) {
      this.setState({
        loginError: true,
        loginErrorMsg: "required",
        errorContactNo: !loginContactNo,
        errorPassword: !loginPassword
      });
    } else if (!mobileNumber.test(loginContactNo)) {
      this.setState({
        loginError: true,
        errorContactNo: "Invalid Contact",
        errorPassword: "",
        loginErrorMsg: "Invalid Contact",
        loginResponse: { code: "", message: "" },
      });
    } else {
      let encodedCredential = window.btoa(`${loginContactNo}:${loginPassword}`);
      loginCustomer(encodedCredential)
        .then(async(responseObj) => {
          const response = await responseObj.json();
          if (responseObj.ok) {
            const accessToken = responseObj.headers.get("access-token");
            localStorage.setItem("access-token",accessToken);

            this.setState(
              {
                showSnackbarComponent: true,
                snackBarMessage: "Logged in successfully!"
              },
              () => {
                localStorage.setItem(
                  "user-information",
                  JSON.stringify(response)
                );
                this.resetModalHandler();
              }
            );
          } else {
            this.setState({
              loginError: true,
              loginResponse: { code: response.code, message: response.message },
              errorContactNo: "",
              errorPassword: ""
            });
          }
        })
        .catch(error => {
          console.log("error after login", error);
        });
    }
  };
  //This will reset modal values
  resetModalHandler = () => {
    this.setState(
      {
        selectedTab: 0,
        loginContactNo: "",
        loginPassword: "",
        loginError: false,
        loginErrorMsg: "",
        loginResponse: { code: "", message: "" },
        signUpFirstName: "",
        signUpLastName: "",
        signUpEmail: "",
        signUpPassword: "",
        signUpContactNo: "",
        signUpError: false,
        signUpErrorMessage: "",
        signUpResponse: { code: "", message: "" }
      },
      () => {
        this.props.onClose();
      }
    );
  };

  closeSnackBarHandler = () => {
    this.setState({
      showSnackbarComponent: false,
      snackBarMessage: ""
    });
  };

  render() {
    const { visible } = this.props;
    const {
      selectedTab,
      loginContactNo,
      loginPassword,
      loginError,
      loginErrorMsg,
      loginResponse,
      showSnackbarComponent,
      snackBarMessage,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpContactNo,
      signUpError,
      signUpErrorMessage,
      signUpResponse,
      errorContactNo,
      errorPassword,
      errorFirstName,
      errorEmail,
      errorPasswordSignup,
      errorContactNoSignup
    } = this.state;

    return (
      <div>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={showSnackbarComponent}
          autoHideDuration={5000}
          message={snackBarMessage}
          onClose={() => this.closeSnackBarHandler()} />
        {/**Login or signup modal added here*/}
        <Modal
          isOpen={visible}
          ariaHideApp={false}
          onRequestClose={() => this.resetModalHandler()}
          style={customStyles}
          contentLabel="Modal"
        >
          <div className="modal-container">
            <Tabs
              value={selectedTab}
              onChange={this.tabsChangeHandler}
              indicatorColor="secondary"
              centered
            >
              <Tab label="LOGIN" />
              <Tab label="SIGNUP" />
            </Tabs>
            {/**This is for login tab form*/}
            <TabPanel value={selectedTab} index={0}>
              <FormControl>
                <InputLabel htmlFor="contact" required>
                  Contact No.
                </InputLabel>
                <Input
                  id="contact"
                  aria-describedby="my-helper-text"
                  value={loginContactNo}
                  onChange={e =>
                    this.loginFormValueChangeHandler(e.target.value, "loginContactNo")
                  }
                  fullWidth
                />
                <FormHelperText>
                  <span className="error-msg">
                    {loginError && errorContactNo && loginErrorMsg
                      ? loginErrorMsg
                      : ""}
                  </span>
                </FormHelperText>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="password" required>
                  Password
                </InputLabel>
                <Input
                  type="password"
                  id="password"
                  aria-describedby="my-helper-text"
                  value={loginPassword}
                  onChange={e =>
                    this.loginFormValueChangeHandler(e.target.value, "loginPassword")
                  }
                  fullWidth
                />
                <FormHelperText>
                  <span className="error-msg">
                    {loginError && errorPassword && loginErrorMsg}
                    {loginError && loginResponse.code
                      ? loginResponse.message
                      : ""}
                  </span>
                </FormHelperText>
              </FormControl>
              <div className="footer">
                <Button className="loginButton" onClick={() => this.loginCustomerHandler()} >
                  LOGIN
                </Button>
              </div>
            </TabPanel>
            {/**This is for signup tab */}
            <TabPanel value={selectedTab} index={1}>
              <FormControl>
                <InputLabel htmlFor="signupFirstName" required>
                  First Name
                </InputLabel>
                <Input
                  id="signupFirstName"
                  aria-describedby="my-helper-text"
                  value={signUpFirstName}
                  onChange={e =>
                    this.signUpFormValueChangeHandler(e.target.value, "signUpFirstName")
                  }
                  fullWidth
                />
                <FormHelperText>
                  <span className="error-msg">
                    {signUpError && errorFirstName && signUpErrorMessage}
                  </span>
                </FormHelperText>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="signupLastName">Last Name</InputLabel>
                <Input
                  id="signupLastName"
                  aria-describedby="my-helper-text"
                  value={signUpLastName}
                  onChange={e =>
                    this.signUpFormValueChangeHandler(e.target.value, "signUpLastName")
                  }
                  fullWidth
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="signupEmail" required>
                  Email
                </InputLabel>
                <Input
                  id="signupEmail"
                  aria-describedby="my-helper-text"
                  value={signUpEmail}
                  onChange={e =>
                    this.signUpFormValueChangeHandler(e.target.value, "signUpEmail")
                  }
                  fullWidth
                />
                <FormHelperText>
                  <span className="error-msg">
                    {signUpError && errorEmail && signUpErrorMessage}
                    {signUpError &&
                      signUpResponse &&
                      signUpResponse.code === "SGR-002"
                      ? "Invalid Email"
                      : ""}
                  </span>
                </FormHelperText>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="signupPassword" required>
                  Password
                </InputLabel>
                <Input
                  type="password"
                  id="signupPassword"
                  aria-describedby="my-helper-text"
                  value={signUpPassword}
                  onChange={e =>
                    this.signUpFormValueChangeHandler(e.target.value, "signUpPassword")
                  }
                  fullWidth
                />
                <FormHelperText>
                  <span className="error-msg">
                    {signUpError && errorPasswordSignup && signUpErrorMessage}
                    {signUpError &&
                      signUpResponse &&
                      signUpResponse.code === "SGR-004"
                      ? "Password must contain at least one capital letter, one small letter, one number, and one special character"
                      : ""}
                  </span>
                </FormHelperText>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="signupContact" required>
                  Contact No.
                </InputLabel>
                <Input
                  id="signupContact"
                  aria-describedby="my-helper-text"
                  value={signUpContactNo}
                  onChange={e =>
                    this.signUpFormValueChangeHandler(e.target.value, "signUpContactNo")
                  }
                  fullWidth
                />
                <FormHelperText>
                  <span className="error-msg">
                    {signUpError && errorContactNoSignup && signUpErrorMessage}
                    {signUpError &&
                      signUpResponse &&
                      signUpResponse.code !== "SGR-004" &&
                      signUpResponse.code !== "SGR-002"
                      ? signUpResponse.message
                      : ""}
                  </span>
                </FormHelperText>
              </FormControl>
              <div className="signupFooter">
                <Button className="signupButton" onClick={() => this.signUpCustomerHandler()} >
                  SIGNUP
                </Button>
              </div>
            </TabPanel>
          </div>
        </Modal>
      </div>
    );
  }
}

export default LoginModal;