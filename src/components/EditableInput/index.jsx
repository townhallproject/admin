import { Typography } from 'antd';
import React from 'react';

const { Paragraph } = Typography;


class EditableText extends React.Component {
    constructor(props) {
        super(props);
        this.onEdit = this.onEdit.bind(this)

    }
    onEdit(str) {
        const { fieldKey, updateEvent} = this.props;
        console.log('Content change:', str);
        console.log({ [fieldKey]: str})
        updateEvent({ [fieldKey]: str})
    };

    render () {
        const { content, label } = this.props;
        return (
            <React.Fragment>
            <label>
                {label}:
            </label>
            <Paragraph 
                editable={{ onChange: this.onEdit }}>
                {content}
            </Paragraph>
            </React.Fragment>
        )
    }
}

export default EditableText