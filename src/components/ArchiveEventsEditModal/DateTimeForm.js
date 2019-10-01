import React from 'react';
import moment from 'moment';
import {
  Button,
  Checkbox,
  Input,
  DatePicker,
  Form,
  TimePicker,
} from 'antd';

const FormItem = Form.Item;
const timeFormats = ['hh:mm A', 'h:mm A'];
const archiveEventsTimeFormat = 'YYYY-MM-DDTHH:mm:ssZZ'

class ArchiveDateTimeForm extends React.Component {
  constructor(props) {
    super(props);
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
      getFieldDecorator,
    } = this.props;
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
    const {
      townHall,
      getFieldDecorator,
    } = this.props;
    const {
      startOpen,
      endTimeOpen,
    } = this.state;

    return (
      <React.Fragment>
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
      </React.Fragment>
    )
  }
}

export default ArchiveDateTimeForm;