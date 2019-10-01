import React from 'react';
import {
  Button,
  Form,
} from 'antd';
import ArchiveLocationForm from './LocationForm';
import ArchiveDateTimeForm from './DateTimeForm';

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
      handleClose,
    } = this.props;
    e.preventDefault();
    if (tempAddress.address) {
      console.log('still have address')
      return;
    }
    this.props.form.validateFieldsAndScroll((err, vals) => {
      if (!err) {
        const updateObj = {
          location: vals.location,
          address: vals.address,
        }
        updateEvent(updateObj, townHall.eventId);
        this.checkData(vals);
        handleClose();
      }
    });
  }

  checkData(vals) {
    const {
      tempAddress,
      setTimeZone,
      townHall,
    } = this.props;
    if (tempAddress.address) {
      console.log('still have address')
      return;
    }
    this.setState({
      loading: false,
    });
    console.log(vals);
    const date = vals.date.format('YYYY-MM-DD');
    const startTime = vals.time.format('HH:mm:ss');
    const endTime = vals.endTime.format('HH:mm:ss');
    setTimeZone({
      date: date,
      timeStart: startTime,
      timeEnd: endTime,
      lat: townHall.lat,
      lng: townHall.lng,
      eventId: townHall.eventId,
    });
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