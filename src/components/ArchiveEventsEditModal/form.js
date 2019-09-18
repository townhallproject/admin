import React from 'react';
import { Input, Form, Select } from 'antd';
import LocationForm from '../LocationForm';

class ArchiveAddressDateEditForm extends React.Component {

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
      passFormData,
      updateEvent,
      setLatLng,
    } = this.props;
    townHall.Location = townHall.location;
    const {
      getFieldDecorator,
      getFieldValue,
      setFieldsValue,
      resetFields,
    } = this.props.form;
    return (
      <Form {...formItemLayout}>
        <LocationForm 
          currentTownHall={townHall}
          geoCodeLocation={setTempAddress}
          tempAddress={tempAddress.address}
          tempAddressFullData={tempAddress}
          address={townHall['address']}
          clearTempAddress={clearTempAddress}
          tempLat={tempAddress.lat}
          tempLng={tempAddress.lng}
          tempStateInfo={{
            state: tempAddress.state,
            stateName: tempAddress.stateName,
          }}
          saveAddress={setLatLng}
          handleInputBlur={this.handleInputBlur}
          getFieldDecorator={getFieldDecorator}
          setFieldsValue={setFieldsValue}
          getFieldValue={getFieldValue}
          resetFields={resetFields}
          updateEvent={updateEvent}
          passFormData={passFormData}
        />
      </Form>
    )
  }
}

const WrappedArchiveAddressDateEditForm = Form.create({ 
  name: 'address-date-form'
})(ArchiveAddressDateEditForm);

export default WrappedArchiveAddressDateEditForm;