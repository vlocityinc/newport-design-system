// @ts-nocheck
import { ICON_SHAPE } from 'builder_platform_interaction/alcComponentsUtils';
import { NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { configureMenu, GOTO_DELETE_ACTION, GOTO_REROUTE_ACTION, PASTE_ACTION } from '../alcConnectorMenuConfig';
import { LABELS } from '../alcConnectorMenuLabels';

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const mockSharedUtils = jest.requireActual('builder_platform_interaction_mocks/sharedUtils');
    return Object.assign({}, mockSharedUtils, {
        storeUtils: {
            generateGuid: jest.fn(() => 1)
        }
    });
});

const elementsMetadata = [
    {
        section: 'Interaction',
        type: 'default',
        icon: 'standard:screen',
        label: 'Screen',
        value: 'Screen',
        elementType: 'Screen',
        description: 'Collect information from'
    },
    {
        section: 'Interaction',
        type: 'default',
        icon: 'standard:custom_notification',
        label: 'Action',
        value: 'ActionCall',
        elementType: 'ActionCall',
        description:
            'Perform an action outside of the flow. Choose from your org’s custom create and update actions or an out-of-the-box action, like Post to Chatter or Submit for Approval.'
    },
    {
        section: 'Logic',
        type: 'branch',
        icon: 'standard:decision',
        iconShape: ICON_SHAPE.DIAMOND,
        label: 'Decision',
        value: 'Decision',
        elementType: 'Decision',
        description: 'Create Decision',

        actionType: 'testActionType',
        actionName: 'testActionName'
    },
    {
        section: 'Logic',
        type: 'end',
        icon: 'utility:stop',
        iconBackgroundColor: 'background-red',
        iconShape: ICON_SHAPE.CIRCLE,
        label: 'End',
        value: 'End',
        elementType: 'End',
        description: 'Create End'
    }
];

const metadata = {
    elementTypes: new Set(
        elementsMetadata.map(({ elementType }) => elementType).filter((elementType) => elementType !== 'ActionCall')
    ),
    isLoading: false,
    menuItems: [
        {
            guid: 'random_guid',
            description: 'Test Action with Static Resource',
            label: 'Action with Static Resource Icon',
            elementType: ELEMENT_TYPE.ACTION_CALL,
            actionType: 'apex',
            actionName: 'CustomSVGIconAction',
            actionIsStandard: false,
            icon: null,
            iconSrc: '/resource/1653591244000/customsvg#top',
            iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
            iconClass: undefined,
            iconSize: 'small',
            iconVariant: '',
            rowClass: 'slds-listbox__item',
            elementSubtype: null,
            tooltip: 'Action with Static Resource Icon: Test Action with Static Resource',
            flowName: ''
        },
        {
            guid: 'random_guid',
            description: '',
            label: 'Action with Slds Icon',
            elementType: ELEMENT_TYPE.ACTION_CALL,
            actionType: 'apex',
            actionName: 'ActionWithSldsIcon',
            actionIsStandard: false,
            icon: 'standard:feed',
            iconSrc: null,
            iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
            iconClass: undefined,
            iconSize: 'small',
            iconVariant: '',
            rowClass: 'slds-listbox__item',
            elementSubtype: null,
            tooltip: 'Action with Slds Icon: Test Action with Slds Icon',
            flowName: ''
        },
        {
            guid: 'random_guid',
            description: 'Post to the feed for a specific record, user, or Chatter group.',
            label: 'Post to Chatter',
            elementType: ELEMENT_TYPE.ACTION_CALL,
            actionType: 'chatterPost',
            actionName: 'chatterPost',
            actionIsStandard: true,
            icon: 'standard:custom_notification',
            iconSrc: undefined,
            iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
            iconClass: 'background-navy',
            iconSize: 'small',
            iconVariant: '',
            rowClass: 'slds-listbox__item',
            elementSubtype: null,
            tooltip: 'Post to Chatter: Post to the feed for a specific record, user, or Chatter group.',
            flowName: ''
        },
        {
            guid: 'random_guid',
            description: 'Flow to display the records',
            label: 'Display Records Flow',
            elementType: ELEMENT_TYPE.SUBFLOW,
            actionType: '',
            actionName: '',
            actionIsStandard: false,
            icon: 'standard:flow',
            iconSrc: undefined,
            iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
            iconClass: 'background-navy',
            iconSize: 'small',
            iconVariant: '',
            rowClass: 'slds-listbox__item',
            elementSubtype: null,
            tooltip: 'Display the records in the flow.',
            flowName: 'DisplayRecords_Flow'
        },
        {
            guid: 'random_guid',
            description: '',
            label: 'Hello World flow',
            elementType: ELEMENT_TYPE.SUBFLOW,
            actionType: '',
            actionName: '',
            actionIsStandard: false,
            icon: 'standard:flow',
            iconSrc: undefined,
            iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
            iconClass: 'background-navy',
            iconSize: 'small',
            iconVariant: '',
            rowClass: 'slds-listbox__item',
            elementSubtype: null,
            tooltip: 'Display the records in the flow.',
            flowName: 'NoDescription_Flow'
        }
    ]
};

