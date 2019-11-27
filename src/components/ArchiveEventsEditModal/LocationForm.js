import React from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  Form,
  Switch,
  Button,
} from 'antd';
import { includes } from 'lodash';


const { Search } = Input;
const FormItem = Form.Item;

const initialState = {
  showResponse: false,
  validating: '',
  value: undefined,
  eventState: undefined,
  includeState: false,
};

class ArchiveLocationForm extends React.Component {
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

  componentDidMount() {
    const {
      geoCodeLocation,
      getFieldValue,
    } = this.props;
    console.log(getFieldValue('address'));
    geoCodeLocation(getFieldValue('address'));
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
      setFieldsValue,
      setAddressConfirm,
    } = this.props;

    // if (this.state.includeState && tempAddressFullData.state && tempAddressFullData.stateName) {
    //   updateEvent({
    //     ...currentTownHall,
    //     ...tempAddressFullData,
    //   })
    // }
    // updateEvent({
    //   ...currentTownHall,
    //   lat: tempLat,
    //   lng: tempLng,
    //   address: tempAddress
    // });
    this.setState({
      showResponse: false,
    });
    setFieldsValue({'address': tempAddress})
    // clearTempAddress();
    setAddressConfirm(true);
  }

  discardTempAddress() {
    const {
      clearTempAddress,
      resetFields,
      setAddressConfirm,
    } = this.props;
    this.setState({
      showResponse: false,
    });
    setAddressConfirm(true);
    resetFields(['address']);
  }

  handleSearch() {
    const {
      geoCodeLocation,
      currentTownHall,
      setAddressConfirm,
    } = this.props;
    const {
      value,
    } = this.state;
    if (currentTownHall.address === value || !value) {
      return;
    }
    geoCodeLocation(value);
    setAddressConfirm(false);
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

  receiveTempAddress() {
    this.setState({
      validating: false,
    });
  }

  toggleIncludeState(value) {
    console.log(value);
    const {
      currentTownHall,
      geoCodeLocation,
      tempAddressFullData,
    } = this.props;
    // if user has not searched new address...
    // if (!this.state.value && value) {
    //   geoCodeLocation(currentTownHall.address);
    //   this.setState({
    //     eventState: tempAddressFullData.state,
    //   });
    // }
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
        })(<Input type="tel" placeholder="Phone Number" />)}
      </FormItem>);
  }

  render() {
    const {
      style,
      getFieldDecorator,
      tempAddress,
      requiredFields,
      currentTownHall,
    } = this.props;
    const {
      showResponse,
      validating,
    } = this.state;
    return (
      <React.Fragment>
        <FormItem 
          class="general-inputs"
          label="Location"
        >
          {getFieldDecorator('location', {
            initialValue: currentTownHall.location,
          })(
            <Input
              type="text"
              className="input-underline"
              id="location"
              placeholder="Name of location (eg. Gary Recreation Center)"
            />,
          )}
        </FormItem>
        <FormItem 
          label="is a presidental event"
          help="switch on if the event should be stored by the event location and not the MOC state/district"
        >
          {getFieldDecorator('presidential', {
            valuePropName: 'checked',
            initialValue: currentTownHall.chamber === 'nationwide' ? true : false,
          })(
            <Switch onChange={this.toggleIncludeState} />
          )}
        </FormItem>
        {currentTownHall.meetingType === 'Tele-Town Hall' ? this.renderTeleInputs()
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

ArchiveLocationForm.propTypes = {
  address: PropTypes.string,
  // clearTempAddress: PropTypes.func.isRequired,
  geoCodeLocation: PropTypes.func.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  style: PropTypes.shape({}),
  tempAddress: PropTypes.string,
  tempLat: PropTypes.number,
  tempLng: PropTypes.number,
};

ArchiveLocationForm.defaultProps = {
  address: '',
  style: null,
  tempAddress: null,
  tempLat: 0,
  tempLng: 0,
};

export default ArchiveLocationForm;
