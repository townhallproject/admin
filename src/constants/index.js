export const LIVE_EVENTS_TAB = 'live';
export const PENDING_EVENTS_TAB = 'pending';
export const ARCHIVED_EVENTS_TAB = 'archive';
export const FEDERAL_LEGISTLATURE = 'federal';
export const LEVEL_STATE = 'state';
export const LEVEL_FEDERAL = 'federal';
export const FEDERAL_RADIO_BUTTON = 'federal';
export const STATES_LEGS = ['AZ', 'CO', 'NC', 'OR', 'VA', 'NV', 'MI', 'ME', 'MD', 'PA', 'FL'];
export const FEDERAL_STATE_RADIO_BUTTONS = [FEDERAL_LEGISTLATURE, ...STATES_LEGS];
export const LEGISLATIVE_BODIES = [FEDERAL_LEGISTLATURE, ...STATES_LEGS];
export const EVENT_MENU_ITEM = 'events';
export const MOC_MENU_ITEM = 'mocs';
export const RESEARCHER_MENU_ITEM = 'researcher';
export const RESOURCES_MENU_ITEM = 'resources'
export const eventTabOptions = [LIVE_EVENTS_TAB, PENDING_EVENTS_TAB, ARCHIVED_EVENTS_TAB];
export const navMenuItems = [EVENT_MENU_ITEM, MOC_MENU_ITEM, RESEARCHER_MENU_ITEM, RESOURCES_MENU_ITEM];
export const RSVP_DOWNLOAD_ACCESS = 'rsvpDownloads';
export const EVENT_DOWNLOAD_ACCESS = 'eventDownloads';
export const MOC_DOWNLOAD_ACCESS = 'mocDownload';
export const ADMIN_ACCESS = 'isAdmin';
export const MODERATOR_ACCESS = 'moderator';
export const ACCESS_KEYS = [RSVP_DOWNLOAD_ACCESS, EVENT_DOWNLOAD_ACCESS, MOC_DOWNLOAD_ACCESS, ADMIN_ACCESS];
export const DATE_OBJ = "dateObj";
export const DATE_CREATED = "dateCreated";
export const DATE_TIMESTAMP = "timestamp";

export const ACCESS_LEVELS_MAP = {
    [RSVP_DOWNLOAD_ACCESS]: 'download RSVPs',
    [EVENT_DOWNLOAD_ACCESS]: 'download Events',
    [MOC_DOWNLOAD_ACCESS]: 'download MoC data',
    [ADMIN_ACCESS]: 'ACCESS EVERYTHING!',
};
export const MEETING_TYPE_OPTIONS = [
    'Town Hall',
    'Gun Safety Activist Event',
    'H.R. 1 Town Hall',
    'H.R. 1 Activist Event',
    'Tele-Town Hall',
    'Ticketed Event',
    'Campaign Town Hall',
    'Adopt-A-District/State',
    'Empty Chair Town Hall',
    'Hearing',
    'DC Event',
    'Office Hours',
    'Other',
];
export const ICON_FLAGS = [
    {
        text: 'In Person',
        data: 'in-person',
    },
    {
        text: 'Activist Event',
        data: 'activism',
    },
    {
        text: 'Tele Town Hall',
        data: 'tele',
    },
    {
        text: 'Campaign Town Hall',
        data: 'campaign',
    },
    {
        text: 'Staff',
        data: 'staff',
    },
    {
        text: 'HR 1 Event',
        data: 'hr-one',
    },
    {
        text: 'Youth Vote Town Hall',
        data: 'next-gen',
    },
    {
        text: 'March For Our Lives',
        data: 'mfol',
    },
]