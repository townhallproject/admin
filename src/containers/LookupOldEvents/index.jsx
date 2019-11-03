import React from 'react';
import {
  connect
} from 'react-redux';
import { map } from 'lodash';
import {
    Button,
    Col,
    Switch,
    DatePicker,
    Select,
    Row,
    Progress,
    Statistic,
    AutoComplete,
} from 'antd';

import moment from 'moment';
import selectionStateBranch from '../../state/selections';
import eventStateBranch from '../../state/events';
import mocStateBranch from '../../state/mocs';
import { statesAb } from '../../assets/data/states';

import "./style.scss";

import OldEventsResults from './results';
import ResultsTable from './achivedResultsTable';
import { LEGISLATIVE_BODIES } from '../../constants';

const {
  RangePicker,
} = DatePicker;
const Option = Select.Option;

const children = map(statesAb, (value, key) => (<Option key={key}>{value}</Option>));

class LookupOldEvents extends React.Component {

    constructor(props) {
        super(props);
        this.onDateRangeChange = this.onDateRangeChange.bind(this);
        this.handleAddState = this.handleAddState.bind(this);
        this.onIncludeLiveEvents = this.onIncludeLiveEvents.bind(this);
    }

    onDateRangeChange(date, dateRange) {
        const {
            changeDataLookupRange,
            requestOldEvents,
            resetOldEvents,
            archiveUrl,
            chamber,
        } = this.props;
        const dateStart = moment(dateRange[0]).startOf('day').valueOf();
        const dateEnd = moment(dateRange[1]).endOf('day').valueOf();
        resetOldEvents();
        changeDataLookupRange([dateStart, dateEnd]);
        requestOldEvents({
            chamber,
            path: archiveUrl,
            dates: [dateStart, dateEnd],
        });
    }

    onIncludeLiveEvents(checked) {
        const {
            requestLiveEvents,
            toggleIncludeLiveEventsInLookup
        } = this.props;
        if (checked) {
            requestLiveEvents();
        }
        toggleIncludeLiveEventsInLookup(checked);
    }

    handleAddState(value) {
        const {
          handleChangeStateFilters
        } = this.props;
        handleChangeStateFilters(value)
    }

    handleChamberChange = (value) => {
        this.props.changeChamberFilter(value === 'all' ? null : value);
    }

    handleEventTypeChange = (value) => {
        this.props.changeEventFilter(value);
    }

    handleLegislativeBodyChange = (value) => {
        this.props.changeLegislativeBodyFilter(value);
    }

    handleNameFilterChange = (name) => {
        const { changeNameFilter } = this.props;
        changeNameFilter(name);
    }

    handleNameFilterClear = (name) => {
        const { changeNameFilter } = this.props;
        if (name === '' || typeof name === 'undefined') {
            changeNameFilter(false);
        }
    }

    render() {
        const {
            filteredOldEvents,
            filteredUniqueNames,
            archiveUrl,
            dataForChart,
            includeLiveEventsInLookup,
            oldEventsForDownload,
            getMocReport,
            missingMemberReport116,
            missingMemberCongressData,
            totalReturnedEventsLength,
            filteredEventsLength,
            stateEventsCount
        } = this.props;
        return (    
            <React.Fragment>
            <Row className="lookup-form" style={{
                marginBottom: 50,
            }}>
                <Col span={12} offset={6}>
                    <Row type="flex">Search archived events by date range:</Row>
                    <Row type="flex">
                        <RangePicker 
                            onChange={this.onDateRangeChange} 
                            format = "MMM D, YYYY"
                        />
                    </Row>
                    <Row type="flex">
                        <Col>
                            <label>Include live events</label>
                        </Col>
                        <Col offset={1}>
                            <Switch 
                                onChange={this.onIncludeLiveEvents} 
                                checked={includeLiveEventsInLookup}
                            />
                        </Col>
                    </Row>
                    {totalReturnedEventsLength > 0 && (
                    <React.Fragment>
                        <Row type="flex" justify="space-between">
                            <Col>
                                <Statistic title="Total returned events:" value={totalReturnedEventsLength} />
                            </Col>
                            <Col>
                                <Statistic title="Return state events:" value={stateEventsCount} />
                            </Col>
                            <Col>
                                <Statistic title="Currently viewing:" value={filteredEventsLength} />
                            </Col>
                        </Row>
                        <Row>
                            {/* <Progress 
                                percent={(totalReturnedEventsLength - stateEventsCount)/totalReturnedEventsLength * 100} 
                                showInfo={false}
                            /> */}
                        </Row>
                        <Row type="flex">Filter your results:</Row>
                        <Row type="flex" justify="space-between">
                            <Select
                                defaultValue="federal"
                                style={{ width: '48%' }}
                                onChange={this.handleLegislativeBodyChange}
                            >
                                {LEGISLATIVE_BODIES.map((legBody) => 
                                    <Option key={legBody} value={legBody}>{`${legBody} legislative body`}</Option>
                                )}
                            </Select>
                            <Select
                                defaultValue="all"
                                onChange={this.handleChamberChange}
                                style={{ width: '48%' }}
                            >
                                <Option value="all">All chambers</Option>
                                <Option value="upper">Upper</Option>
                                <Option value="lower">Lower</Option>
                                <Option value="statewide">Statewide</Option>
                                <Option value="nationwide">Nationwide</Option>
                                <Option value="citywide">Citywide</Option>
                            </Select>
                        </Row>
                        <Row type="flex">
                            <Select
                                placeholder="Filter by event type"
                                defaultValue={[]}
                                onChange={this.handleEventTypeChange}
                                style={{ width: '100%' }}
                                mode="multiple"
                            >
                                <Option value='No events'>No Events</Option>
                                <Option value='Town Hall'>Town Hall</Option>
                                <Option value='Tele-Town Hall'>Tele-Town Hall</Option>
                                <Option value='Empty Chair Town Hall'>Empty Chair Town Hall</Option>
                                <Option value='Campaign Town Hall'>Campaign Town Hall</Option>
                                <Option value='Other'>Other</Option>
                                <Option value='Ticketed Event'>Ticketed Event</Option>
                                <Option value='Adopt-A-District/State'>Adopt-A-District/State</Option>
                                <Option value='DC Event'>DC Event</Option>
                                <Option value='Office Hours'>Office Hours</Option>
                                <Option value='Hearing'>Hearing</Option>
                                <Option value='H.R. 1 Activist Event'>H.R. 1 Activist Event</Option>
                                <Option value='H.R. 1 Town Hall'>H.R. 1 Town Hall</Option>
                                <Option value='Gun Safety Activist Event'>Gun Safety Activist Event</Option>
                            </Select>
                        </Row>
                        <Row
                            type="flex" 
                        >
                            <Select
                                mode="multiple"
                                placeholder="Filter by state"
                                onChange={this.handleAddState}
                                style={{ width: '100%' }}
                                disabled={this.props.legislativeBody !== 'federal'}
                            >
                                {children}
                            </Select>
                        </Row>
                        <Row type="flex">
                            <AutoComplete
                                placeholder="Filter by name"
                                dataSource={filteredUniqueNames}
                                onSelect={this.handleNameFilterChange}
                                allowClear={true}
                                onChange={this.handleNameFilterClear}
                                filterOption={(inputValue, option) => {
                                    return option.props.children.toUpperCase().includes(inputValue.toUpperCase());
                                }}
                            />
                        </Row>
                    </React.Fragment>)
                    }
                    {/* <Row
                        type="flex"
                    >   <Col>
                            <span>Download complete</span>
                        </Col>
                        <Col span={12}>
                            <Progress percent={emailCoverage} />
                        </Col>
                    </Row> */}
                </Col>
            </Row>
            <Row
                style={{
                    borderTopColor: 'lightgray',
                    borderTopStyle: 'solid',
                    BorderTopWidth: 2,
                }}
            >
            {filteredOldEvents.length > 0 &&
                <div>
                    <ResultsTable />
                    <OldEventsResults
                        archiveUrl={archiveUrl}
                        dataForChart={dataForChart}
                        oldEventsForDownload={oldEventsForDownload}
                        getMocReport={getMocReport}
                        missingMemberReport116={missingMemberReport116}
                        missingMemberCongressData={missingMemberCongressData}
                    />
                </div>
            }
            </Row>
        </React.Fragment>)
    }
}

