import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from './screens/home/Home';
import Checkout from "./screens/checkout/Checkout";
import Details from './screens/details/Details';
import Profile from './screens/profile/Profile';

function FoodOrderingAppController() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
          <Route exact path='/checkout' render={(props) => <Checkout {...props}/>}/>
          <Route exact path='/restaurant/:restaurantId' component={Details} />
          <Route exact path='/profile' component={Profile} />
      </Switch>
    </Router>
  );
}

export default FoodOrderingAppController;