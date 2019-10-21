import React from 'react';
import { connect } from 'react-redux';
import {
  Table,
  Form,
  Checkbox,
} from 'antd';

import moment from 'moment';

import EditableCell from './editableCell';
import eventsStateBranch from '../../state/events';
import selectionStateBranch from '../../state/selections';

import activism from '../../assets/img/icon-flags/activism.svg';
import campaign from '../../assets/img/icon-flags/campaign.svg';
import hrOne from '../../assets/img/icon-flags/hr-one.svg';
import inPerson from '../../assets/img/icon-flags/in-person.svg';
import mfol from '../../assets/img/icon-flags/mfol.svg';
import nextGen from '../../assets/img/icon-flags/next-gen.svg';
import phoneIn from '../../assets/img/icon-flags/phone-in.svg';
import staff from '../../assets/img/icon-flags/staff.svg';

export const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => {
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  );
}

const EditableFormRow = Form.create()(EditableRow);

const iconFlagMap = {
  activism: activism,
  campaign: campaign,
  'hr-one': hrOne,
  'in-person': inPerson,
  mfol: mfol,
  'next-gen': nextGen,
  'tele': phoneIn,
  staff: staff,
};

class ResultsTable extends React.Component {

  constructor(props) {
      super(props);
      this.handleSave = this.handleSave.bind(this);
  }

  handleSave = (editedData, eventId) => {
      console.log(editedData)
      this.props.updateOldEvent(editedData, eventId);
  };

  render() {
    const { showErrors } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    let columns = [
      {
        title: 'Name',
        dataIndex: 'displayName',
        key: 'displayName',
        editable: true,
      }, 
      {
        title: 'Meeting Type',
        dataIndex: 'meetingType',
        key: 'meetingType',
        editable: true,
      },
      {
        title: 'Icon',
        render: (text, record) => <img
            src={iconFlagMap[record.iconFlag]}
            alt={record.iconFlag}
            width={30} 
        />,
        key: 'iconFlag',
        dataIndex: 'iconFlag',
        editable: true,
      },
      {
        title: 'Level',
        dataIndex: 'level',
        key: 'level',
        editable: true,
      },
      {
        title: 'State',
        render: (text, record) => {
            // record.state is required
            if (record.district) {
                return `${record.state}-${record.district === 'At-Large' ? '00' : record.district}`;
            }
            return record.state;
        },
        key: 'state',
        dataIndex: 'state',
        editable: true,
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        editable: true,
      },
      {
        title: 'Date',
        render: (text, record) => {
            return moment.parseZone(record.timeStart).format('ddd, MMM D YYYY h:mm a');
        },
        dataIndex: 'timeStart',
        key: 'timeStart',
        editable: true,
      },
      {
        title: 'ADA?',
        dataIndex: 'ada_accessible',
        key: 'ada_accessible',
        editable: false,
        render: (text, record) => (<Checkbox
            key={record.ada_accessible}
            onChange={(e) => this.handleSave({ ada_accessible : !record.ada_accessible }, record.eventId)}
            defaultChecked={record.ada_accessible}
            disabled={!record.editable}>
        </Checkbox>)
      },
      {
        title: 'Researcher verified',
        dataIndex: 'validated',
        key: 'validated',
        editable: false,
        render: (text, record) => (<Checkbox
            key={record.validated}
            onChange={(e) => this.handleSave({ validated : !record.validated }, record.eventId)}
            defaultChecked={record.validated}
            disabled={!record.editable}>
        </Checkbox>)
      },
    ];
    if (showErrors) {
      columns.unshift({
        title: 'Error',
        dataIndex: 'errorMessage',
        key: 'errorMessage',
        editable: false,
      })
    }
    columns = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable && record.editable,
          className: `${record.editable}-editable-cell`,
          inputType: col.key,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <Table
        components={components}
        className="archived-events-table"
        rowClassName={(record) => `${record.editable}-editable-row`}
        bordered
        dataSource={this.props.filteredOldEvents}
        columns={columns}
        rowKey={(record) => `${record.eventId}-editable-${record.editable}`}
        // expandedRowRender={(record) => record.eventId}
      />
    );
  };
};
    
function mapStateToProps(state) {
  return {
    filteredOldEvents: selectionStateBranch.selectors.getFilteredEvents(state),
  };
}

const mapDispatchToProps = dispatch => ({
  updateOldEvent: (updateData, eventId) => dispatch(eventsStateBranch.actions.updateOldEvent(updateData, eventId)),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(ResultsTable);