describe('connector menu config', () => {
    it('Match Snapshot with both paste and goto option', () => {
        expect(configureMenu('', metadata, elementsMetadata, false, 1, true, false)).toMatchSnapshot();
    });

    it('actionSection should have the right label', () => {
        expect(configureMenu('', metadata, elementsMetadata, false, 1, false, false).sections[0].label).toBe(
            LABELS.actionSectionLabel
        );
    });

    it('pasteItem should not be present when there are no available elements to paste', () => {
        expect(
            configureMenu('', metadata, elementsMetadata, false, 0, false, false).sections[0].items[0].elementType
        ).not.toBe(PASTE_ACTION);
    });

    it('pasteItem should have the right label when there is only 1 available element to paste', () => {
        expect(configureMenu('', metadata, elementsMetadata, false, 1, false, false).sections[0].items[0].label).toBe(
            LABELS.pasteOneItemLabel
        );
    });

    it('pasteItem should have the right label when there is more than 1 available element to paste', () => {
        expect(
            configureMenu('', metadata, elementsMetadata, false, 2, false, false).sections[0].items[0].label
        ).toEqual('AlcConnectorContextualMenu.pasteMultiItemLabel(2)');
    });

    it('pasteSection item should have the right icon', () => {
        expect(configureMenu('', metadata, elementsMetadata, false, 1, false, false).sections[0].items[0].icon).toBe(
            'utility:paste'
        );
    });

    it('pasteSection item should have the right rowClass', () => {
        expect(
            configureMenu('', metadata, elementsMetadata, false, 1, false, false).sections[0].items[0].rowClass
        ).toBe('slds-listbox__item action-row-line-height');
    });

    it('goToPath should have the right label', () => {
        expect(configureMenu('', metadata, elementsMetadata, false, 1, true, false).sections[0].items[0].label).toBe(
            `${LABELS.goToPathItemLabel}`
        );
    });

    it('goToPath item should have the right icon', () => {
        expect(configureMenu('', metadata, elementsMetadata, false, 1, true, false).sections[0].items[0].icon).toBe(
            'utility:level_down'
        );
    });

    it('goToPath item should have the right rowClass', () => {
        expect(configureMenu('', metadata, elementsMetadata, false, 1, true, false).sections[0].items[0].rowClass).toBe(
            'slds-listbox__item action-row-line-height'
        );
    });

    it('reRoute/delete should be displayed and GoTo should not with no pasteItem', () => {
        const menu = configureMenu('', metadata, elementsMetadata, false, 0, false, true);
        expect(menu.sections[0].items[0].label).toBe(LABELS.reRouteGoToPathItemLabel);
        expect(menu.sections[0].items[1].label).toBe(LABELS.deleteGoToPathItemLabel);
        expect(menu.sections[0].items[2]).toBe(undefined);
    });

    it('reRoute/delete should be displayed and GoTo should not with the right paste one item label', () => {
        const menu = configureMenu('', metadata, elementsMetadata, false, 1, false, true);
        expect(menu.sections[0].items[0].label).toBe(LABELS.reRouteGoToPathItemLabel);
        expect(menu.sections[0].items[1].label).toBe(LABELS.deleteGoToPathItemLabel);
        expect(menu.sections[0].items[2].label).toBe(LABELS.pasteOneItemLabel);
    });

    it('reRoute/delete should be displayed and GoTo should not with the right paste multi item label', () => {
        const menu = configureMenu('', metadata, elementsMetadata, false, 2, false, true);
        expect(menu.sections[0].items[0].label).toBe(LABELS.reRouteGoToPathItemLabel);
        expect(menu.sections[0].items[1].label).toBe(LABELS.deleteGoToPathItemLabel);
        expect(menu.sections[0].items[2].label).toBe('AlcConnectorContextualMenu.pasteMultiItemLabel(2)');
    });

    it('reRoutePath item should have the right icon', () => {
        expect(configureMenu('', metadata, elementsMetadata, false, 1, false, true).sections[0].items[0].icon).toBe(
            'utility:level_down'
        );
    });

    it('reRoutePath item should have the right rowClass', () => {
        expect(configureMenu('', metadata, elementsMetadata, false, 1, false, true).sections[0].items[0].rowClass).toBe(
            'slds-listbox__item action-row-line-height'
        );
    });

    it('deletePath item should have the right icon', () => {
        expect(configureMenu('', metadata, elementsMetadata, false, 1, false, true).sections[0].items[1].icon).toBe(
            'utility:delete'
        );
    });

    it('deletePath item should have the right rowClass', () => {
        expect(configureMenu('', metadata, elementsMetadata, false, 1, false, true).sections[0].items[1].rowClass).toBe(
            'slds-listbox__item action-row-line-height'
        );
    });

    it('search results should be correct based on search input', () => {
        const searchResultsMenu = configureMenu('action', metadata, elementsMetadata, false, 1, false, true);
        expect(searchResultsMenu.sections[0].items.length).toBe(2);
        // Highlight matched results.
        metadata.menuItems[0].formattedLabel = '<mark>Action</mark> with Static Resource Icon';
        metadata.menuItems[1].formattedLabel = '<mark>Action</mark> with Slds Icon';
        metadata.menuItems[1].description = metadata.menuItems[1].actionType + '-' + metadata.menuItems[1].actionName;
        expect(searchResultsMenu.sections[0].items).toEqual(expect.arrayContaining([metadata.menuItems[0]]));
        expect(searchResultsMenu.sections[0].items).toEqual(expect.arrayContaining([metadata.menuItems[1]]));
        expect(searchResultsMenu.sections[0].items).toEqual(expect.not.arrayContaining([metadata.menuItems[2]]));
        delete metadata.menuItems[0].formattedLabel;
        delete metadata.menuItems[1].formattedLabel;
        metadata.menuItems[1].description = '';
    });

    it('search results should be highlight partial matches', () => {
        const searchResultsMenu = configureMenu('tion', metadata, elementsMetadata, false, 1, false, true);
        expect(searchResultsMenu.sections[0].items.length).toBe(2);
        // Highlight matched results.
        metadata.menuItems[0].formattedLabel = 'Ac<mark>tion</mark> with Static Resource Icon';
        metadata.menuItems[1].formattedLabel = 'Ac<mark>tion</mark> with Slds Icon';
        metadata.menuItems[1].description = metadata.menuItems[1].actionType + '-' + metadata.menuItems[1].actionName;
        expect(searchResultsMenu.sections[0].items).toEqual(expect.arrayContaining([metadata.menuItems[0]]));
        expect(searchResultsMenu.sections[0].items).toEqual(expect.arrayContaining([metadata.menuItems[1]]));
        expect(searchResultsMenu.sections[0].items).toEqual(expect.not.arrayContaining([metadata.menuItems[2]]));
        delete metadata.menuItems[0].formattedLabel;
        delete metadata.menuItems[1].formattedLabel;
        metadata.menuItems[1].description = '';
    });

    it('search results should not show paste elements and go to connectors', () => {
        const searchResultsMenu = configureMenu('action', metadata, elementsMetadata, false, 1, false, true);
        expect(
            searchResultsMenu.sections[0].items.find((item) => item.elementType === GOTO_DELETE_ACTION)
        ).not.toBeTruthy();
        expect(
            searchResultsMenu.sections[0].items.find((item) => item.elementType === GOTO_REROUTE_ACTION)
        ).not.toBeTruthy();
        expect(searchResultsMenu.sections[0].items.find((item) => item.elementType === PASTE_ACTION)).not.toBeTruthy();
    });

    it('search results should list the subflows based on search input', () => {
        const searchResultsMenu = configureMenu('flow', metadata, elementsMetadata, false, 1, false, true);
        metadata.menuItems[3].formattedLabel = 'Display Records <mark>Flow</mark>';
        metadata.menuItems[4].formattedLabel = 'Hello World <mark>flow</mark>';
        metadata.menuItems[4].description = metadata.menuItems[4].flowName;
        expect(searchResultsMenu.sections[0].items.length).toBe(2);
        expect(searchResultsMenu.sections[0].items).toEqual(expect.arrayContaining([metadata.menuItems[3]]));
        expect(searchResultsMenu.sections[0].items).toEqual(expect.arrayContaining([metadata.menuItems[4]]));
        expect(searchResultsMenu.sections[0].items).toEqual(expect.not.arrayContaining([metadata.menuItems[0]]));
        expect(searchResultsMenu.sections[0].items).toEqual(expect.not.arrayContaining([metadata.menuItems[1]]));
        expect(searchResultsMenu.sections[0].items).toEqual(expect.not.arrayContaining([metadata.menuItems[2]]));
        delete metadata.menuItems[3].formattedLabel;
        metadata.menuItems[4].description = '';
    });
});

describe('Section Heading', () => {
    it('is null when type is Orchestrator', () => {
        const metaDataWithOrchestrator = [
            {
                section: 'Logic',
                type: NodeType.ORCHESTRATED_STAGE,
                label: 'Stage',
                value: 'Orchestratedstage',
                elementType: 'Orchestratedstage'
            },
            {
                section: 'Logic',
                type: 'branch',
                label: 'Decision',
                value: 'Decision',
                elementType: 'Decision'
            }
        ];
        const menu = configureMenu('', metadata, metaDataWithOrchestrator, false, 1, false, true);
        expect(menu.sections.find((section) => section.label === 'Logic').heading).toBe(null);
    });

    it('is not null for other types', () => {
        const menu = configureMenu('', metadata, elementsMetadata, false, 1, false, true);
        expect(menu.sections.find((section) => section.label === 'Logic').heading).toBe('Logic');
    });

    it('is null when there is search input', () => {
        const menu = configureMenu('S', metadata, elementsMetadata, false, 1, false, true);
        expect(menu.sections[0].heading).toBe(null);
    });
});
