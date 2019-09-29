import React from 'react';
import {
  map,
  reduce
} from 'lodash';
import {
  Radio, 
  Row,
  Badge,
} from 'antd';

import { FEDERAL_STATE_RADIO_BUTTONS } from '../../constants';
import './style.scss';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class FederalStateRadioSwitcher extends React.Component {
    
    render () {
        const {
            defaultValue,
            eventsCounts
        } = this.props;
        return (
            <React.Fragment>
                <Row
                    type="flex"
                    justify="center"
                >
                    <RadioGroup 
                        defaultValue={defaultValue}
                        buttonStyle="solid"
                        onChange={this.props.onRadioChange}
                        className="federal-state-radio-group"
                        >
                        {map(eventsCounts, (value, key) => {
                            return (
                                <RadioButton key={key} value={key}>
                                    <Badge key={key} count={value}>
                                        {key}
                                    </Badge>
                                </RadioButton>
                            )
                        })
                        }
                    </RadioGroup>
                </Row>
            </React.Fragment>
        )
    }
}

FederalStateRadioSwitcher.defaultProps = {
    eventsCounts: reduce(FEDERAL_STATE_RADIO_BUTTONS, (acc, cur) => {
        acc[cur] = 0;
        return acc;
    }, {}),
}

export default FederalStateRadioSwitcher;
