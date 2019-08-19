import React from 'react';
import {
  connect
} from 'react-redux';
import { map } from 'lodash';
import {
    Button,
    Switch,
    DatePicker,
    Select,
    Row,
    Progress,
    Col,
} from 'antd';

import moment from 'moment';
import selectionStateBranch from '../../state/selections';
import eventStateBranch from '../../state/events';
import mocStateBranch from '../../state/mocs';
import { getDateArray } from '../../utils';
import { statesAb } from '../../assets/data/states';

import "./style.scss";

import OldEventsResults from './results';

const {
  RangePicker,
} = DatePicker;
const Option = Select.Option;

const children = map(statesAb, (value, key) => (<Option key={key}>{value}</Option>));

class LookupOldEvents extends React.Component {

    constructor(props) {
        super(props);
        this.onDateRangeChange = this.onDateRangeChange.bind(this);
        this.handleRequestOldEvents = this.handleRequestOldEvents.bind(this);
        this.handleAddState = this.handleAddState.bind(this);
        this.onIncludeLiveEvents = this.onIncludeLiveEvents.bind(this);
    }

    onDateRangeChange(date, dateString) {
        const {
            changeDataLookupRange
        } = this.props;
        changeDataLookupRange(dateString);
    }

    onIncludeLiveEvents(checked) {
        const {
            requestLiveEvents,
            liveEventUrl,
            toggleIncludeLiveEventsInLookup
        } = this.props;
        if (checked) {
            requestLiveEvents(liveEventUrl)
        }
        toggleIncludeLiveEventsInLookup(checked)
    }

    handleAddState(value) {
        const {
          handleChangeStateFilters
        } = this.props;
        handleChangeStateFilters(value)
    }

    handleRequestOldEvents(){
        const {
            requestOldEvents,
            archiveUrl,
            dateLookupRange,
        } = this.props;
        const dateStart = moment(dateLookupRange[0]).startOf('day').valueOf();
        const dateEnd = moment(dateLookupRange[1]).endOf('day').valueOf();

        const dateArray = getDateArray(dateLookupRange);
        dateArray.forEach(date => {
            requestOldEvents(archiveUrl, date, [dateStart, dateEnd])
        })
    }

    render() {
        const {
            filteredOldEvents,
            archiveUrl,
            loading,
            dataForChart,
            includeLiveEventsInLookup,
            oldEventsForDownload,
            emailCoverage,
            getMocReport,
            missingMemberReport116,
            missingMemberCongressData
        } = this.props;
        return (    
            <React.Fragment>
            <Row className="lookup-form">
                <Col span={12} offset={6}>
                    <Row
                        type="flex" 
                    >
                        <RangePicker 
                            onChange={this.onDateRangeChange} 
                            format = "MMM D, YYYY"
                        />
                    </Row>
                    <Row
                        type="flex" 
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select a state to filter"
                            onChange={this.handleAddState}
                            style={{ width: '100%' }}
                        >
                            {children}
                        </Select>
                    </Row>
                    <Row
                        type="flex" 
                    >
                        <Col>
                        <   label>Include live events</label>
                        </Col>
                        <Col>
                            <Switch 
                                onChange={this.onIncludeLiveEvents} 
                                checked={includeLiveEventsInLookup}

                            />
                        </Col>
                    </Row>
                    <Row
                        type="flex" 
                    >
                        <Button
                            onClick={this.handleRequestOldEvents}
                            loading={loading}
                            type="primary"
                            block
                        >Request events</Button>     
                    </Row>
                    <Row
                        type="flex"
                    >   <Col>
                            <span>Download complete</span>
                        </Col>
                        <Col span={12}>
                            <Progress percent={emailCoverage} />
                        </Col>

                    </Row>
                </Col>
        
            </Row>
            {filteredOldEvents.length > 0 &&
                <OldEventsResults
                    archiveUrl={archiveUrl}
                    dataForChart={dataForChart}
                    oldEventsForDownload={oldEventsForDownload}
                    getMocReport={getMocReport}
                    missingMemberReport116={missingMemberReport116}
                    missingMemberCongressData={missingMemberCongressData}
                />
            }
        </React.Fragment>)
    }
}

const mapStateToProps = state => ({
    archiveUrl: selectionStateBranch.selectors.getArchiveUrl(state),
    liveEventUrl: selectionStateBranch.selectors.getLiveEventUrl(state),
    filteredOldEvents: selectionStateBranch.selectors.getFilteredArchivedEvents(state),
    dateLookupRange: selectionStateBranch.selectors.getDateRange(state),
    loading: eventStateBranch.selectors.getLoading(state),
    dataForChart: selectionStateBranch.selectors.getDataForArchiveChart(state),
    includeLiveEventsInLookup: selectionStateBranch.selectors.includeLiveEventsInLookup(state),
    oldEventsForDownload: selectionStateBranch.selectors.getEventsAsDownloadObjects(state),
    emailCoverage: eventStateBranch.selectors.getEmailCoverage(state),
    missingMemberReport116: selectionStateBranch.selectors.get116MissingMemberReport(state),
    missingMemberCongressData: selectionStateBranch.selectors.getCongressReport(state),
});

const mapDispatchToProps = dispatch => ({
    requestOldEvents: (path, date, dates) => dispatch(eventStateBranch.actions.requestOldEvents(path, date, dates)),
    changeDataLookupRange: (dates) => dispatch(selectionStateBranch.actions.changeDateLookup(dates)),
    handleChangeStateFilters: (states) => dispatch(selectionStateBranch.actions.changeStateFilters(states)),
    requestLiveEvents: (path) => dispatch(eventStateBranch.actions.requestEvents(path)),
    toggleIncludeLiveEventsInLookup: (checked) => dispatch(selectionStateBranch.actions.toggleIncludeLiveEventsInLookup(checked)),
    getMocReport: (congressId) => dispatch(mocStateBranch.actions.getCongressBySession(congressId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LookupOldEvents);
