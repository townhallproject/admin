import React from 'react'
import { Select } from 'antd';

const Option = Select.Option;

export const IN_PERSON_ICON_FLAG = 'in-person';
export const ACTIVISM_ICON_FLAG = 'activism';
export const TELE_ICON_FLAG = 'tele';
export const CAMPAIGN_ICON_FLAG = 'campaign';
export const STAFF_ICON_FLAG = 'staff';
export const HR_1_ICON_FLAG = 'hr-one';
export const NEXT_GEN_ICON_FLAG='next-gen';
export const THFOL = 'mfol';

export default class MeetingTypeSelect extends React.Component {

  render() {
    const {
      iconFlag,
      onSelect,
    } = this.props;
    return (
      <div>
        <Select
            defaultValue={iconFlag}
            key="iconFlag"
            placeholder="icon type"
            onSelect={onSelect}
            style={{width: 200 }}
          >
            <Option value={IN_PERSON_ICON_FLAG}>
            In Person
            </Option>
            <Option value={THFOL}>
              TH For Our Lives
            </Option>
            <Option value={ACTIVISM_ICON_FLAG}>
            Activist Event
            </Option>
            <Option value={TELE_ICON_FLAG}>
            Tele Town Hall
            </Option>
            <Option value={CAMPAIGN_ICON_FLAG}>
            Campaign Town Hall
            </Option>
            <Option value={STAFF_ICON_FLAG}>
            Staff 
            </Option>
            <Option value={HR_1_ICON_FLAG}>
            HR 1 Event
            </Option>
            <Option value={NEXT_GEN_ICON_FLAG}>
            Youth Vote Town Hall
            </Option>
          </Select>
      </div>
    )
  }
}