import React from 'react';
import { Tabs } from 'antd';
import { connect } from 'react-redux'
import ResearcherTableTab from '../../components/ResearcherTableTab'
import AddResearcher from '../../components/AddResearcher'

import researcherStateBranch from '../../state/researchers';
import mocStateBranch from '../../state/mocs';

class Researchers extends React.Component {
  
  render () {
    return (
      <Tabs defaultActiveKey="researcherTable">
        <Tabs.TabPane tab="Researchers" key="researcherTable">
          <ResearcherTableTab
            getAllResearchers={this.props.getAllResearchers}
            removeAssignmentFromUser={this.props.removeAssignmentFromUser}
            addAndAssignToUser={this.props.addAndAssignToUser}
            assignToUser={this.props.assignToUser}
            requestMocIds={this.props.requestMocIds}
            researchers={this.props.researchers}
            allMocNamesIds={this.props.allMocNamesIds}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Add Researcher" key="addResearcher">
          <AddResearcher
            saveUnregisteredVol={this.props.saveUnregisteredVol}
          />
        </Tabs.TabPane>
      </Tabs>
    )
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
  saveUnregisteredVol: (payload) => dispatch(researcherStateBranch.actions.saveUnregisteredVol(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Researchers)
