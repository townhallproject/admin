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
    const { townHall } = this.props;
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeStartTime = this.onChangeStartTime.bind(this);
    this.onChangeEndTime = this.onChangeEndTime.bind(this);
    this.closeTimeStart = this.closeTimeStart.bind(this);
    this.closeEndTime = this.closeEndTime.bind(this);
    this.handleOpenStartChange = this.handleOpenStartChange.bind(this);
    this.handleOpenEndChange = this.handleOpenEndChange.bind(this);
    this.onRepeatingEventCheckboxChanged = this.onRepeatingEventCheckboxChanged.bind(this);
    this.state = {
      repeatingEvent: false,
      startOpen: false,
      endTimeOpen: false,
      pastDateWarning: moment().isAfter(moment(townHall.timestamp, 'ddd, MMM D YYYY')),
      date: moment(townHall.timestamp, 'x').format('ddd, MMM D YYYY'),
      timeStart: moment(townHall.timeStart, 'kk:mm:ss'),
      timeEnd: moment(townHall.timeEnd, 'kk:mm:ss'),
      offset: moment(townHall.timestamp, 'ZZ'),
    };
  }

  onRepeatingEventCheckboxChanged(e) {
    this.setState({ repeatingEvent: e.target.checked });
  }


  onChangeDate(date) {
    const {
      updateEvent,
      townHall,
    } = this.props;
    const newDate = moment.parseZone(date).format('YYYY-MM-DD');
    const endTime = moment.parseZone(townHall.timeEnd).format('HH:mm:ss');
    const offset = moment.parseZone(townHall.timeEnd).utcOffset();
    const newTimeEnd = moment(`${newDate}T${endTime}`, archiveEventsTimeFormat);
    const updateObject = {
      timestamp: moment(date).format('x'),
      timeStart: moment(date).utcOffset(offset).format(archiveEventsTimeFormat),
      timeEnd: newTimeEnd.utcOffset(offset).format(archiveEventsTimeFormat),
    }
    if (moment().isAfter(date)) {
      this.setState({ pastDateWarning: true });
    } else {
      this.setState({ pastDateWarning: false });
    }
    updateEvent(updateObject, townHall.eventId);
  }

  onChangeStartTime(time, timeString) {
    const {
      updateEvent,
      townHall,
    } = this.props;
    const updateObject = {
      timestamp: time.format('x'),
      timeStart: time.format(archiveEventsTimeFormat),
    }
    updateEvent(updateObject, townHall.eventId);
  }

  onChangeEndTime(time, timeString) {
    const {
      updateEvent,
      townHall,
    } = this.props;
    const updateObject = {
      timeEnd: time.format(archiveEventsTimeFormat),
    }
    updateEvent(updateObject, townHall.eventId);
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
      pastDateWarning,
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
        {pastDateWarning && (
          <Alert
            description="The selected date has already passed"
            type="warning"
            closable
          ></Alert>
        )}
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
      <Form {...formItemLayout}>
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
                onChange={this.onChangeStartTime}
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
              onChange={this.onChangeEndTime}
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
      </Form>
    )
  }
}

const WrappedArchiveAddressDateEditForm = Form.create({ 
  name: 'address-date-form'
})(ArchiveAddressDateEditForm);

export default WrappedArchiveAddressDateEditForm;