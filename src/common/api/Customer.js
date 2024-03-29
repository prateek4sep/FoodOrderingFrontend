import {
  LOGIN_CUSTOMER_URL,
  SIGNUP_CUSTOMER_URL
} from "../common";
//Login function to validate credentials
export function loginCustomer(encodedCredential) {
  return new Promise(function (resolve, reject) {
    fetch(LOGIN_CUSTOMER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${encodedCredential}`,
        "Content-Type": "application/json;charset=UTF-8"
      }
    })
      .then(resp => {
        return resolve(resp);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//SignUp function to add new customer in Database
export function signUpCustomer(reqBody) {
  return new Promise(function (resolve, reject) {
    fetch(SIGNUP_CUSTOMER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reqBody)

    })
      .then(resp => {
        resp.json().then(res => {
          return resolve(res);
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}