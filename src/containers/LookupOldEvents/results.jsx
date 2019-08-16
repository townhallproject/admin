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
    VictoryStack,
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
            missingMemberReport116,
            missingMemberCongressData
        } = this.props;
        return (
            <div>
            <Row
                style={{
                    marginTop: 50,
                }}
            >
                <Button
                    onClick={() => getMocReport('116')}
                >
                    Get Moc Report (116th congress)
                </Button>
                <Button
                    icon="download"
                    style={{ paddingLeft: 10 }}
                >
                    <CSVLink
                        data={
                            oldEventsForDownload
                        }
                        filename={`${archiveUrl}.csv`}
                    >
                        DownloadEvents
                    </CSVLink>
                </Button>
                {missingMemberReport116.length > 0 && < React.Fragment>
                    <Button
                        icon="download"
                    >
                        <CSVLink
                            data={
                                missingMemberReport116
                            }
                            filename="Congress_116.csv"
                        > Download Congress Report
                        </CSVLink>
                    </Button>
                </React.Fragment>}
            </Row>
            {/* <Row
                type="flex"
                style={{
                    borderTopColor: 'lightgray',
                    borderTopStyle: 'solid',
                    borderTopWidth: 2,
                    marginTop: 50,
                }}
            >
               <Col span={16}>
                    <VictoryChart
                        domainPadding={{ x: 20 }}
                    >
                        <VictoryBar
                            horizontal
                            barWidth={40}
                            data={dataForChart}
                            height={300}
                            width={300}
                            x="party"
                            y="value"
                            style={{
                                data: {
                                    fill: (d) => colors[d.party],
                                }
                            }}
                        />
                    </VictoryChart>
                    {missingMemberCongressData.length > 0 && 
                        <VictoryStack
                            labels={["senate", "house"]}
                            colorScale={["lightblue", "blue", "pink", "red", "gray", "purple"]}
                            height={300}
                            width={300}
                            animate={{
                                duration: 2000,
                                onLoad: { duration: 1000 }
                            }}
                        >
                            {missingMemberCongressData.map((data, index)=> {
                                return (
                                <VictoryBar
                                    horizontal
                                    data={data}
                                    key={index}
                                />)
                            })}
                        </VictoryStack>
                    }
               </Col>
            </Row> */}

            </div>
        );
    }
}


export default OldEventsResults;
