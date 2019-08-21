import React from 'react';
import { Table, Divider, Tag } from 'antd';


const columns = [
    {
        title: 'Number',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
    },
    {
        title: 'AssignedTo',
        dataIndex: 'assignedTo',
        key: 'assignedTo',
    },
    {
        title: 'Contacted',
        dataIndex: 'contacted',
        key: 'contacted',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
];

const PotentialVolTable = ({ potentialVols }) => (<Table dataSource={potentialVols} columns={columns} />);
export default PotentialVolTable;