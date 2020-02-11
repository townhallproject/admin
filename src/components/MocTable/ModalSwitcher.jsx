import React from 'react';

import CampaignsModal from "./CampaignsModal";
import AddCampaignModal from "./AddCampaignModal";
import PersonDetailsModal from "./PersonDetailsModal";

export default (props) => {
    switch (props.type) {
        case 'viewCampaigns': 
            return (
                <CampaignsModal 
                    {...props}
                />
            )
        case 'addCampaign': 
            return (
                <AddCampaignModal 
                    {...props}
                />
            )
        case 'viewDetails':
            return (
                <PersonDetailsModal
                    {...props}
                />
            )
        default: 
            return null;
    }
}