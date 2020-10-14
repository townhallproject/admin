import React, { Component } from "react";
import PropTypes from "prop-types";

import { Card, Button, Tag, Typography, notification, Icon } from "antd";
import "./style.scss";

import EditMeetingTypeForm from "./EditMeetingTypeForm";
import { connect } from "react-redux";

class MeetingTypeCard extends Component {
  state = {
    editing: false,
    loading: false,
  };

  handleFormOpen = () => {
    this.setState({ editing: !this.state.editing });
  };

  getNameFromIconFlags = (iconData) => {
    if (!iconData) return;

    const iconText = this.props.iconFlags.find(
      (icon) => icon.data == iconData.toString()
    );

    return iconText ? iconText.text : "";
  };

  openNotification = (title, description) => {
    notification.open({
      message: title,
      description,
      icon: <Icon type="smile" style={{ color: "#108ee9" }} />,
      duration: 3.0,
    });
  };

  render() {
    const { Text } = Typography;

    const { name, description, icon, color, display } = this.props.meetingType;

    const markup = !this.state.editing ? (
      <Card className="card">
        <div className="container">
          <div>
            <div className="name">
              <p>
                <Text strong>Name: </Text> {name}
              </p>
              <div className="color" style={{ backgroundColor: color }}></div>
            </div>
            <p>
              <Text strong>Description: </Text> {description}
            </p>
            <p>
              <Text strong>Map Icon: </Text> {this.getNameFromIconFlags(icon)}
            </p>

            <div className="tag">
              {display ? <Tag color="red">Include in table</Tag> : ""}
            </div>
          </div>

          <div>
            <Button onClick={this.handleFormOpen} type="primary">
              Edit
            </Button>
          </div>
        </div>
      </Card>
    ) : (
      <EditMeetingTypeForm
        meetingType={this.props.meetingType}
        handleFormOpen={this.handleFormOpen}
        openNotification={this.openNotification}
      />
    );

    return markup;
  }
}

MeetingTypeCard.propTypes = {
  meetingType: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  iconFlags: state.meetingTypes.iconFlags,
});

export default connect(mapStateToProps)(MeetingTypeCard);
