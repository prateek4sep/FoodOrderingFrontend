import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from './screens/home/Home';
import Checkout from "./screens/checkout/Checkout";

function FoodOrderingAppController() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
          <Route exact path='/checkout' render={(props) => <Checkout {...props}/>}/>
      </Switch>
    </Router>
  );
}

export default FoodOrderingAppController;