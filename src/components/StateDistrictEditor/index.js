import React from 'react';
import { Input } from 'antd';

export default class StateDistrictEditor extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      usState: value.usState || '',
      district: value.district || '',
    };
  }

  handleUsStateChange = (e) => {
    if (!('value' in this.props)) {
      this.setState({ usState: e.target.value });
    }
    this.triggerChange({ usState: e.target.value });
  };

  handleDistrictChange = (e) => {
    if (!('value' in this.props)) {
      this.setState({ district: e.target.value });
    }
    this.triggerChange({ district: e.target.value });
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange, saveChanges } = this.props;
    if (onChange) {
      onChange({
        ...this.state,
        ...changedValue,
      });
    }
    saveChanges({
      ...this.state,
      ...changedValue,
    })
  };

  render() {
    const { usState, district } = this.state;
    console.log(usState, district)
    return (
      <React.Fragment>
        <Input
          key="state"
          addonBefore="State"
          defaultValue={usState}
          onPressEnter={this.handleUsStateChange}
        />
        <Input 
          key="district"
          addonBefore="District"
          defaultValue={district}
          onPressEnter={this.handleDistrictChange}
        />
      </React.Fragment>
    );
  }
}
