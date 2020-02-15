import React from 'react';
import './style.scss';
import {
    Table,
    Checkbox,
    Input,
    Button,
    Icon,
} from 'antd';
import debounce from 'lodash/debounce';
import ModalSwitcher from './ModalSwitcher';

export default class MocTable extends React.Component {
  constructor(props) {
    super(props);
    this.changeCampaignStatus = this.changeCampaignStatus.bind(this);
  }

  state = {
    searchText: '',
    modalVisible: false,
    modalRecord: {},
  }

  updateMissingMember({target}, record) {
    const { updateMissingMemberValue, currentKey } = this.props;
    // not a congressional number
    if (!Number(currentKey)) {
      return;
    }
    updateMissingMemberValue(record, currentKey, target.checked);
  }

  updateInOffice({target}, id, chamber) {
    const { updateInOfficeValue } = this.props;
    updateInOfficeValue(id, target.checked, chamber);
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

  viewRecord(record) {
    this.setState({ 
      modalVisible: true,
      modalRecord: record,
      type: 'viewDetails'
    });
  };

  viewCampaigns(record) {
    this.setState({
      modalVisible: true,
      modalRecord: record,
      type: 'viewCampaigns'
    })
  }

  addCampaign(record) {
    this.setState({
      modalVisible: true,
      modalRecord: record,
      type: 'addCampaign'
    });
  };

  handleModalCancel = () => {
    this.setState({ modalVisible: false });
  }

  handleModalOk = () => {
    this.handleModalCancel();
  }

  changeCampaignStatus(value, index, record) {
    const { updateCampaignStatus } = this.props;
    updateCampaignStatus(value, index, record)
  }
  
  render() {
    const { mocs, saveCampaignToPerson } = this.props;
    const columns = [
      {
        title: 'Display Name',
        key: 'displayName',
        render: (mocs, record) => (
          <Input 
            defaultValue={record.displayName}
            onChange={(e) => this.updateDisplayName(e, record.id)}
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
              key={record.id}
              onChange={(e) => this.updateInOffice(e, record.id, record.chamber)} 
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
              key={record.id}
              onChange={(e) => this.updateMissingMember(e, record)} 
              defaultChecked={record.missing_member}>
                  Missing
            </Checkbox>
          </span>
        ),
      },
      {
        title: 'Actions',
        dataIndex: '',
        key: 'actions',
        render: (mocs, record) => {
          const buttons = [<Button
            onClick={() => this.viewRecord(record)}
            size="small"
          >Details
            </Button>,
            <Button
              onClick={() => this.addCampaign(record)}
              size="small"
            >Add campaign
            </Button>]
            if (record.campaigns) {
              buttons.push(
                <Button
                  onClick={() => this.viewCampaigns(record)}
                  size="small"
                >View campaign(s)
            </Button>
              )
            }
            return buttons
        }
      }
    ];
    return (
      <div>
        <Table 
          columns={columns}
          dataSource={mocs}
          rowKey='id'
        />
        <ModalSwitcher 
          type={this.state.type}
          modalRecord={this.state.modalRecord}
          modalVisible={this.state.modalVisible}
          handleModalCancel={this.handleModalCancel}
          handleModalOk={this.handleModalOk}
          changeCampaignStatus={this.changeCampaignStatus}
          saveCampaignToPerson={saveCampaignToPerson}
          currentUsState={this.props.currentUsState}
          currentKey={this.props.currentKey}
        />
      </div>
    )
  }
}
