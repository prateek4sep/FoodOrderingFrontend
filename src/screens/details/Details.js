import React, { Component } from "react";
import "./Details.css";
import Header from "../../common/header/Header";
import ListCheckoutItems from "../../common/ListCheckoutItems";
import { getRestaurantById } from "../../common/api/Restaurant";
import {
  Typography,
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Card,
  CardContent,
  Badge,
  Button,
  Snackbar
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import CloseIcon from "@material-ui/icons/Close";

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurant: {},
      restaurantId: this.props.match.params.restaurantId,
      categories: "",
      totalItem: 0,
      totalAmount: 0,
      itemsAddedToCartList: [],
      itemAddedToCart: {},
      showItemMessage: false,
      itemMessage: "",
      noRestaurant: false
    };
  }

  componentDidMount() {
    this.fetchRestaurantDetails(this.state.restaurantId);
  }
  //This function loads the variables with all the restaurant details
  fetchRestaurantDetails(restaurantId) {
    getRestaurantById(restaurantId)
      .then(response => {
        if (response === "No Restaurant found exception") {
          this.setState({
            noRestaurant: true
          });
        } else {
          const categories = response.categories
            .map(category => category.category_name)
            .join(", ");
          this.setState({
            restaurant: response,
            categories: categories,
            noRestaurant: false
          });
        }
      })
      .catch(error => {
        this.setState({
          showErrorMessage: true,
          errorMessage: error.message
        });
      });
  }

  //This will add item to the cart list
  addItemDetailsHandler = (item, fromCart) => {
    let totalItem = this.state.totalItem + 1;
    let totalAmount = this.state.totalAmount + item.price;
    let itemsInCartTemp = this.state.itemsAddedToCartList;

    let itemInCartList;
    //Check for already existed item
    if (this.state.itemsAddedToCartList) {
      itemInCartList = this.state.itemsAddedToCartList.filter(itemInCart => {
        if (itemInCart.id === item.id) {
          return true;
        }
        return false;
      })[0];
    }

    if (itemInCartList) {
      itemInCartList.price += item.price;
      itemInCartList.quantity++;
    } else {
      let itemToadd = {
        id: item.id,
        name: item.item_name,
        type: item.item_type,
        price: item.price,
        unitPrice: item.price,
        quantity: 1
      };
      itemsInCartTemp.push(itemToadd);
    }

    let msg = "Item added to cart!";
    if (fromCart) {
      msg = "Item quantity increased by 1!";
    }

    this.setState({
      totalItem: totalItem,
      totalAmount: totalAmount,
      itemsAddedToCartList: itemsInCartTemp,
      showItemMessage: true,
      itemMessage: msg
    });
  };

  // This function will remove item from cart
  removeItemDetailsHandler = item => {
    let totalItem = this.state.totalItem - 1;
    let totalAmount = this.state.totalAmount - item.unitPrice;
    let itemsInCartTemp = this.state.itemsAddedToCartList;

    let idx;
    let itemToRemove = this.state.itemsAddedToCartList.filter(
      (itemInCart, index) => {
        if (itemInCart.id === item.id) {
          idx = index;
          return true;
        }
        return false;
      }
    )[0];

    itemToRemove.price -= item.unitPrice;
    itemToRemove.quantity--;

    let itemMessage = "Item quantity decreased by 1!";

    if (itemToRemove.quantity === 0) {
      itemsInCartTemp.splice(idx, 1);
      itemMessage = "Item removed from cart!";
    }

    this.setState({
      totalItem: totalItem,
      totalAmount: totalAmount,
      showItemMessage: true,
      itemMessage: itemMessage
    });
  };

  /** This method will close Snackbar and set values to state variables */
  itemDetailsSnackBarCloseHandler = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      showItemMessage: false,
      itemMessage: ""
    });
  };

  /** This method will navigate customer to checkout item selected if all required information is available
   * and naviagte the customer to Checkout page
   */
  checkoutDetailsButtonHandler = () => {
    if (this.state.itemsAddedToCartList.length === 0) {
      this.setState({
        showItemMessage: true,
        itemMessage: "Please add an item to your cart!"
      });
      return;
    }

    let accessToken = localStorage.getItem("access-token");
    if (!accessToken) {
      this.setState({
        showItemMessage: true,
        itemMessage: "Please login first!"
      });
      return;
    }

    let checkoutSummary = {};
    checkoutSummary.restaurantId = this.state.restaurantId;
    checkoutSummary.restaurantName = this.state.restaurant.restaurant_name;
    checkoutSummary.itemsAddedForOrder = this.state.itemsAddedToCartList;
    checkoutSummary.totalAmount = this.state.totalAmount;
    sessionStorage.setItem("checkoutSummary", JSON.stringify(checkoutSummary));
    this.props.history.push("/checkout");
  };

  render() {
    return (
      <div>
        {/**Header is added here */}
        <Header history={this.props.history} />
        {/**This will show if item is added or removed from cart */}
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={this.state.showItemMessage}
          message={this.state.itemMessage}
          onClose={this.itemDetailsSnackBarCloseHandler}
          autoHideDuration={5000}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.itemDetailsSnackBarCloseHandler}
            >
              <CloseIcon />
            </IconButton>
          ]}
          className="details-snackbar"
        />

        {Object.keys(this.state.restaurant).length !== 0 ? (
          <div className="details-body-container">
            {/** This will display restaurant information */}
            <div className="details-restaurant-info-section">
              <div>
                <img
                  src={this.state.restaurant.photo_URL}
                  alt="this.state.restaurant.restaurant_name"
                  className="details-restaurant-image"
                />
              </div>
              <div className="details-restaurant-info">
                <div className="details-restaurant-name">
                  <Typography variant="body1">
                    {this.state.restaurant.restaurant_name}
                  </Typography>
                </div>
                <div className="details-restaurant-locality">
                  <Typography variant="body1">
                    {this.state.restaurant.address.locality.toUpperCase()}
                  </Typography>
                </div>
                <div className="details-restaurant-categories">
                  <Typography variant="body1">
                    {this.state.categories}
                  </Typography>
                </div>
                <div className="details-reataurant-rating-cost-info">
                  <div className="details-restaurant-rating-info">
                    <div className="details-restaurant-icon">
                      <i className="fa fa-star" aria-hidden="true" />{" "}
                      {this.state.restaurant.customer_rating}
                    </div>
                    <div>
                      <p className="details-restaurant-text">
                        AVERAGE RATING BY
                      </p>
                      <p className="details-restaurant-text">
                        <span style={{ fontWeight: "bold" }}>
                          {this.state.restaurant.number_customers_rated}
                        </span>{" "}
                        CUSTOMERS
                      </p>
                    </div>
                  </div>
                  <div className="details-restaurant-cost-info">
                    <div className="details-restaurant-icon">
                      <i className="fa fa-rupee-sign" aria-hidden="true" />{" "}
                      {this.state.restaurant.average_price}
                    </div>
                    <div>
                      <p className="details-restaurant-text">
                        AVERAGE COST FOR
                      </p>
                      <p className="details-restaurant-text">TWO PEOPLE</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
          {/**This will be used to show Restaurant menu and cart section */}
            <div className="details-menu-cart-section">
          
              <div className="details-menu">
                {this.state.restaurant.categories ? (
                  <List>
                    {this.state.restaurant.categories.map(category => (
                      <li key={"category_" + category.id}>
                        <ul className="details-menu-list-item">
                          <ListSubheader disableSticky>
                            {category.category_name.toUpperCase()}
                          </ListSubheader>
                          <Divider style={{ marginBottom: 10 }} />
                          {category.item_list.map(item => (
                            <ListItem
                              key={"item_" + item.id}
                              className="details-menu-item-type"
                            >
                              <ListItemIcon>
                                {item.item_type === "VEG" ? (
                                  <i
                                    className="fa fa-circle"
                                    aria-hidden="true"
                                    style={{ color: "#138313" }}
                                  />
                                ) : (
                                  <i
                                    className="fa fa-circle"
                                    aria-hidden="true"
                                    style={{ color: "#c30909" }}
                                  />
                                )}
                              </ListItemIcon>
                              <ListItemText
                                primary={item.item_name.replace(/\b\w/g, l =>
                                  l.toUpperCase()
                                )}
                              />
                              <ListItemIcon>
                                <i
                                  className="fa fa-rupee-sign"
                                  aria-hidden="true"
                                  style={{ color: "black" }}
                                />
                              </ListItemIcon>
                              <ListItemText primary={item.price.toFixed(2)} />
                              <IconButton
                                onClick={() => this.addItemDetailsHandler(item, false)}
                              >
                                <AddIcon />
                              </IconButton>
                            </ListItem>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </List>
                ) : (
                  ""
                )}
              </div>
             
              <div className="details-cart">
                <Card className="details-card">
                  <CardContent>
                    <div className="details-card-header">
                      <Badge
                        badgeContent={this.state.totalItem}
                        showZero
                        color="primary"
                      >
                        <ShoppingCartIcon />
                      </Badge>
                      <span className="details-card-title">My Cart</span>
                    </div>
                    <div className="details-cart-item">
                      {this.state.itemsAddedToCartList.length > 0 ? (
                        <ListCheckoutItems
                          itemsAdded={this.state.itemsAddedToCartList}
                          page="details"
                          removeItemDetailsHandler={this.removeItemDetailsHandler}
                          addItemDetailsHandler={this.addItemDetailsHandler}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="details-cart-total">
                      <Typography variant="body1">TOTAL AMOUNT</Typography>
                      <span>
                        <i className="fa fa-rupee-sign" aria-hidden="true" />{" "}
                        {this.state.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <Button
                      variant="contained"
                      color="primary"
                      className="details-cart-button"
                      onClick={this.checkoutDetailsButtonHandler}
                    >
                      CHECKOUT
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>            
          </div>
        ) : (
          ""
        )}
        {this.state.noRestaurant ? (
          <Typography variant="body1" component="p" style={{margin: "15px 30px"}}>
            No Restaurant found
          </Typography>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Details;
