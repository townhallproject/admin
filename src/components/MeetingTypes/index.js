import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import { Row, Col, Spin, Typography } from "antd";
import "./style.scss";

import MeetingTypeCard from "./MeetingTypeCard";

import { connect } from "react-redux";
import meetingTypesBranch from "../../state/meeting-types";

class MeetingTypesMarkup extends Component {
  componentDidMount() {
    this.props.requestMeetingTypes();
  }

  render() {
    const { Title } = Typography;

    const cardMarkup = this.props.loading ? (
      <Spin size="large" className="loader" />
    ) : this.props.allMeetingTypes.length > 0 ? (
      this.props.allMeetingTypes.map((meetingType) => (
        <Col xs={24} md={8} key={meetingType.id}>
          <MeetingTypeCard meetingType={meetingType} />
        </Col>
      ))
    ) : (
      ""
    );

    return (
      <Fragment>
        {this.props.loading || <Title level={2}>All Meeting Types</Title>}

        <Row gutter={[16, 16]} type="flex">
          {cardMarkup}
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  allMeetingTypes: state.meetingTypes.allMeetingTypes,
  loading: state.meetingTypes.loading,
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
