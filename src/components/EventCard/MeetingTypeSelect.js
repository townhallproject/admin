import React from 'react'
import { MEETING_TYPE_OPTIONS } from '../../constants';
import { Select } from 'antd';
const Option = Select.Option;

function handleChange(value) {
  console.log(`selected ${value}`);
}

export default class MeetingTypeSelect extends React.Component {

  render() {
    const {
      meetingType,
      selectMeetingType,
    } = this.props;
    return (
      <div>
        <Select
          defaultValue={meetingType}
          key="meetingType"
          placeholder="Meeting type"
          onSelect={selectMeetingType}
          style={{width: 200 }}
        >
          {MEETING_TYPE_OPTIONS.map((val) => {
            return <Option value={val}>{val}</Option>
          })}
        </Select>
      </div>
    )
  }
}