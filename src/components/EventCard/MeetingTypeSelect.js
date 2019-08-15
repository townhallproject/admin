import React from 'react'
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
            <Option value="Town Hall">
            Town Hall
            </Option>
            <Option value="Gun Safety Activist Event">
            Gun Safety Activist Event
            </Option>
            <Option value="H.R. 1 Town Hall">
            H.R. 1 Town Hall
            </Option>
            <Option value="H.R. 1 Activist Event">
            H.R. 1 Activist Event
            </Option>
            <Option value="Tele-Town Hall">
            Tele-Town Hall
            </Option>
            <Option value="Ticketed Event">
            Ticketed Event
            </Option>
            <Option value="Campaign Town Hall">
            Campaign Town Hall
            </Option>
            <Option value="Adopt-A-District/State">
            Adopt-A-District/State
            </Option>
            <Option value="Empty Chair Town Hall">
            Empty Chair Town Hall
            </Option>
            <Option value="Hearing">
            Hearing
            </Option>
            <Option value="DC Event">
            DC Event
            </Option>
            <Option value="Office Hours">
            Office Hours
            </Option>
            <Option value="Other">
              Other
            </Option>
          </Select>
      </div>
    )
  }
}