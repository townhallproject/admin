import React from 'react';
import { Modal, Button } from 'antd';

import AddCampaignOrRoleForm from '../AddCampaignOrRoleForm';

export default class MocTable extends React.Component {
    render() {
        const { modalRecord, modalVisible, handleModalOk, handleModalCancel, saveCampaignToPerson } = this.props;
        return (
            <Modal
                title={modalRecord.displayName + ' | ' + modalRecord.title}
                visible={modalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={600}
                footer={[
                    <Button key="submit" type="primary" onClick={handleModalOk}>
                        OK
            </Button>,
                ]}
            >
                <AddCampaignOrRoleForm
                    usState={this.props.currentUsState}
                    currentKey={this.props.currentKey}
                    person={modalRecord}
                    saveRole={saveCampaignToPerson}
                    roleLabel={"Running For (prefix)"}
                    formTitle={`Add a campaign for ${modalRecord.displayName}`}
                    candidate={true}
                />
            </Modal>
        )
    }
}