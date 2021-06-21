import React, {Component, Fragment} from 'react';
import './Checkout.css'
import Header from "../../common/header/Header";

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import {
    ADD_ADDRESS_URL,
    GET_ADDRESS_CUSTOMER_URL,
    GET_PAYMENT_METHODS_URL,
    GET_STATES_URL,
    PLACE_ORDER_URL
} from "../../common/common";
import {Card, CardContent, Divider, FormControlLabel, FormLabel, Radio, RadioGroup, Snackbar} from "@material-ui/core";
import ListCheckoutItems from "../../common/ListCheckoutItems";
import CloseIcon from "@material-ui/icons/Close";
import {Redirect} from "react-router-dom";

class Checkout extends Component {
    constructor() {
        super();
        this.state = {
            activeStep: 0,
            activeTab: 'existingAddress',
            addresses: [],
            states: [],
            payments: [],
            flat: '',
            locality: '',
            city: '',
            stateUUID: '',
            pincode: '',
            paymentId: '',
            flatRequired: false,
            localityRequired: false,
            cityRequired: false,
            stateUUIDRequired: false,
            pincodeRequired: false,
            pincodeValid: true,
            selectedAddressId: undefined,
            displayChange: 'display-none',
            couponId : ''
        }
    }

    // Hook that gets invoked right after a React component has been mounted aka after the first render() lifecycle.
    componentDidMount() {
        if ( localStorage.getItem('access-token') !== null) {
            this.fetchAddress();
            this.fetchStates();
            this.fetchPayments();
        }
    }

