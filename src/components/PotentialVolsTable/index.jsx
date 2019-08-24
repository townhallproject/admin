import React from 'react';
import { Table, Checkbox, Form } from 'antd';

import EditableCell from '../EditableCell';


export const EditableContext = React.createContext();


const PotentialVolTable = ({ potentialVols, updatePotentialVols }) => { 
    const EditableRow = ({ form, index, ...props }) => {
        return (
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        );
    }
    const EditableFormRow = Form.create()(EditableRow);
    const components = {
        body: {
            row: EditableFormRow,
            cell: EditableCell,
        },
    };
    const onChange = (key, {target}, record) => {
        updatePotentialVols({
            phoneNumber: record.phoneNumber,
            data: { [key]: target.checked}
        })
    }
    const handleSave = (phoneNumber, values) => {
        updatePotentialVols({
            phoneNumber,
            data: values
        })    
    }
    const columnData = [
        {
            title: 'Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Responded on',
            dataIndex: 'respondedOn',
            key: 'respondedOn',
        },
        {
            title: 'District',
            dataIndex: 'stateDistrict',
            key: 'stateDistrict',
        },
        {
            title: 'Assigned To',
            dataIndex: 'assignedTo',
            editable: true,
            key: 'assignedTo',
        },
        {
            title: 'Human contacted',
            dataIndex: 'contacted',
            key: 'contacted',
            render: (contacted, record) => {
                return (<Checkbox checked={contacted} onChange={(value) => onChange('contacted', value, record)} />)
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            editable: true,
            key: 'status',
        },
    ];
    const columns = columnData.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: record => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
            }),
        };
    });
    return (<Table 
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={potentialVols} columns={columns} />)
};
export default PotentialVolTable;