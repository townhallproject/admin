import React from 'react';
import { connect } from 'react-redux';
import { Input, Form, Select, Modal } from 'antd';
import ArchiveEditForm from './forms';
import selectionStateBranch from '../../state/selections';

class ArchiveEventsEditModal extends React.Component {
  constructor(props) {
    super(props);
    this.checkData = this.checkData.bind(this);
    this.state = {
      loading: false,
    }
  }

  checkData() {
    const {
      tempAddress,
      setTimeZone,
      townHall,
      pathForEvents,
    } = this.props;
    if (tempAddress.address) {
      console.log('still have address')
      return;
    }
    this.setState({
      loading: false,
    });
    setTimeZone({
      date: townHall.dateString,
      time: townHall.Time,
      lat: townHall.lat,
      lng: townHall.lng,
      eventId: townHall.eventId,
      pathForEvents: pathForEvents,
    })
  }

  render() {
    const {
      visible,
      handleClose,
      townHall,
      tempAddress,
      setTempAddress,
      clearTempAddress,
      updateEvent,
    } = this.props;
    return (
      <Modal
        title="Edit Address or Date"
        visible={visible}
        onOk={this.checkData}
        onCancel={handleClose}
        closable
      >
        <ArchiveEditForm
          townHall={townHall}
          tempAddress={tempAddress}
          setTempAddress={setTempAddress}
          clearTempAddress={clearTempAddress}
          updateEvent={updateEvent}
        />
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  pathForEvents: selectionStateBranch.selectors.getEventsToShowUrl(state),
  tempAddress: selectionStateBranch.selectors.getTempAddress(state),
});

const mapDispatchToProps = dispatch => ({
  setTempAddress: (address) => dispatch(selectionStateBranch.actions.setTempAddress(address)),
  clearTempAddress: () => dispatch(selectionStateBranch.actions.clearTempAddress()),
  setTimeZone: (payload) => dispatch(selectionStateBranch.actions.getTimeZone(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveEventsEditModal);