import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Button,
  Checkbox,
  Input,
  DatePicker,
  Form,
  TimePicker,
  Alert,
} from 'antd';
import ArchiveLocationForm from './LocationForm';
import ArchiveDateTimeForm from './DateTimeForm';

const FormItem = Form.Item;
const timeFormats = ['hh:mm A', 'h:mm A'];
const archiveEventsTimeFormat = 'YYYY-MM-DDTHH:mm:ssZZ'

class ArchiveAddressDateEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkData = this.checkData.bind(this);
  }

  handleSubmit(e) {
    const {
      townHall,
      updateEvent,
      tempAddress,
      setTimeZone,
      pathForEvents,
      handleClose,
    } = this.props;
    e.preventDefault();
    if (tempAddress.address) {
      console.log('still have address')
      return;
    }
    this.props.form.validateFieldsAndScroll((err, vals) => {
      if (!err) {
        const date = vals.date.format('YYYY-MM-DD');
        const startTime = vals.time.format('HH:mm:ss');
        const endTime = vals.endTime.format('HH:mm:ss');
        const updateObj = {
          timestamp: moment(`${date}T${startTime}`).format('x'),
          timeStart: moment(`${date}T${startTime}`).format(),
          timeEnd: moment(`${date}T${endTime}`).format(),
          location: vals.location,
          address: vals.address,
        }
        console.log(updateObj);
        updateEvent(updateObj, townHall.eventId);
      }
    });
  }

  checkData() {
    const {
      tempAddress,
      setTimeZone,
      townHall,
      pathForEvents,
      handleClose,
    } = this.props;
    if (tempAddress.address) {
      console.log('still have address')
      return;
    }
    this.setState({
      loading: false,
    });
    const dateTime = moment.parseZone(townHall.timeStart);
    const date = dateTime.format('ddd, MMM DD YYYY');
    const time = dateTime.format('hh:mm A');
    setTimeZone({
      date: date,
      time: time,
      timestamp: townHall.timestamp,
      timeStart: townHall.timeStart,
      timeEnd: townHall.timeEnd,
      lat: townHall.lat,
      lng: townHall.lng,
      eventId: townHall.eventId,
      pathForEvents: pathForEvents,
    });
    handleClose();
  }

  render() {
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 },
        xs: { span: 24 },
      },
      wrapperCol: {
        sm: { span: 16 },
        xs: { span: 24 },
      },
    };
    const {
      townHall,
      tempAddress,
      setTempAddress,
      clearTempAddress,
      updateEvent,
      setLatLng,
      handleClose,
    } = this.props;
    const {
      getFieldDecorator,
      getFieldValue,
      resetFields,
    } = this.props.form;
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <ArchiveDateTimeForm 
          townHall={townHall}
          getFieldDecorator={getFieldDecorator}
        />
        <ArchiveLocationForm 
          currentTownHall={townHall}
          geoCodeLocation={setTempAddress}
          tempAddress={tempAddress.address}
          tempAddressFullData={tempAddress}
          clearTempAddress={clearTempAddress}
          tempLat={tempAddress.lat}
          tempLng={tempAddress.lng}
          getFieldDecorator={getFieldDecorator}
          getFieldValue={getFieldValue}
          resetFields={resetFields}
          updateEvent={updateEvent}
        />
        <Button type="primary" htmlType="submit">
          OK
        </Button>
        <Button onClick={handleClose}>
          Cancel
        </Button>
      </Form>
    )
  }
}

const WrappedArchiveAddressDateEditForm = Form.create({ 
  name: 'address-date-form'
})(ArchiveAddressDateEditForm);

export default WrappedArchiveAddressDateEditForm;