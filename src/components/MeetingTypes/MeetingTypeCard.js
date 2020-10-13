import React, { Component } from "react";
import PropTypes from "prop-types";

import { Card, Button, Tag, Typography } from "antd";
import "./style.scss";

import { connect } from "react-redux";
// import meetingTypesBranch from "../../state/meeting-types";

class MeetingTypeCard extends Component {
  state = {
    editing: false,
  };

  render() {
    const { Text } = Typography;

    const {
      name,
      id,
      description,
      icon,
      color,
      email,
      text,
      display,
    } = this.props.meetingType;

    return (
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
              <Text strong>Map Icon: </Text> {icon}
            </p>

            <div className="tag">
              {display ? <Tag color="red">Include in table</Tag> : ""}
            </div>
          </div>

          <div>
            <Button type="primary">Edit</Button>
          </div>
        </div>
      </Card>
    );
  }
}

const mapStateToProps = () => ({
  // allMeetingTypes: meetingTypesBranch.selectors.allMeetingTypes,
  // loading: meetingTypesBranch.selectors.loading,
});

const mapDispatchToProps = (dispatch) => ({
  // getMeetingTypes: () =>
  //   dispatch(meetingTypesBranch.actions.getMeetingTypesSuccess()),
});

MeetingTypeCard.propTypes = {
  meetingType: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetingTypeCard);
