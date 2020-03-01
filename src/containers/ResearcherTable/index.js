import React from 'react';
import { Tabs } from 'antd';
import ResearcherTableTab from './ResearcherTableTab'
import AddResearcher from './AddResearcher'
import './style.scss';



class Researchers extends React.Component {
  
  render () {
    return (
      <Tabs defaultActiveKey="researcherTable">
        <Tabs.TabPane tab="Researchers" key="researcherTable">
          <ResearcherTableTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Add Researcher" key="addResearcher">
          <AddResearcher />
        </Tabs.TabPane>
      </Tabs>
    )
  }
}

export default Researchers
