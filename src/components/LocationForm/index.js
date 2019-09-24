import React from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  Form,
  Switch,
  Button,
} from 'antd';
import { includes, debounce } from 'lodash';


const { Search } = Input;
const FormItem = Form.Item;

const initialState = {
  showResponse: false,
  validating: '',
  value: undefined,
};

class LocationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.clearAddressTimeout = this.clearAddressTimeout.bind(this);
    this.receiveTempAddress = this.receiveTempAddress.bind(this);
    this.toggleIncludeState = this.toggleIncludeState.bind(this);
    this.discardTempAddress = this.discardTempAddress.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { tempAddress } = this.props;
    if (!prevProps.tempAddress && tempAddress) {
      this.confirmingTime = setTimeout(this.receiveTempAddress, 300);
    }
  }

  onKeyDown(e) {
    e.preventDefault();
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  }

  clearAddressTimeout() {
    clearTimeout(this.confirmingTime);
    const {
      updateEvent,
      tempAddressFullData,
      tempAddress,
      tempLat,
      tempLng,
      clearTempAddress,
      currentTownHall,
    } = this.props;

    if (this.state.includeState && tempAddressFullData.state && tempAddressFullData.stateName) {
      updateEvent(tempAddressFullData, currentTownHall.eventId)
    }
    updateEvent({
      lat: tempLat,
      lng: tempLng,
      address: tempAddress
    }, currentTownHall.eventId);
    clearTempAddress();
  }

  discardTempAddress() {
    const {
      clearTempAddress,
      resetFields,
    } = this.props;
    this.setState({
      showResponse: false,
    });
    clearTempAddress();
    resetFields(['address']);
  }

  handleSearch() {
    const {
      geoCodeLocation,
      address,
    } = this.props;
    const {
      value,
    } = this.state;
    if (address === value || !value) {
      return;
    }
    geoCodeLocation(value);
    this.setState({
      showResponse: true,
      validating: 'validating',
    });
  }

  handleAddressChange({ target }) {
    if (!target) {
      this.setState(initialState);
    }
    this.setState({
      value: target.value,
    });
  }

  handleLocationChange({ target }) {
    this.debounceLocationChange(target.value);
  }

  debounceLocationChange = debounce((value) => {
    const { updateEvent } = this.props;
    updateEvent({ Location: value });
  }, 2000);

  receiveTempAddress() {
    this.setState({
      validating: false,
    });
  }

  toggleIncludeState(value) {
    console.log(value)
    this.setState({
      includeState: value,
    })
  }

  renderTeleInputs() {
    const {
      getFieldDecorator,
    } = this.props;
    return (
      <FormItem>
        {getFieldDecorator('phoneNumber', {
          initialValue: '',
        })(<Input type="tel" class="form-control" placeholder="Phone Number" />)}
      </FormItem>);
  }

  render() {
    const {
      style,
      getFieldDecorator,
      tempAddress,
      getFieldValue,
      requiredFields,
      currentTownHall,
    } = this.props;
    const {
      showResponse,
      validating,
    } = this.state;
    const meetingType = getFieldValue('meetingType');
    return (
      <React.Fragment>
        <FormItem 
          label="is a presidental event"
          help="switch on if the event should be stored by the event location and not the MOC state/district"
          >
          <Switch onChange={this.toggleIncludeState} />
        </FormItem>
        {meetingType === 'Tele-Town Hall' ? this.renderTeleInputs()
          : (
            <FormItem
              className="general-inputs"
              htmlFor="location-form-group"
              hasFeedback
              validateStatus={validating && !tempAddress ? 'validating' : ''}
              label="Full Street Address"
            >
              {getFieldDecorator('address', {
                initialValue: currentTownHall.address,
                rules: [{
                  message: 'please enter an address',
                  required: includes(requiredFields, 'address'),
                }],
              })(
                <Search
                  onPressEnter={this.handleSearch}
                  onSearch={this.handleSearch}
                  placeholder="address"
                  style={style}
                  onChange={this.handleAddressChange}
                  onBlur={this.handleSearch}
                />,
              )}
            </FormItem>
          )}
        {
          (tempAddress) && showResponse && (
            <div>
              <p>Address from geocoding: <br /><strong>{tempAddress}</strong></p>
              <Button size="small" onClick={this.clearAddressTimeout} type="primary" >
                Approve
              </Button>
              <Button size="small" onClick={this.discardTempAddress}>
                Discard
              </Button>
            </div>
          )}
      </React.Fragment>
    );
  }
}

LocationForm.propTypes = {
  address: PropTypes.string,
  clearTempAddress: PropTypes.func.isRequired,
  geoCodeLocation: PropTypes.func.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired,
  style: PropTypes.shape({}),
  tempAddress: PropTypes.string,
  tempLat: PropTypes.number,
  tempLng: PropTypes.number,
  tempStateInfo: PropTypes.shape({}),
};

LocationForm.defaultProps = {
  address: '',
  style: null,
  tempAddress: null,
  tempLat: 0,
  tempLng: 0,
  tempStateInfo: null,
};

export default LocationForm;
