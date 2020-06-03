import React from 'react';
import { connect } from 'react-redux';
import {
  Tabs,
  Radio,
} from 'antd';
import {
  map
} from 'lodash';


import mocStateBranch from '../../state/mocs';
import selectionStateBranch from '../../state/selections';
import userStateBranch from '../../state/users';

import MocTable from '../../components/MocTable';
import { STATES_LEGS } from '../../constants';
import AddPersonForm from '../../components/AddPersonForm';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

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
      changeSelectedState,
      requestStateLeg,
    } = this.props;
    changeSelectedState(target.value)
    requestStateLeg(target.value)
  }

  render() {
    const {
      addNewPerson,
      addOfficeToPerson,
      saveCampaignToPerson,
      currentlyEditingPerson,
      radioValue,
      the116theCongress,
      updateMissingMemberValue,
      updateInOfficeValue,
      updateDisplayNameValue,
      selectedStateLeg,
      updateCampaignStatus,
      clearCurrentlyEditingPerson,
    } = this.props;
    const { TabPane } = Tabs;
    return (
      <div>
        <Tabs defaultActiveKey="congress">
           <TabPane tab="Current Congress" key="congress">
            <MocTable 
              mocs={the116theCongress}
              saveCampaignToPerson={saveCampaignToPerson}
              updateMissingMemberValue={updateMissingMemberValue}
              updateInOfficeValue={updateInOfficeValue}
              updateDisplayNameValue={updateDisplayNameValue}
              updateCampaignStatus={updateCampaignStatus}
              currentKey={116}
            />
          </TabPane>
          <TabPane tab="Current State Legs" key="stateLegs">
                <RadioGroup
                        defaultValue={radioValue}
                        buttonStyle="solid"
                        onChange={this.onRadioChange}
                        className="federal-state-radio-group"
                        >
                        {map(STATES_LEGS, (value, key) => {
                            return (
                                <RadioButton key={value} value={value}>
                                  {value}
                                </RadioButton>
                            )
                        })
                        }
                    </RadioGroup>
                    <MocTable 
                      mocs={selectedStateLeg}
                      currentUsState={radioValue}
                      currentKey={radioValue}
                    />
          </TabPane>
          <TabPane tab="Add new person (not in database)" key="new-person">
              <AddPersonForm 
                addNewPerson={addNewPerson}
                saveCampaignToPerson={saveCampaignToPerson}
                addOfficeToPerson={addOfficeToPerson}
                currentlyEditingPerson={currentlyEditingPerson}
                clearCurrentlyEditingPerson={clearCurrentlyEditingPerson}
              />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allMocNamesIds: mocStateBranch.selectors.getAllMocsIds(state),
  selectedStateLeg: mocStateBranch.selectors.getSelectedStateLeg(state),
  isModerator: userStateBranch.selectors.getModeratorStatus(state),
  radioValue: mocStateBranch.selectors.getSelectedState(state),
  keySavePath: selectionStateBranch.selectors.getPeopleNameUrl(state),
  the116theCongress: mocStateBranch.selectors.get116thCongress(state),
  currentlyEditingPerson: mocStateBranch.selectors.getCurrentlyEditingPerson(state),
});

const mapDispatchToProps = dispatch => ({
    addNewPerson: (person) => dispatch(mocStateBranch.actions.addNewPerson(person)),
    getCongressBySession: (congressSession) => dispatch(mocStateBranch.actions.getCongressBySession(congressSession)),
    addOfficeToPerson: (person, office, key) => dispatch(mocStateBranch.actions.addOfficeToPerson(person, office, key)),
    requestStateLeg: (usState) => dispatch(mocStateBranch.actions.getStateLeg(usState)),
    requestMocIds: () => dispatch(mocStateBranch.actions.requestMocIds()),
    saveStateLeg: (person) => dispatch(mocStateBranch.actions.saveStateLeg(person)),
    saveCampaignToPerson: (person, campaign, key) => dispatch(mocStateBranch.actions.saveCampaignToPerson(person, campaign, key)),
    changeMode: (value) => dispatch(selectionStateBranch.actions.changeMode(value)),
    changeSelectedState: (value) => dispatch(mocStateBranch.actions.changeSelectedState(value)),
    updateMissingMemberValue: (id, key, missingMember) => dispatch(mocStateBranch.actions.updateMissingMember(id, key, missingMember)),
    updateInOfficeValue: (id, inOffice, chamber) => dispatch(mocStateBranch.actions.updateInOffice(id, inOffice, chamber)),
    updateDisplayNameValue: (id, displayName) => dispatch(mocStateBranch.actions.updateDisplayName(id, displayName)),
    updateCampaignStatus: (status, index, record) => dispatch(mocStateBranch.actions.updateCampaignStatus(status, index, record)),
    clearCurrentlyEditingPerson: () => dispatch(mocStateBranch.actions.clearCurrentlyEditingPerson())
});

export default connect(mapStateToProps, mapDispatchToProps)(MoCLookUpDashboard);
