import React from 'react';
import { connect } from 'react-redux';
import {
    Table,
    Form,
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

    columns = [
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
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Date',
            render: (text, record) => {
                 let dateString = moment(record.timeStart).format('ddd, MMM D YYYY');
                 let timeString = moment(record.timeStart).format('h a')
                return `${dateString} ${timeString}`
            },
            key: 'timeStart',
        },
        {
            title: 'ADA',
            dataIndex: 'ada_accessible',
            key: 'ada_accessible',
            editable: true,
        },
        {
            title: 'Verified?',
            // this data doesn't exist yet
            // display as a checkbox in the future?
            dataIndex: 'verified',
            key: 'verified',
            editable: true,
        },
    ];


    handleSave = (eventId, editedData) => {
        console.log(editedData)
        this.props.updateOldEvent(editedData, eventId);
    };

    render() {
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const columns = this.columns.map(col => {
            if (this.props.includeLiveEventsInLookup || !col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
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
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={this.props.filteredOldEvents}
                columns={columns}
            />
        );
    };
};
    
function mapStateToProps(state) {
    return {
        filteredOldEvents: selectionStateBranch.selectors.getFilteredEvents(state),
        includeLiveEventsInLookup: selectionStateBranch.selectors.includeLiveEventsInLookup(state),
    };
}

const mapDispatchToProps = dispatch => ({
    updateOldEvent: (updateData, eventId) => dispatch(eventsStateBranch.actions.updateOldEvent(updateData, eventId)),
});
  

export default connect(mapStateToProps, mapDispatchToProps)(ResultsTable);