    render() {
        if (localStorage.getItem('access-token') === null || sessionStorage.getItem('checkoutSummary') === null) {
            return <Redirect to='/'/>
        }
        return(
            <Fragment>
            <Header history={this.props.history}></Header>

            <div className='main-container'>
                {/* // Delivery and Payment section */}
                <div className='delivery-payment-section'>
                    <Stepper activeStep={this.state.activeStep} orientation='vertical'>
                        {/* // Delivery Step */}
                        <Step key='Delivery'>
                            <StepLabel>Delivery</StepLabel>
                            <StepContent>
                                <div>
                                    <AppBar position={"relative"}>
                                        <Tabs value={this.state.activeTab} variant='standard'>
                                            <Tab value='existingAddress' label='EXISTING ADDRESS' onClick={() => this.changeActiveTabHandler('existingAddress')}/>
                                            <Tab value='newAddress' label='NEW ADDRESS' onClick={() => this.changeActiveTabHandler('newAddress')}/>
                                        </Tabs>
                                    </AppBar>
                                </div>

                                {/* // Existing Address Tab */}
                                <div className={this.state.activeTab === 'existingAddress' ? 'display-block' : 'display-none'}>
                                    {this.state.addresses === undefined || this.state.addresses === null || this.state.addresses.length === 0 ?
                                        <Typography style={{marginTop: 10, marginBottom: 250}} color='textSecondary' component='p'>
                                            There are no saved addresses! You can save an address using the 'New
                                            Address' tab or using your ‘Profile’ menu option.
                                        </Typography> :
                                        <GridList cols={3} cellHeight='auto' style={{flexWrap: 'nowrap'}}>
                                            {
                                                (this.state.addresses || []).map((address, index) => (
                                                    <GridListTile key={address.id}>
                                                        <div className={this.state.selectedAddressId === address.id ?
                                                            'tile-selected-address' : 'tile-not-selected-address'}>
                                                            <div className='address-box'>
                                                                <p>{address.flat_building_name}</p>
                                                                <p>{address.locality}</p>
                                                                <p>{address.city}</p>
                                                                <p>{address.state.state_name}</p>
                                                                <p>{address.pincode}</p>
                                                            </div>
                                                            <Grid container>
                                                                <Grid item lg={10}></Grid>
                                                                <Grid item xs={2}>
                                                                    <IconButton edge='start' onClick={() =>{this.selectAddressHandler(address.id)}}>
                                                                        {this.state.selectedAddressId === address.id ?
                                                                            <CheckCircleIcon className="green-icon"/>
                                                                            :
                                                                            <CheckCircleIcon className="grey-icon"/>}
                                                                    </IconButton>
                                                                </Grid>
                                                            </Grid>
                                                        </div>
                                                    </GridListTile>
                                                ))
                                            }
                                        </GridList>
                                    }
                                </div>

                                {/* // New Address Tab */}
                                <div id='new-address-display' className={this.state.activeTab === 'newAddress' ? 'display-block' : 'display-none'}>
                                    <FormControl style={{maxWidth: 300}}>
                                        <InputLabel htmlFor='flat'>Flat/Building No</InputLabel>
                                        <Input id='flat' name='flat' type='text' value={this.state.flat}
                                               flat={this.state.flat}
                                               onChange={this.onInputFieldChangeHandler}/>
                                        {this.state.flatRequired ? <FormHelperText>
                                            <span style={{color: "red"}}>required</span>
                                        </FormHelperText> : null}
                                    </FormControl>
                                    <br/>
                                    <FormControl style={{maxWidth: 300}}>
                                        <InputLabel htmlFor='locality'>Locality</InputLabel>
                                        <Input id='locality' name='locality' type='text' value={this.state.locality}
                                               locality={this.state.locality}
                                               onChange={this.onInputFieldChangeHandler}/>
                                        {this.state.localityRequired ? <FormHelperText>
                                            <span style={{color: "red"}}>required</span>
                                        </FormHelperText> : null}
                                    </FormControl>
                                    <br/>
                                    <FormControl style={{maxWidth: 300}}>
                                        <InputLabel htmlFor='city'>City</InputLabel>
                                        <Input id='city' name='city' type='text' value={this.state.city}
                                               city={this.state.city}
                                               onChange={this.onInputFieldChangeHandler}/>
                                        {this.state.cityRequired ? <FormHelperText>
                                            <span style={{color: "red"}}>required</span>
                                        </FormHelperText> : null}
                                    </FormControl>
                                    <br/>
                                    <FormControl style={{maxWidth: 300}}>
                                        <InputLabel htmlFor='stateUUID'>State</InputLabel>
                                        <Select id='stateUUID' name='stateUUID' value={this.state.stateUUID}
                                                onChange={this.onInputFieldChangeHandler}>
                                            {this.state.states.map((state, index) => (
                                                <MenuItem key={state.id} value={state.id}>{state.state_name}</MenuItem>
                                            ))}
                                        </Select>
                                        {this.state.stateUUIDRequired ? <FormHelperText>
                                            <span style={{color: "red"}}>required</span>
                                        </FormHelperText> : null}
                                    </FormControl>
                                    <br/>
                                    <FormControl style={{maxWidth: 300}}>
                                        <InputLabel htmlFor='pincode'>Pincode</InputLabel>
                                        <Input id='pincode' name='pincode' type='text' value={this.state.pincode}
                                               pincode={this.state.pincode}
                                               onChange={this.onInputFieldChangeHandler}/>
                                        {this.state.pincodeRequired ? <FormHelperText>
                                            <span style={{color: "red"}}>required</span>
                                        </FormHelperText> : null}
                                        {!this.state.pincodeRequired && !this.state.pincodeValid ? <FormHelperText>
                                            <span style={{color: "red"}}>Pincode must contain only numbers and must be 6 digits long</span>
                                        </FormHelperText> : null}
                                    </FormControl>
                                    <br/>
                                    <br/>
                                    <FormControl style={{maxWidth: 150}}>
                                        <Button variant='contained' color='secondary' onClick={this.saveAddressHandler}>SAVE
                                            ADDRESS</Button>
                                    </FormControl>
                                </div>
                                <br/>
                                <div>
                                    <Button style={{margin: 5}} disabled={this.state.activeStep === 0}>Back</Button>
                                    <Button style={{margin: 5}} className='button' variant="contained" color="primary"
                                            onClick={this.incrementActiveStepHandler}>Next</Button>
                                </div>
                            </StepContent>
                        </Step>

                        {/* // Payment Selection Section */}
                        <Step key='Payment'>
                            <StepLabel>Payment</StepLabel>
                            <StepContent>
                                <div id='payment-modes'>
                                    <FormControl>
                                        <FormLabel>Select Mode of Payment</FormLabel>
                                        <RadioGroup onChange={this.paymentSelectionHandler} value={this.state.paymentId}>
                                            {(this.state.payments || []).map((payment, index) => (
                                                <FormControlLabel key={payment.id} value={payment.id} control={<Radio/>}
                                                                  label={payment.payment_name}/>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                                <Button style={{margin: 5}} onClick={this.decrementActiveStepHandler}>Back</Button>
                                <Button style={{margin: 5}} variant="contained" color="primary" onClick={this.incrementActiveStepHandler}>Finish</Button>
                            </StepContent>
                        </Step>
                    </Stepper>
                    <div className={this.state.displayChange}>
                        <Typography style={{marginLeft: 40}} variant='h5'>
                            View the summary and place your order now!
                        </Typography>
                        <Button style={{marginLeft: 40, marginTop: 20}} onClick={this.resetActiveStepHandler}>CHANGE</Button>
                    </div>
                </div>

                {/* // Order Summary Section */}
                <div className='summary-section'>
                    <Card variant='elevation' className='summary-card'>
                        <CardContent style={{margin: "20px"}}>
                            <Typography variant="h5" component="h2">
                                Summary
                            </Typography>
                            <br/>
                            <Typography variant='h6' component='h3' color='textSecondary'
                                        style={{textTransform: "capitalize", marginBottom: 15}}>
                                {JSON.parse(sessionStorage.getItem("checkoutSummary")).restaurantName}
                            </Typography>
                            <div className="checkout-cart-item">
                                <ListCheckoutItems
                                    itemsAdded={JSON.parse(sessionStorage.getItem("checkoutSummary")).itemsAddedForOrder}
                                    page="checkout"
                                />
                            </div>
                            <Divider></Divider>
                            <div className="checkout-cart-total">
                                <Typography style={{ fontWeight: 600 }} component="div">
                                <div>
                                    <span style={{float: 'left'}}>NET AMOUNT</span>
                                    <span style={{float: 'right'}}>
                                        <i className="fa fa-rupee-sign" aria-hidden="true" />{" "}
                                        {JSON.parse(sessionStorage.getItem("checkoutSummary")).totalAmount.toFixed(2)}
                                    </span>
                                </div>
                                </Typography>
                            </div>
                            <br/><br/>
                            <Button
                                variant="contained"
                                color="primary"
                                className="checkout-cart-button"
                                onClick={this.placeOrderHandler}
                            >
                                PLACE ORDER
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* // Order success/error snackbar. */}
            <div>
                <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} key='01'
                          message={this.state.placeOrderMessage}
                          open={this.state.placeOrderMessageOpen}
                          onClose={this.placeOrderMessageClose}
                          autoHideDuration={6000}
                          action={<Fragment> <IconButton color='inherit'
                                                         onClick={this.placeOrderMessageClose}><CloseIcon/></IconButton></Fragment>}/>
            </div>
        </Fragment>
        );
    }

    // Sets the payment mode selected by the user.
    paymentSelectionHandler = (e) => {
        this.setState({'paymentId': e.target.value});
    }

    // On clicking Next in the step move to the next step.
    incrementActiveStepHandler = () => {
        if (this.state.activeStep === 0 && this.state.selectedAddressId === undefined) {
            // No action if the user is at address step and address is not selected.
        } else if (this.state.activeStep === 1 && this.state.paymentId === '') {
            // No action if the user is at payment step and payment is not selected.
        } else {
            let activeState = this.state.activeStep + 1;
            let changeAddressPayment = 'display-none';
            if (activeState === 2) {
                changeAddressPayment = 'display-block';
            }
            this.setState({activeStep: activeState, displayChange: changeAddressPayment})
        }
    }

    // On clicking Beck in the step move to the previous step.
    decrementActiveStepHandler = () => {
        let activeState = this.state.activeStep - 1;
        this.setState({activeStep: activeState})
    }

    // Switch between new and existing address tab.
    changeActiveTabHandler = (value) => {
        this.setState({activeTab: value})
        if (value === 'existingAddress') {
            this.fetchAddress();
        }
    }

    // On clicking Change, reset the step state to the initial state.
    resetActiveStepHandler = () => {
        this.setState({activeStep: 0, displayChange: 'display-none'})
    }

    // Sets the address selected by the user.
    selectAddressHandler = (id) => {
        this.setState({selectedAddressId: id})
    }

    // Triggered on input field change under New Address and perform necessary validations.
    onInputFieldChangeHandler = (e) => {
        let stateKey = e.target.id;
        let stateValue = e.target.value;
        if (stateKey === undefined) {
            stateKey = 'stateUUID';
        }
        let stateValueRequiredKey = stateKey + 'Required';
        let stateKeyRequiredValue = false;
        if (stateValue === '') {
            stateKeyRequiredValue = true;
        }
        let validPincode = this.state.pincodeValid;
        if (stateKey === 'pincode') {
            validPincode = this.validatePincode(stateValue);
        }
        this.setState({
            [stateKey]: stateValue,
            [stateValueRequiredKey]: stateKeyRequiredValue,
            'pincodeValid': validPincode
        });
    }

    // Validates a 6 digit pincode
    validatePincode = (pincode) => {
        if (pincode !== undefined && pincode.length !== 6) {
            return false;
        } else if (!isNaN(pincode) && pincode.length === 6) {
            return true;
        } else {
            return false;
        }
    }

    // For Closing the snackbar.
    placeOrderMessageClose = () => {
        this.setState({placeOrderMessageOpen: false});
    }

    // Fetch the existing addresses from the backend.
    fetchAddress = () => {
        let token = localStorage.getItem('access-token');
        let xhr = new XMLHttpRequest();
        let that = this;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({addresses: JSON.parse(this.responseText).addresses});
            }
        });

