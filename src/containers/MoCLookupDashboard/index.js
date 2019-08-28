import React from 'react';
import { connect } from 'react-redux';

import { Tabs } from 'antd';

import mocStateBranch from '../../state/mocs';
import selectionStateBranch from '../../state/selections';
import userStateBranch from '../../state/users';

import AddPersonForm from '../../components/AddPersonForm';
import MocLookUp from '../../components/MocLookup';
import FederalStateRadioSwitcher from '../../components/FederalStateRadioSwitcher';
import MocTable from '../../components/MocTable';

class MoCLookUpDashboard extends React.Component {
  constructor(props) {
    super(props)
    this.onRadioChange = this.onRadioChange.bind(this);
  }

  componentDidMount() {
    const {
      requestMocIds,
      changeMode,
      getCongressBySession,
    } = this.props;
    requestMocIds();
    getCongressBySession('116');
    changeMode('candidate')
  }

  onRadioChange({ target }) {
    const {
      changeMocEndpoint
    } = this.props;
    changeMocEndpoint(target.value)
  }

  render() {
    const {
      allMocNamesIds,
      isModerator,
      saveCandidate,
      radioValue,
      candidateKeySavePath,
      the116theCongress,
      updateMissingMemberValue,
      updateInOfficeValue,
      updateDisplayNameValue,
    } = this.props;
    const { TabPane } = Tabs;
    return (
      <div>
        <Tabs defaultActiveKey={!isModerator ? "congress": "candidates"}>
          {!isModerator && <TabPane tab="Current Congress" key="congress">
            <MocTable 
              mocs={the116theCongress}
              updateMissingMemberValue={updateMissingMemberValue}
              updateInOfficeValue={updateInOfficeValue}
              updateDisplayNameValue={updateDisplayNameValue}
            />
          </TabPane>}
          <TabPane tab="Candidates" key="candidates">
            <FederalStateRadioSwitcher 
              onRadioChange={this.onRadioChange}
              defaultValue={radioValue}
            />
            <AddPersonForm 
              usState={radioValue !== 'federal' ? radioValue : ''}
              saveCandidate={saveCandidate}
              candidateKeySavePath={candidateKeySavePath}
            />
          </TabPane>
          <TabPane tab="Current State Legislators" key="legislators">
            
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allMocNamesIds: mocStateBranch.selectors.getAllMocsIds(state),
    isModerator: userStateBranch.selectors.getModeratorStatus(state),
  radioValue: selectionStateBranch.selectors.getActiveFederalOrState(state),
  candidateKeySavePath: selectionStateBranch.selectors.getPeopleNameUrl(state),
  the116theCongress: mocStateBranch.selectors.get116thCongress(state),
});

const mapDispatchToProps = dispatch => ({
    getCongressBySession: (congressSession) => dispatch(mocStateBranch.actions.getCongressBySession(congressSession)),
    requestMocIds: () => dispatch(mocStateBranch.actions.requestMocIds()),
    saveCandidate: (path, person) => dispatch(mocStateBranch.actions.saveCandidate(path, person)),
    changeMode: (value) => dispatch(selectionStateBranch.actions.changeMode(value)),
    changeMocEndpoint: (value) => dispatch(selectionStateBranch.actions.changeFederalStateRadio(value)),
    updateMissingMemberValue: (id, missingMember) => dispatch(mocStateBranch.actions.updateMissingMember(id, missingMember)),
    updateInOfficeValue: (id, inOffice) => dispatch(mocStateBranch.actions.updateInOffice(id, inOffice)),
    updateDisplayNameValue: (id, displayName) => dispatch(mocStateBranch.actions.updateDisplayName(id, displayName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MoCLookUpDashboard);
