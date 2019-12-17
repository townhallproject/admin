import React from 'react';
import { Modal, Button } from 'antd';

import AddPersonForm from '../AddPersonForm';

export default class MocTable extends React.Component {
    render() {
        return (
            <Modal
                title={this.state.modalRecord.displayName + ' | ' + this.state.modalRecord.title}
                visible={this.state.modalVisible}
                onOk={this.handleModalOk}
                onCancel={this.handleModalCancel}
                width={600}
                footer={[
                    <Button key="submit" type="primary" onClick={this.handleModalOk}>
                        OK
            </Button>,
                ]}
            >
                <AddPersonForm
                    usState={radioValue !== 'federal' ? radioValue : ''}
                    savePerson={saveCandidate}
                    keySavePath={keySavePath}
                    roleLabel={"Running For (prefix)"}
                    formTitle="Add a candidate"
                    candidate={true}
                />
            </Modal>
        )
    }
}