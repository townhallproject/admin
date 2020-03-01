import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  Button,
  Badge,
  Divider,
  Icon,
  Input,
  Table,
  Row,
  Tooltip,
} from 'antd';

import researcherStateBranch from '../../state/researchers';
import mocStateBranch from '../../state/mocs';

import MocLookUp from '../../components/MocLookup'

import './style.scss';

class ResearcherTableTab extends React.Component {
  constructor(props) {
    super(props);
    this.getNames = this.getNames.bind(this);
    this.selectMoc = this.selectMoc.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.state = {
      filteredInfo: null,
      sortedInfo: null,
      editing: null,
    };
  }

  componentDidMount() {
      const { 
          getAllResearchers
      } = this.props;
      getAllResearchers();
  }

  handleChange (pagination, filters, sorter) {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  handleReset (clearFilters) {
    clearFilters();
    this.setState({
      searchText: ''
    });
  }

  renderMocName(moc, include, userId){
    let color = 
      moc.lastUpdated &&
      moment(moc.lastUpdated).isValid() && 
      moment(moc.lastUpdated).isSameOrAfter(moment().subtract(7, 'days')) ? 'geekblue' : 'red';
    return include && moc.name && (
        <Row
          type="flex"
          justify="space-between"
          align = "middle"
          key={`${moc.id || moc.thpId}-${userId}`}
        >
        <span>
            {moc.district ? <span>{moc.state}-{moc.district}</span> : <span>{moc.state}</span>}
            <Divider type="vertical" />
            <Badge 
              dot
              style={{ backgroundColor: color}} 
            >
              <span>{moc.name}</span>
            </Badge>
          </span>
          {moc.isAssigned ? 
          <Tooltip placement="topRight" title="Remove this moc from this researcher" arrowPointAtCenter>
            <Button
              icon="close" 
              shape="circle"
              onClick={() => 
                this.props.removeAssignmentFromUser(userId, moc.id)}
            /> 
          </Tooltip>

          : 
          <Tooltip placement="topRight" title="Assign this moc to this researcher" arrowPointAtCenter>
            <Button
              icon="plus" 
              shape="circle"
              onClick={() => this.props.assignToUser(userId, moc.id)}
            />
            </Tooltip>
        }

        </Row>
      )        
  }

  selectMoc(userId, mocId, name) {
    this.props.addAndAssignToUser(userId, mocId, name)
  }

  handleSearch (selectedKeys, confirm) {
    confirm();
    this.setState({
      searchText: selectedKeys[0]
    });
  }

  getNames(id) {
      const {
        requestMocIds,
      } = this.props;
      requestMocIds();
      this.setState({editing: id})
  }

  render() {
    let {
      editing,
    } = this.state;
    const {
        researchers,
        allMocNamesIds,
    } = this.props;
    const columns = [{
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
      defaultSortOrder: 'descend',
      sorter: (a, b) => {
        if (a.username > b.username) {
          return -1
        } else if (a.username < b.username) {
          return 1
        }
        return 0
      },
      sortDirections: ['descend', 'ascend'],
    }, {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => { this.searchInput = node; }}
          placeholder={`Search email`}
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
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
      filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => record.email && record.email.toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    }, {
      title: 'Assigned Mocs',
      dataIndex: 'mocs',
      key: 'assigned-mocs',
      sorter: (a, b) => {
        const aAssigned = a.mocs.filter(moc => moc.isAssigned)
        const bAssigned = b.mocs.filter(moc => moc.isAssigned)
        if (aAssigned.length > bAssigned.length) {
          return -1
        } else if (aAssigned.length < bAssigned.length) {
          return 1
        }
        return 0
      },
      sortDirections: ['descend', 'ascend'],
      filters: [{
            text: 'Only researchers with assignments',
            value: 'assigned',
          }],
      onFilter: (value, record) => record.mocs.reduce((acc, moc) => {
        if (moc.isAssigned && moc.name) {
          acc = true;
        }
        return acc;
      }, false),
      render: (mocs, record) => {
         return( <span>
            {mocs.map((moc) => this.renderMocName(moc, moc.isAssigned, record.id))}
             <span>
          {allMocNamesIds.length && editing === record.id ? 
          <MocLookUp
            allMocNames={allMocNamesIds}
            onSelect = {
              (mocId, object) => this.selectMoc(record.id, mocId, object.key)
            }
          />
          :
          <Button 
            icon="plus" 
            type="dashed"
            onClick={() => this.getNames(record.id)}
          >
              Add new
            </Button>
          }
        </span>
        </span>)}
    },
    {
      title: 'Unassigned Mocs',
      dataIndex: 'mocs',
      key: 'unassigned-mocs',
      sorter: (a, b) => {
          const aNotAssigned = a.mocs.filter(moc => !moc.isAssigned)
          const bNotAssigned = b.mocs.filter(moc => !moc.isAssigned)

          if (aNotAssigned.length > bNotAssigned.length) {
            return -1
          } else if (aNotAssigned.length < bNotAssigned.length) {
            return 1
          }
          return 0
        },
        sortDirections: ['descend', 'ascend'],
      render: (mocs, record) => (
          <span>
            {mocs.map((moc) => this.renderMocName(moc, !moc.isAssigned, record.id))}
        </span>)
    },
    ];
    return (
      <div>
        <div className="researcher-table">
        </div>
          <Table 
            columns={columns} 
            dataSource={researchers}
            rowKey={(record) => record.id}
            loading={!researchers.length}
          />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  researchers: researcherStateBranch.selectors.combineMocNamesWithResearchers(state),
  allMocNamesIds: mocStateBranch.selectors.getAllMocsIds(state),
});

const mapDispatchToProps = dispatch => ({
  getAllResearchers: () => dispatch(researcherStateBranch.actions.requestAllResearchers()),
  removeAssignmentFromUser: (userId, mocId) => dispatch(researcherStateBranch.actions.removeAssignment(userId, mocId)),
  addAndAssignToUser: (userId, mocId, name) => dispatch(researcherStateBranch.actions.addAndAssignToUser(userId, mocId, name)),
  assignToUser: (userId, mocId) => dispatch(researcherStateBranch.actions.assignMocToUser(userId, mocId)),
  requestMocIds: () => dispatch(mocStateBranch.actions.requestMocIds()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResearcherTableTab);
