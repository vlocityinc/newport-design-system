export const platformEvent1ApiName = 'PlatformEvent1__e';
export const platformEvent1Label = 'Platform Event 1 Label';
export const platformEventInkLevelApiName = 'InkLevel__e';
export const platformEventInkLevelLabel = 'Ink Level';
export const platformEventStartApiName = 'StartEvent__e';
export const platformEventStartLabel = 'Start Event';

export const mockEventTypes = [
    {
        description: "platform event description",
        label: platformEvent1Label,
        qualifiedApiName: platformEvent1ApiName,
    },
    {
        description: "printer ink level check event",
        label: platformEventInkLevelLabel,
        qualifiedApiName: platformEventInkLevelApiName,
    },
    {
        description: "start event",
        label: platformEventStartLabel,
        qualifiedApiName: platformEventStartApiName,
    }
];

export const mockEventTypeParameters = {
    'PlatformEvent1__e' : {
        'input': [
            {
                dataType: "reference",
                isRequired: false,
                label: "Created By",
                qualifiedApiName: "CreatedById",
            },
            {
                dataType: "datetime",
                isRequired: false,
                label: "Created Date",
                qualifiedApiName: "CreatedDate",
            },
            {
                dataType: "id",
                isRequired: false,
                label: "ID",
                qualifiedApiName: "Id",
            },
            {
                dataType: "string",
                isRequired: false,
                label: "Replay ID",
                qualifiedApiName: "ReplayId",
            }
        ],
        'output': [
            {
                dataType: "sobject",
                isRequired: true,
                label: "PlatformEvent1",
                qualifiedApiName: platformEvent1ApiName
            }
        ]
    },
    'InkLevel__e': {
        'input': [
            {
                dataType: "number",
                isRequired: false,
                label: "Ink Level",
                qualifiedApiName: "InkLevel",
            },
            {
                dataType: "reference",
                isRequired: false,
                label: "Created By",
                qualifiedApiName: "CreatedById",
            },
            {
                dataType: "datetime",
                isRequired: false,
                label: "Created Date",
                qualifiedApiName: "CreatedDate",
            },
            {
                dataType: "id",
                isRequired: false,
                label: "ID",
                qualifiedApiName: "Id",
            },
            {
                dataType: "string",
                isRequired: false,
                label: "Replay ID",
                qualifiedApiName: "ReplayId",
            }
        ],
        'output': [
            {
                dataType: "sobject",
                isRequired: true,
                label: "Ink Level",
                qualifiedApiName: platformEventInkLevelApiName,
            }
        ]
    }
};

export const mockEventTypeAllParameters = {
    'PlatformEvent1__e': [
        {
            dataType: "reference",
            isRequired: false,
            label: "Created By",
            qualifiedApiName: "CreatedById",
            isSubscription: true,
            isPublication: false,
        },
        {
            dataType: "datetime",
            isRequired: false,
            label: "Created Date",
            qualifiedApiName: "CreatedDate",
            isSubscription: true,
            isPublication: false,
        },
        {
            dataType: "id",
            isRequired: false,
            label: "ID",
            qualifiedApiName: "Id",
            isSubscription: true,
            isPublication: false,
        },
        {
            dataType: "string",
            isRequired: false,
            label: "Replay ID",
            qualifiedApiName: "ReplayId",
            isSubscription: true,
            isPublication: false,
        },
        {
            dataType: "sobject",
            isRequired: true,
            label: "PlatformEvent1",
            qualifiedApiName: platformEvent1ApiName,
            isSubscription: false,
            isPublication: true,
        }
    ],
    'InkLevel__e' : [
        {
            dataType: "number",
            isRequired: false,
            label: "Ink Level",
            qualifiedApiName: "InkLevel",
            isSubscription: true,
            isPublication: false,
        },
        {
            dataType: "reference",
            isRequired: false,
            label: "Created By",
            qualifiedApiName: "CreatedById",
            isSubscription: true,
            isPublication: false,
        },
        {
            dataType: "datetime",
            isRequired: false,
            label: "Created Date",
            qualifiedApiName: "CreatedDate",
            isSubscription: true,
            isPublication: false,
        },
        {
            dataType: "id",
            isRequired: false,
            label: "ID",
            qualifiedApiName: "Id",
            isSubscription: true,
            isPublication: false,
        },
        {
            dataType: "string",
            isRequired: false,
            label: "Replay ID",
            qualifiedApiName: "ReplayId",
            isSubscription: true,
            isPublication: false,
        },
        {
            dataType: "sobject",
            isRequired: true,
            label: "Ink Level",
            qualifiedApiName: platformEventInkLevelApiName,
            isSubscription: false,
            isPublication: true,
        }
    ]
};