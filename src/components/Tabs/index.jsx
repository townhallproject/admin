import React from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const TabComponent = ({ tabContents, onChange }) => {
    return (
    <Tabs 
        defaultActiveKey={tabContents[0].title} 
        onChange={onChange}>

     {tabContents.map(tab => (
         <TabPane tab={tab.title} key={tab.title}>
                {tab.contents}
        </TabPane>
     ))}
    </Tabs> )

}

export default TabComponent;