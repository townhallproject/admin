import React from 'react';
import './style.scss';
import {
    Table,
    Checkbox,
    Input,
    Button,
    Icon,
    Modal,
} from 'antd';
import debounce from 'lodash/debounce';

export default class MocTable extends React.Component {

  state = {
    searchText: '',
    modalVisible: false,
    modalRecord: {},
  }

  updateMissingMember({target}, id) {
    const { updateMissingMemberValue } = this.props;
    updateMissingMemberValue(id, target.checked);
  }

  updateInOffice({target}, id) {
    const { updateInOfficeValue } = this.props;
    updateInOfficeValue(id, target.checked);
  }

  updateDisplayName({target}, id) {
    this.debounceDisplayName(target.value, id);
  }

  debounceDisplayName = debounce((value, id) => {
    const { updateDisplayNameValue } = this.props;
    updateDisplayNameValue(id, value);
  }, 2000)

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >Search
        </Button>
        <Button 
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  viewRecord = (record) => {
    this.setState({ 
      modalVisible: true,
      modalRecord: record,
    });
  };

  handleModalCancel = () => {
    this.setState({ modalVisible: false });
  }

  handleModalOk = () => {
    this.handleModalCancel();
  }
  
  render() {
    const { mocs } = this.props;
    const columns = [
      {
        title: 'Display Name',
        key: 'displayName',
        render: (mocs, record) => (
          <Input 
            defaultValue={record.displayName}
            onChange={(e) => this.updateDisplayName(e, record.govtrack_id)}
          />
        ),
        ...this.getColumnSearchProps('displayName'),
      },
      {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
        ...this.getColumnSearchProps('state'),
      },
      {
        title: 'Chamber',
        dataIndex: 'chamber',
        key: 'chamber',
        filters: [{ text: 'Senate', value: 'upper' }, { text: 'House', value: 'lower' }],
        onFilter: (value, record) => record.chamber === value,
      },
      {
        title: 'District',
        dataIndex: 'district',
        key: 'district',
      },
      {
        title: 'In Office',
        key: 'in_office',
        render: (mocs, record) => (
          <span>
            <Checkbox 
              key={record.govtrack_id}
              onChange={(e) => this.updateInOffice(e, record.govtrack_id)} 
              defaultChecked={record.in_office}>
                In Office
            </Checkbox>
          </span>
        ),
      },
      {
        title: 'Missing member',
        key: 'missing_member',
        render: (mocs, record) => (
          <span>
            <Checkbox 
              key={record.govtrack_id}
              onChange={(e) => this.updateMissingMember(e, record.govtrack_id)} 
              defaultChecked={record.missing_member && record.missing_member[116]}>
                  Missing
            </Checkbox>
          </span>
        ),
      },
      {
        title: 'Actions',
        dataIndex: '',
        key: 'actions',
        render: (mocs, record) => (
          <span>
            <Button 
              onClick={() => this.viewRecord(record)}
              size="small"
            >Details
            </Button>
          </span>
        ),
      }
    ];
    return (
      <div>
        <Table 
          columns={columns}
          dataSource={mocs}
          rowKey={'govtrack_id'}
        />
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
          <h2>Personal Details</h2>
          <table>
            <tbody>
            <tr>
              <th>Party</th>
              <td>{this.state.modalRecord.party}</td>
            </tr>
            <tr>
              <th>State</th>
              <td>{this.state.modalRecord.state}</td>
            </tr>
            <tr>
              <th>Chamber</th>
              <td>{this.state.modalRecord.chamber}</td>
            </tr>
            <tr>
              <th>District</th>
              <td>{this.state.modalRecord.district}</td>
            </tr>
            <tr>
              <th>Next Election</th>
              <td>{this.state.modalRecord.next_election}</td>
            </tr>
            <tr>
              <th>Seniority</th>
              <td>{this.state.modalRecord.seniority}</td>
            </tr>
            <tr>
              <th>State Rank</th>
              <td>{this.state.modalRecord.state_rank}</td>
            </tr>
            <tr>
              <th>Date of Birth</th>
              <td>{this.state.modalRecord.date_of_birth}</td>
            </tr>
            <tr>
              <th>Gender</th>
              <td>{this.state.modalRecord.gender}</td>
            </tr>
            <tr>
              <th>In Office</th>
              <td>{this.state.modalRecord.in_office ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <th>Missing Member</th>
              <td>{this.state.modalRecord.missing_member ? 
                this.state.modalRecord.missing_member[116] ? 'Yes' : 'No' 
                  : ''}</td>
            </tr>
            <tr>
              <th>Votes With Party</th>
              <td>{this.state.modalRecord.votes_with_party_pct}%</td>
            </tr>
            <tr>
              <th>Missed Votes</th>
              <td>{this.state.modalRecord.missed_votes_pct}%</td>
            </tr>
            <tr>
              <th>FEC Candidate ID</th>
              <td>{this.state.modalRecord.fec_candidate_id}</td>
            </tr>
            </tbody>
          </table>

          <h2>Contact Info</h2>
          <table>
            <tbody>
            <tr>
              <th>Phone</th>
              <td>{this.state.modalRecord.phone}</td>
            </tr>
            <tr>
              <th>Fax</th>
              <td>{this.state.modalRecord.fax}</td>
            </tr>
            <tr>
              <th>Office</th>
              <td>{this.state.modalRecord.office}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{this.state.modalRecord.address}</td>
            </tr>
            </tbody>
          </table>

          <h2>Media</h2>
          <table>
            <tbody>
            <tr>
              <th>Website</th>
              <td><a href={this.state.modalRecord.url}>{this.state.modalRecord.url}</a></td>
            </tr>
            <tr>
              <th>RSS URL</th>
              <td><a href={this.state.modalRecord.rss_url}>{this.state.modalRecord.rss_url}</a></td>
            </tr>
            <tr>
              <th>Facebook Account</th>
              <td>{this.state.modalRecord.facebook_account}</td>
            </tr>
            <tr>
              <th>Twitter Account</th>
              <td>{this.state.modalRecord.twitter_account}</td>
            </tr>
            <tr>
              <th>YouTube Account</th>
              <td>{this.state.modalRecord.youtube_account}</td>
            </tr>
            </tbody>
          </table>
        </Modal>
      </div>
    )
  }
}