        xhr.open('GET', GET_ADDRESS_CUSTOMER_URL);
        xhr.setRequestHeader('authorization', 'Bearer ' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
    }

    // Fetches the list of states from the backend.
    fetchStates = () => {

        let xhr = new XMLHttpRequest();
        let that = this;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({states: JSON.parse(this.responseText).states});
            }
        });

        xhr.open('GET', GET_STATES_URL);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
    }

    // Save Address in the database for a new address entered.
    saveAddressHandler = () => {
        let tempCityRequired = false;
        let tempPincodeRequired = false;
        let tempFlatRequired = false;
        let tempStateRequired = false;
        let tempLocalityRequired = false;

        if (this.state.city === '' || this.state.cityRequired) {
            tempCityRequired = true;
        }

        if (this.state.locality === '' || this.state.localityRequired) {
            tempLocalityRequired = true;
        }

        if (this.state.flat === '' || this.state.flatRequired) {
            tempFlatRequired = true;
        }

        if (this.state.stateUUID === '' || this.state.stateUUIDRequired) {
            tempStateRequired = true;
        }

        if (this.state.pincode === '' || this.state.pincodeRequired) {
            tempPincodeRequired = true;
        }

        if (tempFlatRequired || tempPincodeRequired || tempStateRequired || tempLocalityRequired || tempCityRequired) {
            this.setState({
                flatRequired: tempFlatRequired,
                localityRequired: tempLocalityRequired,
                cityRequired: tempCityRequired,
                stateUUIDRequired: tempStateRequired,
                pincodeRequired: tempPincodeRequired
            })
            return;
        }

        let address = {
            city: this.state.city,
            flat_building_name: this.state.flat,
            locality: this.state.locality,
            pincode: this.state.pincode,
            state_uuid: this.state.stateUUID
        }

        let token = localStorage.getItem('access-token');
        let xhr = new XMLHttpRequest();
        let that = this;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    addresses: JSON.parse(this.responseText).addresses,
                    city: '',
                    locality: '',
                    flat: '',
                    stateUUID: '',
                    pincode: ''
                });
            }
        });

        xhr.open('POST', ADD_ADDRESS_URL);
        xhr.setRequestHeader('authorization', 'Bearer ' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify(address));
    }

    // Fetches the payment modes from the backend.
    fetchPayments = () => {
        let xhr = new XMLHttpRequest();
        let that = this;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({payments: JSON.parse(this.responseText).paymentMethods});
            }
        });

        xhr.open('GET', GET_PAYMENT_METHODS_URL);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
    }

    // Place order and save to database or throw an error in case of incorrect or invalid entries.
    placeOrderHandler = () => {
        let orderDetails = JSON.parse(sessionStorage.getItem("checkoutSummary"));
        let amount = orderDetails.totalAmount.toFixed(2);
        let orderItems = orderDetails.itemsAddedForOrder;
        let restaurantId = orderDetails.restaurantId;

        if (this.state.selectedAddressId === '' || this.state.selectedAddressId === undefined || this.state.paymentId === '' || this.state.paymentId === undefined || this.state.displayChange === 'display-none') {
            this.setState({
                placeOrderMessage: 'Unable to place your order! Please try again!',
                placeOrderMessageOpen: true
            })
            return;
        }
        let bill = amount;
        let itemQuantities = [];
        orderItems.map((item, index) => (
            itemQuantities.push({item_id: item.id, price: item.quantity * item.unitPrice, quantity: item.quantity})
        ))
        let order = {
            address_id: this.state.selectedAddressId,
            coupon_id: this.state.couponId,
            item_quantities: itemQuantities,
            payment_id: this.state.paymentId,
            restaurant_id: restaurantId,
            bill: bill,
            discount: 0
        }

        let token = localStorage.getItem('access-token');
        let xhr = new XMLHttpRequest();
        let that = this;

        xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if (this.status === 201) {
                        let orderId = JSON.parse(this.responseText).id;
                        that.setState({
                            placeOrderMessage: 'Order placed successfully! Your order ID is ' + orderId,
                            placeOrderMessageOpen: true
                        });
                    } else {
                        that.setState({
                            placeOrderMessage: 'Unable to place your order! Please try again!',
                            placeOrderMessageOpen: true
                        });
                        console.clear();
                    }
                }
            }
        );

        xhr.open('POST', PLACE_ORDER_URL);
        xhr.setRequestHeader('authorization', 'Bearer ' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify(order));
    }
}

export default Checkout;