import React from 'react'
import { Select } from 'antd';
import { ICON_FLAGS } from '../../constants';

const Option = Select.Option;

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
            placeholder="Icon Flag"
            onSelect={onSelect}
            style={{width: 200 }}
          >
            {ICON_FLAGS.map((val) => {
              return <Option value={val.data}>{val.text}</Option>
            })}
          </Select>
      </div>
    )
  }
}