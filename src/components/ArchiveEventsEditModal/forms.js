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
import LocationForm from './LocationForm';

const FormItem = Form.Item;
const timeFormats = ['hh:mm A', 'h:mm A'];
const archiveEventsTimeFormat = 'YYYY-MM-DDTHH:mm:ssZZ'

class ArchiveAddressDateEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkData = this.checkData.bind(this);
    this.closeTimeStart = this.closeTimeStart.bind(this);
    this.closeEndTime = this.closeEndTime.bind(this);
    this.handleOpenStartChange = this.handleOpenStartChange.bind(this);
    this.handleOpenEndChange = this.handleOpenEndChange.bind(this);
    this.onRepeatingEventCheckboxChanged = this.onRepeatingEventCheckboxChanged.bind(this);
    this.state = {
      repeatingEvent: false,
      startOpen: false,
      endTimeOpen: false,
    };
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

  onRepeatingEventCheckboxChanged(e) {
    this.setState({ repeatingEvent: e.target.checked });
  }

  closeTimeStart() {
    this.setState({ startOpen: false });
  }

  closeEndTime() {
    this.setState({ endTimeOpen: false });
  }

  handleOpenStartChange(open) {
    this.setState({ startOpen: open });
  }

  handleOpenEndChange(open) {
    this.setState({ endTimeOpen: open });
  }

  renderRepeatingEvent() {
    const {
      townHall,
    } = this.props;
    const {
      getFieldDecorator,
    } = this.props.form;
    const { 
      repeatingEvent,
    } = this.state;
    return repeatingEvent ? (
      <FormItem
        className="repeating"
        label="Repeating Event"
      >
        {getFieldDecorator('repeatingEvent', {
          initialValue: '',
        })(
          <Input
            type="text"
            className="input-underline"
            id="repeatingEvent"
            placeholder="Eg. First Tuesday of the month"
          />,
        )}
      </FormItem>
    ) : (
      <FormItem>
        {getFieldDecorator('date', {
          initialValue: moment(townHall.timeStart, archiveEventsTimeFormat),
          rules: [{
            message: 'Please enter a valid date',
            required: true,
          }],
        })(<DatePicker 
            onChange={this.onChangeDate}
            format='L'
          />)}
      </FormItem>
    );
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
      passFormData,
      updateEvent,
      setLatLng,
      handleClose,
    } = this.props;
    const {
      getFieldDecorator,
      getFieldValue,
      setFieldsValue,
      resetFields,
    } = this.props.form;
    const {
      startOpen,
      endTimeOpen,
    } = this.state;
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <FormItem className="checkbox">
          <Checkbox
            onChange={this.onRepeatingEventCheckboxChanged}
          >
            Repeating Event
          </Checkbox>
        </FormItem>
        {this.renderRepeatingEvent()}
        <FormItem label="Start time">
          {getFieldDecorator('time', {
            initialValue: moment.parseZone(townHall.timeStart),
            rules: [{
              message: 'Please enter a valid time',
              required: true,
            }],
          })(<TimePicker
                use12Hours
                minuteStep={15}
                format="hh:mm A"
                defaultOpenValue={moment().hour(0).minute(0)}
                open={startOpen}
                onOpenChange={this.handleOpenStartChange}
                allowClear={false}
                addon={() => (
                  <Button size="small" type="primary" onClick={this.closeTimeStart}>
                    Ok
                  </Button>
                )}
              />
            )}
        </FormItem>
        <FormItem label="End time">
          {getFieldDecorator('endTime', {
              initialValue: moment.parseZone(townHall.timeEnd),
            },
          )(<TimePicker
              use12Hours
              minuteStep={15}
              format="h:mm A"
              allowClear={false}
              open={endTimeOpen}
              onOpenChange={this.handleOpenEndChange}
              addon={() => (
                <Button size="small" type="primary" onClick={this.closeEndTime}>
                    Ok
                </Button>
              )}
            />,
          )}
        </FormItem>
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