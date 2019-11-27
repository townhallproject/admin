import React from 'react';
import { connect } from 'react-redux';

import { Tabs } from 'antd';

import mocStateBranch from '../../state/mocs';
import selectionStateBranch from '../../state/selections';
import userStateBranch from '../../state/users';

import AddPersonForm from '../../components/AddPersonForm';
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
      saveStateLeg,
      isModerator,
      saveCandidate,
      radioValue,
      keySavePath,
      the116theCongress,
      updateMissingMemberValue,
      updateInOfficeValue,
      updateDisplayNameValue,
    } = this.props;
    console.log(keySavePath)
    const { TabPane } = Tabs;
    return (
      <div>
        <Tabs defaultActiveKey={!isModerator ? "congress": "stateLegs"}>
          {!isModerator && <TabPane tab="Current Congress" key="congress">
            <MocTable 
              mocs={the116theCongress}
              updateMissingMemberValue={updateMissingMemberValue}
              updateInOfficeValue={updateInOfficeValue}
              updateDisplayNameValue={updateDisplayNameValue}

            />
          </TabPane>}
          <TabPane tab="Current State Legs" key="stateLegs">
            <FederalStateRadioSwitcher 
              onRadioChange={this.onRadioChange}
              defaultValue={radioValue}
            />
            <AddPersonForm 
              usState={radioValue !== 'federal' ? radioValue : ''}
              savePerson={saveCandidate}
              keySavePath={keySavePath}
              roleLabel={"Running For (prefix)"}
              formTitle="Add a candidate"
              candidate={true}
            />
          </TabPane>
          <TabPane tab="State Lawmakers" key="legislators">
              <AddPersonForm 
                usState={radioValue !== 'federal' ? radioValue : ''}
                savePerson={saveStateLeg}
                keySavePath={keySavePath}
                level="state"
                currentLawmaker={true}
                roleLabel={"Current role"}
                formTitle="Add a lawmaker currently in office"
              />
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
  keySavePath: selectionStateBranch.selectors.getPeopleNameUrl(state),
  the116theCongress: mocStateBranch.selectors.get116thCongress(state),
});

const mapDispatchToProps = dispatch => ({
    getCongressBySession: (congressSession) => dispatch(mocStateBranch.actions.getCongressBySession(congressSession)),
    requestMocIds: () => dispatch(mocStateBranch.actions.requestMocIds()),
    saveStateLeg: (person) => dispatch(mocStateBranch.actions.saveStateLeg(person)),
    saveCandidate: (person, path) => dispatch(mocStateBranch.actions.saveCandidate(path, person)),
    changeMode: (value) => dispatch(selectionStateBranch.actions.changeMode(value)),
    changeMocEndpoint: (value) => dispatch(selectionStateBranch.actions.changeFederalStateRadio(value)),
    updateMissingMemberValue: (id, missingMember) => dispatch(mocStateBranch.actions.updateMissingMember(id, missingMember)),
    updateInOfficeValue: (id, inOffice) => dispatch(mocStateBranch.actions.updateInOffice(id, inOffice)),
    updateDisplayNameValue: (id, displayName) => dispatch(mocStateBranch.actions.updateDisplayName(id, displayName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MoCLookUpDashboard);
