import {
  GET_RESTAURANT_URL,
  GET_RESTAURANT_BY_NAME_URL,
  GET_RESTAURANT_BY_ID_URL
} from "../common";
//Function to fetch all the restaurants available in database
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

//Function to fetch list of restaurants based on restaurant name
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

//function to fetch restaurant details based on restaurasnt UUID
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