import React, { Component } from "react";
import "./Home.css";
import Header from "../../common/header/Header";
import {
  getRestaurant,
  getRestaurantByName
} from "../../common/api/Restaurant";
import {
  Snackbar,
  Card,
  Grid,
  Typography,
  CardContent
} from "@material-ui/core";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantList: [],
      showMessage: false,
      message: "",
      searchVal: "",
      isFetchRestaurant: false
    };
  }

  componentDidMount() {
    this.loadAllRestaurants();
  }

  loadAllRestaurants() {
    getRestaurant()
      .then(response => {
        this.setState({
          restaurantList:
            response.restaurants && response.restaurants.length
              ? response.restaurants
              : [],
          searchVal: "",
          isFetchRestaurant: true
        });
      })
      .catch(error => {
        this.setState({
          showMessage: true,
          message: "Error in Fetching restaurants",
          searchVal: ""
        });
      });
  }

  searchRestaurantByName = restaurantName => {
    if (restaurantName) {
      getRestaurantByName(restaurantName)
        .then(response => {
          this.setState({
            restaurantList:
              response.restaurants && response.restaurants.length
                ? response.restaurants
                : [],
            searchVal: restaurantName,
            isFetchRestaurant: true
          });
        })
        .catch(error => {
          this.setState({
            showMessage: true,
            message: "Error in Fetching restaurants",
            searchVal: restaurantName
          });
        });
    } else {
      this.loadAllRestaurants();
    }
  };

  closeSnackbarHandler = () => {
    this.setState({
      showMessage: false,
      message: ""
    });
  };

  resturantCardClickHandler = restaurantId => {
    this.props.history.push("/restaurant/" + restaurantId);
  };

  render() {
    const {
      restaurantList,
      showMessage,
      message,
      searchVal,
      isFetchRestaurant
    } = this.state;
    return (
      <div>
        <Header
          searchVal={searchVal}
          handleLoginModal={() => this.loginModalHandler()}
          onSearch={restaurant => this.searchRestaurantByName(restaurant)}
          isHomePage={true}
          history={this.props.history}
        />

        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={showMessage}
          autoHideDuration={5000}
          message={message}
          onClose={() => this.closeSnackbarHandler()}
          className="snackbar"
        ></Snackbar>

        <div className="home-page-container">
          <Grid
            container
            spacing={3}
            wrap="wrap"
            alignContent="center"
            className="restaurant-grid"
          >
            {restaurantList.length ? (
              restaurantList.map(restaurant => (
                <Grid key={restaurant.id} item xs={12} sm={6} md={4} lg={3}>
                  <Card className="restaurant-card" key={restaurant.id}>
                    <CardContent
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        this.resturantCardClickHandler(restaurant.id)
                      }
                    >
                      <div className="restaurant-img">
                        <img src={restaurant.photo_URL} alt="restaurant-img" />
                      </div>
                      <div className="restaurant-body">
                        <div className="restaurant-name">
                          {restaurant.restaurant_name}
                        </div>
                        <div className="restaurant-category">
                          {restaurant.categories}
                        </div>
                        <div className="restaurant-info">
                          <div className="restaurant-rating">
                            <i className="fa fa-star" aria-hidden="true" />
                            {restaurant.customer_rating} (
                            {restaurant.number_customers_rated})
                          </div>
                          <div className="restaurant-price">
                            <i
                              className="fa fa-rupee-sign"
                              aria-hidden="true"
                            />
                            {restaurant.average_price} for two
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : isFetchRestaurant ? (
              <Typography variant="body1" component="p">
                No restaurant with the given name.
              </Typography>
            ) : (
              ""
            )}
          </Grid>
        </div>
      </div>
    );
  }
}

export default Home;
