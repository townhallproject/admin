import React from 'react';
import {
    Button,
    Row,
} from 'antd';
import {
    CSVLink,
} from 'react-csv';


import "./style.scss";

// const colors = {
//     R: "#ff4741",
//     D: "#3facef",
//     I: 'purple',
//     None: 'gray',
// }

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

            </div>
        );
    }
}


export default OldEventsResults;
