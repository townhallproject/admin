import {
  Modal,
  Button
} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

import EditAddressOrDateModal from '../EditAddressOrDateModal';

import './style.scss';

class EditAddressOrDateButton extends React.Component {
  constructor(props) {
    super(props);
    this.showModal = this.showModal.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.checkData = this.checkData.bind(this);
    this.state = {
      loading: false,
      visible: false,
    };
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }

  handleClose(e) {
    this.setState({
      visible: false,
    });
  }

  handleCloseOnSubmit(e) {
    this.setState({
      loading: false,
      visible: false,
    });
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
      visible: false,
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
      address,
      updateEvent,
      townHall,
      setTempAddress,
      tempAddress,
      clearTempAddress,
    } = this.props;

    return (
      <div>
        <Button 
          className="edit-btn" 
          onClick={this.showModal} 
          icon="edit"
        >
          Edit Address or Date
        </Button>
        <Modal
          title="Edit Address or Date"
          visible={this.state.visible}
          onOk={this.checkData}
          onCancel={this.handleClose}
          closable
        >
          <EditAddressOrDateModal
            loading={this.state.loading}
            currentTownHall={townHall}
            address={address}
            updateEvent={updateEvent}
            setTempAddress={setTempAddress}
            tempAddress={tempAddress}
            clearTempAddress={clearTempAddress}
          />
        </Modal>
      </div>
    );
  }
}

export default EditAddressOrDateButton;