const mapStateToProps = state => ({
    archiveUrl: selectionStateBranch.selectors.getArchiveUrl(state),
    liveEventUrl: selectionStateBranch.selectors.getLiveEventUrl(state),
    filteredOldEvents: selectionStateBranch.selectors.getFilteredEvents(state),
    filteredUniqueNames: selectionStateBranch.selectors.getFilteredUniqueNames(state),
    dateLookupRange: selectionStateBranch.selectors.getDateRange(state),
    totalReturnedEventsLength: selectionStateBranch.selectors.getTotalUnFilteredOldEventsCount(state),
    filteredEventsLength: selectionStateBranch.selectors.getFilteredOldEventsLength(state),
    loading: eventStateBranch.selectors.getLoading(state),
    stateEventsCount: selectionStateBranch.selectors.getReturnedStateEventsLength(state),
    dataForChart: selectionStateBranch.selectors.getDataForArchiveChart(state),
    includeLiveEventsInLookup: selectionStateBranch.selectors.includeLiveEventsInLookup(state),
    oldEventsForDownload: selectionStateBranch.selectors.getEventsAsDownloadObjects(state),
    emailCoverage: eventStateBranch.selectors.getEmailCoverage(state),
    missingMemberReport116: selectionStateBranch.selectors.get116MissingMemberReport(state),
    missingMemberCongressData: selectionStateBranch.selectors.getCongressReport(state),
    chamber: selectionStateBranch.selectors.getChamber(state),
    events: selectionStateBranch.selectors.getEventTypes(state),
    legislativeBody: selectionStateBranch.selectors.getLegislativeBody(state),
});

const mapDispatchToProps = dispatch => ({
    requestOldEvents: ({ path, date, dates, chamber } ) => dispatch(eventStateBranch.actions.requestOldEvents({ path, date, dates, chamber })),
    resetOldEvents: () => dispatch(eventStateBranch.actions.resetOldEvents()),
    changeDataLookupRange: (dates) => dispatch(selectionStateBranch.actions.changeDateLookup(dates)),
    changeChamberFilter: (chamber) => dispatch(selectionStateBranch.actions.changeChamberFilter(chamber)),
    changeEventFilter: (events) => dispatch(selectionStateBranch.actions.changeEventFilter(events)),
    changeLegislativeBodyFilter: (legislativeBody) => dispatch(selectionStateBranch.actions.changeLegislativeBodyFilter(legislativeBody)),
    handleChangeStateFilters: (states) => dispatch(selectionStateBranch.actions.changeStateFilters(states)),
    changeNameFilter: (name) => dispatch(selectionStateBranch.actions.changeNameFilter(name)),
    requestLiveEvents: () => dispatch(eventStateBranch.actions.requestAllLiveEventsForAnalysis()),
    toggleIncludeLiveEventsInLookup: (checked) => dispatch(selectionStateBranch.actions.toggleIncludeLiveEventsInLookup(checked)),
    getMocReport: (congressId) => dispatch(mocStateBranch.actions.getCongressBySession(congressId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LookupOldEvents);
