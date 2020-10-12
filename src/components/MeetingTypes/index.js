import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import MeetingTypeCard from "./MeetingTypeCard";

import { connect } from "react-redux";
import meetingTypesBranch from "../../state/meeting-types";

class MeetingTypesMarkup extends Component {
  componentDidMount() {
    this.props.requestMeetingTypes();
  }

  render() {
    return (
      <Fragment>
        <div>All Meeting Types</div>
      </Fragment>
    );
  }
}

const mapStateToProps = () => ({
  allMeetingTypes: meetingTypesBranch.selectors.allMeetingTypes,
  loading: meetingTypesBranch.selectors.loading,
});

const mapDispatchToProps = (dispatch) => ({
  requestMeetingTypes: () =>
    dispatch(meetingTypesBranch.actions.requestMeetingTypes()),
});

MeetingTypesMarkup.propTypes = {
  allMeetingTypes: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  requestMeetingTypes: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetingTypesMarkup);
