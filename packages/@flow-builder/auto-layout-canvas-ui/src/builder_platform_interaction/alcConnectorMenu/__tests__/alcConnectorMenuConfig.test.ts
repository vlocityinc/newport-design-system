// @ts-nocheck
import { configureMenu } from '../alcConnectorMenuConfig';
import { ICON_SHAPE } from 'builder_platform_interaction/alcComponentsUtils';
import { LABELS } from '../alcConnectorMenuLabels';
import { NodeType } from 'builder_platform_interaction/autoLayoutCanvas';

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
        actionName: 'testActionName',
        actionIsStandard: true
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
    )
};

describe('connector menu config', () => {
    it('Match Snapshot with both paste and goto option', () => {
        expect(configureMenu(metadata, elementsMetadata, false, true, true, false)).toMatchSnapshot();
    });

    it('actionSection should have the right label', () => {
        expect(configureMenu(metadata, elementsMetadata, false, true, false, false).sections[0].label).toBe(
            LABELS.actionSectionLabel
        );
    });

    it('pasteItem should have the right label', () => {
        expect(configureMenu(metadata, elementsMetadata, false, true, false, false).sections[0].items[0].label).toBe(
            LABELS.pasteItemLabel
        );
    });

    it('pasteSection item should have the right icon', () => {
        expect(configureMenu(metadata, elementsMetadata, false, true, false, false).sections[0].items[0].icon).toBe(
            'utility:paste'
        );
    });

    it('pasteSection item should have the right rowClass', () => {
        expect(configureMenu(metadata, elementsMetadata, false, true, false, false).sections[0].items[0].rowClass).toBe(
            'slds-listbox__item action-row-line-height'
        );
    });

    it('goToPath should have the right label', () => {
        expect(configureMenu(metadata, elementsMetadata, false, true, true, false).sections[0].items[0].label).toBe(
            `${LABELS.goToPathItemLabel}`
        );
    });

    it('goToPath item should have the right icon', () => {
        expect(configureMenu(metadata, elementsMetadata, false, true, true, false).sections[0].items[0].icon).toBe(
            'utility:level_down'
        );
    });

    it('goToPath item should have the right rowClass', () => {
        expect(configureMenu(metadata, elementsMetadata, false, true, true, false).sections[0].items[0].rowClass).toBe(
            'slds-listbox__item action-row-line-height'
        );
    });

    it('reRoute/delete should be displayed and GoTo should not', () => {
        const menu = configureMenu(metadata, elementsMetadata, false, true, false, true);
        expect(menu.sections[0].items[0].label).toBe(LABELS.reRouteGoToPathItemLabel);
        expect(menu.sections[0].items[1].label).toBe(LABELS.deleteGoToPathItemLabel);
        expect(menu.sections[0].items[2].label).toBe(LABELS.pasteItemLabel);
    });

    it('reRoutePath item should have the right icon', () => {
        expect(configureMenu(metadata, elementsMetadata, false, true, false, true).sections[0].items[0].icon).toBe(
            'utility:level_down'
        );
    });

    it('reRoutePath item should have the right rowClass', () => {
        expect(configureMenu(metadata, elementsMetadata, false, true, false, true).sections[0].items[0].rowClass).toBe(
            'slds-listbox__item action-row-line-height'
        );
    });

    it('deletePath item should have the right icon', () => {
        expect(configureMenu(metadata, elementsMetadata, false, true, false, true).sections[0].items[1].icon).toBe(
            'utility:delete'
        );
    });

    it('deletePath item should have the right rowClass', () => {
        expect(configureMenu(metadata, elementsMetadata, false, true, false, true).sections[0].items[1].rowClass).toBe(
            'slds-listbox__item action-row-line-height'
        );
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
        const menu = configureMenu(metadata, metaDataWithOrchestrator, false, true, false, true);
        expect(menu.sections.find((section) => section.label === 'Logic').heading).toBe(null);
    });

    it('is not null for other types', () => {
        const menu = configureMenu(metadata, elementsMetadata, false, true, false, true);
        expect(menu.sections.find((section) => section.label === 'Logic').heading).toBe('Logic');
    });
});
