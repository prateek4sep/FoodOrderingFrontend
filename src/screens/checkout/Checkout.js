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
import {ADD_ADDRESS_URL, GET_ADDRESS_CUSTOMER_URL, GET_PAYMENT_METHODS_URL, GET_STATES_URL} from "../../common/common";
import {FormControlLabel, FormLabel, Radio, RadioGroup} from "@material-ui/core";

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
            displayChange: 'display-none'
        }
    }

    componentDidMount() {
        if ( localStorage.getItem('access-token') !== null) {
            this.fetchAddress();
            this.fetchStates();
            this.fetchPayments();
        }
    }

    render() {
        return <Fragment>
            <Header></Header>
            <div className='main-container'>
                <div className='delivery-payment-section'>
                    <Stepper activeStep={this.state.activeStep} orientation='vertical'>
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
                                <div className={this.state.activeTab === 'existingAddress' ? 'display-block' : 'display-none'}>
                                    {this.state.addresses === undefined || this.state.addresses.length === 0 ?
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
                                        <Button variant='contained' color='secondary' onClick={this.saveAddress}>SAVE
                                            ADDRESS</Button>
                                    </FormControl>
                                </div>
                                <br/>
                                <div>
                                    <Button style={{margin: 5}} disabled={this.state.activeStep === 0}>Back</Button>
                                    <Button style={{margin: 5}} className='button' variant="contained" color="primary"
                                            onClick={this.incrementActiveStep}>Next</Button>
                                </div>
                            </StepContent>
                        </Step>
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
                                <Button style={{margin: 5}} onClick={this.decrementActiveStep}>Back</Button>
                                <Button style={{margin: 5}} variant="contained" color="primary" onClick={this.incrementActiveStep}>Finish</Button>
                            </StepContent>
                        </Step>
                    </Stepper>
                </div>

            </div>
        </Fragment>
    }

    paymentSelectionHandler = (e) => {
        this.setState({'paymentId': e.target.value});
    }

    incrementActiveStep = () => {
        if (this.state.activeStep === 0 && this.state.selectedAddressId === undefined) {

        } else if (this.state.activeStep === 1 && this.state.paymentId === '') {

        } else {
            let activeState = this.state.activeStep + 1;
            let changeAddressPayment = 'display-none';
            if (activeState === 2) {
                changeAddressPayment = 'display-block';
            }
            this.setState({activeStep: activeState, displayChange: changeAddressPayment})
        }
    }

    decrementActiveStep = () => {
        let activeState = this.state.activeStep - 1;
        this.setState({activeStep: activeState})
    }

    changeActiveTabHandler = (value) => {
        this.setState({activeTab: value})
        if (value === 'existingAddress') {
            this.fetchAddress();
        }
    }

    selectAddressHandler = (id) => {
        this.setState({selectedAddressId: id})
    }

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

    validatePincode = (pincode) => {
        if (pincode !== undefined && pincode.length !== 6) {
            return false;
        } else if (!isNaN(pincode) && pincode.length === 6) {
            return true;
        } else {
            return false;
        }
    }

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

    saveAddress = () => {
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

}

export default Checkout;