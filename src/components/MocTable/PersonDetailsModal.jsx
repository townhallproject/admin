import React from 'react';

import { Button, Modal } from 'antd';

export default (props) => {
    const { modalRecord, modalVisible, handleModalCancel, handleModalOk } = props;
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
            <h2>Personal Details</h2>
            <table>
                <tbody>
                    <tr>
                        <th>Party</th>
                        <td>{modalRecord.party}</td>
                    </tr>
                    <tr>
                        <th>State</th>
                        <td>{modalRecord.state}</td>
                    </tr>
                    <tr>
                        <th>Chamber</th>
                        <td>{modalRecord.chamber}</td>
                    </tr>
                    <tr>
                        <th>District</th>
                        <td>{modalRecord.district}</td>
                    </tr>
                    <tr>
                        <th>Next Election</th>
                        <td>{modalRecord.next_election}</td>
                    </tr>
                    <tr>
                        <th>Seniority</th>
                        <td>{modalRecord.seniority}</td>
                    </tr>
                    <tr>
                        <th>State Rank</th>
                        <td>{modalRecord.state_rank}</td>
                    </tr>
                    <tr>
                        <th>Date of Birth</th>
                        <td>{modalRecord.date_of_birth}</td>
                    </tr>
                    <tr>
                        <th>Gender</th>
                        <td>{modalRecord.gender}</td>
                    </tr>
                    <tr>
                        <th>In Office</th>
                        <td>{modalRecord.in_office ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                        <th>Missing Member</th>
                        <td>{modalRecord.missing_member ?
                            modalRecord.missing_member ? 'Yes' : 'No'
                            : ''}</td>
                    </tr>
                    <tr>
                        <th>Votes With Party</th>
                        <td>{modalRecord.votes_with_party_pct}%</td>
                    </tr>
                    <tr>
                        <th>Missed Votes</th>
                        <td>{modalRecord.missed_votes_pct}%</td>
                    </tr>
                    <tr>
                        <th>FEC Candidate ID</th>
                        <td>{modalRecord.fec_candidate_id}</td>
                    </tr>
                </tbody>
            </table>

            <h2>Contact Info</h2>
            <table>
                <tbody>
                    <tr>
                        <th>Phone</th>
                        <td>{modalRecord.phone}</td>
                    </tr>
                    <tr>
                        <th>Fax</th>
                        <td>{modalRecord.fax}</td>
                    </tr>
                    <tr>
                        <th>Office</th>
                        <td>{modalRecord.office}</td>
                    </tr>
                    <tr>
                        <th>Address</th>
                        <td>{modalRecord.address}</td>
                    </tr>
                </tbody>
            </table>

            <h2>Media</h2>
            <table>
                <tbody>
                    <tr>
                        <th>Website</th>
                        <td><a href={modalRecord.url}>{modalRecord.url}</a></td>
                    </tr>
                    <tr>
                        <th>RSS URL</th>
                        <td><a href={modalRecord.rss_url}>{modalRecord.rss_url}</a></td>
                    </tr>
                    <tr>
                        <th>Facebook Account</th>
                        <td>{modalRecord.facebook_account}</td>
                    </tr>
                    <tr>
                        <th>Twitter Account</th>
                        <td>{modalRecord.twitter_account}</td>
                    </tr>
                    <tr>
                        <th>YouTube Account</th>
                        <td>{modalRecord.youtube_account}</td>
                    </tr>
                </tbody>
            </table>
        </Modal>
    )
}