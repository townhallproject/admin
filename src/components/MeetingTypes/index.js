import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import meetingTypesBranch from "../../state/meeting-types";

class MeetingTypesMarkup extends Component {
  componentDidMount() {
    this.props.getMeetingTypes();
  }

  render() {
    return <div>hello</div>;
  }
}

const mapStateToProps = (state) => ({
  allMeetingTypes: meetingTypesBranch.selectors.allMeetingTypes,
  loading: meetingTypesBranch.selectors.loading,
});

const mapDispatchToProps = (dispatch) => ({
  getMeetingTypes: () =>
    dispatch(meetingTypesBranch.actions.getMeetingTypesSuccess()),
});

MeetingTypesMarkup.propTypes = {
  // allMeetingTypes: PropTypes.array.isRequired,
  // loading: PropTypes.bool.isRequired,
  getMeetingTypes: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetingTypesMarkup);
