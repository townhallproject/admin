import React from 'react';
import {
  Button,
  Form,
  Row,
  Col,
} from 'antd';
import ArchiveLocationForm from './LocationForm';
import ArchiveDateTimeForm from './DateTimeForm';

class ArchiveEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkData = this.checkData.bind(this);
    this.setAddressConfirm = this.setAddressConfirm.bind(this);
    this.state = {
      addressConfirm: true,
    }
  }

  setAddressConfirm(val) {
    this.setState({
      addressConfirm: val,
    });
  }

  handleSubmit(e) {
    const {
      townHall,
      moc,
      updateEvent,
      clearTempAddress,
      handleClose,
      defaultUsState,
    } = this.props;
    e.preventDefault();
    if (!this.state.addressConfirm) {
      console.log('still have address')
      return;
    }
    this.props.form.validateFieldsAndScroll((err, vals) => {
      if (!err) {
        clearTempAddress();
        const updateObj = {};
        console.log(vals);
        if (vals.location) {
          updateObj.location = vals.location;
        }
        if (vals.presidential) {
          updateObj.chamber = 'nationwide';
          updateObj.state = defaultUsState;
        } else {
          updateObj.chamber = moc.chamber;
          updateObj.state = moc.state;
        }
        if (vals.address) {
          updateObj.address = vals.address;
        }
        if (vals.hasOwnProperty('phoneNumber')) {
          updateObj.phoneNumber = vals.phoneNumber;
        }
        updateEvent({
          ...townHall,
          ...updateObj,
        });
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
      townHall: townHall,
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
      updateEvent,
      handleClose,
    } = this.props;
    const {
      getFieldDecorator,
      resetFields,
      setFieldsValue,
      getFieldValue,
    } = this.props.form;
    return (
      <Form 
        {...formItemLayout} 
        onSubmit={this.handleSubmit} 
        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
      >
        <ArchiveDateTimeForm 
          townHall={townHall}
          getFieldDecorator={getFieldDecorator}
        />
        <ArchiveLocationForm 
          currentTownHall={townHall}
          geoCodeLocation={setTempAddress}
          tempAddress={tempAddress.address}
          tempAddressFullData={tempAddress}
          tempLat={tempAddress.lat}
          tempLng={tempAddress.lng}
          getFieldDecorator={getFieldDecorator}
          setFieldsValue={setFieldsValue}
          getFieldValue={getFieldValue}
          resetFields={resetFields}
          updateEvent={updateEvent}
          setAddressConfirm={this.setAddressConfirm}
        />
        <Row>
          <Col style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              OK
            </Button>
            <Button onClick={handleClose}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

const WrappedArchiveAddressDateEditForm = Form.create({ 
  name: 'address-date-form'
})(ArchiveEditForm);

export default WrappedArchiveAddressDateEditForm;