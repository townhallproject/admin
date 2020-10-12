import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import meetingTypesBranch from "../../state/meeting-types";

class MeetingTypeCard extends Component {
  state = {
    editing: false,
  };

  componentDidMount() {
    this.props.getMeetingTypes();
  }

  render() {
    return <div>hello</div>;
  }
}

const mapStateToProps = () => ({
  // allMeetingTypes: meetingTypesBranch.selectors.allMeetingTypes,
  // loading: meetingTypesBranch.selectors.loading,
});

const mapDispatchToProps = (dispatch) => ({
  getMeetingTypes: () =>
    dispatch(meetingTypesBranch.actions.getMeetingTypesSuccess()),
});

MeetingTypeCard.propTypes = {
  meetingTypes: PropTypes.object.isRequired,
  // loading: PropTypes.bool.isRequired,
  // getMeetingType: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetingTypeCard);
