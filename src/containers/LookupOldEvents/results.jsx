import React from 'react';
import {
    Button,
    Select,
    Row,
    Col,
} from 'antd';
import {
    VictoryBar,
    VictoryChart,
} from 'victory';
import {
    CSVLink,
} from 'react-csv';


import "./style.scss";

const colors = {
    R: "#ff4741",
    D: "#3facef",
    I: 'purple',
    None: 'gray',
}

const Option = Select.Option;


class OldEventsResults extends React.Component {

    render() {
        const {
            archiveUrl,
            dataForChart,
            oldEventsForDownload,
            getMocReport,
            missingMemberReport116
        } = this.props;
        return (
           <Row type="flex">
               <Col span={12}>
                    <VictoryChart
                        domainPadding={{ x: 20 }}
                    >
                        <VictoryBar
                            horizontal
                            barWidth={40}

                            data={dataForChart}
                            x="party"
                            width={200}
                            height={200}
                            y="value"
                            style={{
                                data: {
                                    fill: (d) => colors[d.party],
                                }
                            }
                            }
                        />
                    </VictoryChart>
               </Col>
    
               <Col span={8}>
                    <Button
                        onClick={() => getMocReport('116')}
                    >
                        Get Moc Report (116th congress)
                    </Button>
                    <h4>Available Downloads</h4>
                    <Button
                        icon="download"
                        block
                    >
                        <CSVLink
                            data={
                                oldEventsForDownload
                            }
                            filename={`${archiveUrl}.csv`}
                        > DownloadEvents
                    </CSVLink>
                    </Button>
                    {missingMemberReport116.length > 0 && < React.Fragment >
                        <Button
                            icon="download"
                            block
                        >
                            <CSVLink
                                data={
                                    missingMemberReport116
                                }
                                filename="Missing_Member_116.csv"
                            > Download Missing Member Report
                            </CSVLink>
                        </Button>

                    </React.Fragment>}

               </Col>

            </Row>
        );
    }
}


export default OldEventsResults;
