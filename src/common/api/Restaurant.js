import {
  GET_RESTAURANT_URL,
  GET_RESTAURANT_BY_NAME_URL,
  GET_RESTAURANT_BY_ID_URL
} from "../common";

export function getRestaurant() {
  return new Promise(function (resolve, reject) {
    fetch(GET_RESTAURANT_URL)
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

export function getRestaurantByName(restaurantName) {
  return new Promise(function (resolve, reject) {
    fetch(`${GET_RESTAURANT_BY_NAME_URL}${restaurantName}`)
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

export function getRestaurantById(restaurantID) {
  return new Promise(function (resolve, reject) {
    fetch(`${GET_RESTAURANT_BY_ID_URL}${restaurantID}`)
      .then(resp => {
        if (resp.status === 404) {
          return resolve("No Restaurant found exception");
        } else {
          resp.json().then(res => {
            return resolve(res);
          })
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}