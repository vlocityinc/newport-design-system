// @ts-nocheck
import { ICON_SHAPE } from 'builder_platform_interaction/flcComponentsUtils';
import { pasteSection, configureMenu } from '../flcConnectorMenuConfig';
import { LABELS } from '../flcConnectorMenuLabels';

jest.mock('builder_platform_interaction/storeLib', () => {
    return {
        generateGuid: jest.fn(() => 1)
    };
});

const metaData = [
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
        section: 'Logic',
        type: 'branch',
        icon: 'standard:decision',
        iconShape: ICON_SHAPE.DIAMOND,
        label: 'Decision',
        value: 'Decision',
        elementType: 'Decision',
        description: 'Create Decision'
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

const metaDataResponse = [
    {
        guid: 1,
        heading: 'Interaction',
        items: [
            {
                description: 'Collect information from',
                elementType: 'Screen',
                guid: 1,
                icon: 'standard:screen',
                iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
                iconClass: '',
                iconSize: 'small',
                iconVariant: '',
                label: 'Screen'
            }
        ],
        label: 'Interaction'
    },
    {
        guid: 1,
        heading: 'Logic',
        items: [
            {
                description: 'Create Decision',
                elementType: 'Decision',
                guid: 1,
                icon: 'standard:decision',
                iconContainerClass:
                    'slds-media__figure slds-listbox__option-icon rotate-icon-container slds-icon-standard-decision',
                iconClass: ' rotate-icon-svg',
                iconSize: 'small',
                iconVariant: '',
                label: 'Decision'
            },
            {
                description: 'Create End',
                elementType: 'End',
                guid: 1,
                icon: 'utility:stop',
                iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
                iconClass: 'background-red end-element-svg',
                iconSize: 'xx-small',
                iconVariant: 'inverse',
                label: 'End'
            }
        ],
        label: 'Logic'
    }
];

describe('connector menu config', () => {
    it('should return an object with sections as its key and and empty array as its value by default', () => {
        expect(configureMenu()).toEqual({ sections: [] });
    });

    it('should have the paste element in the object and the correct transformed data ', () => {
        expect(configureMenu(metaData, true, true)).toEqual({ sections: [pasteSection, ...metaDataResponse] });
    });

    it('should not have the paste element in the object and the correct transformed data', () => {
        expect(configureMenu(metaData, true, false)).toEqual({ sections: [...metaDataResponse] });
    });

    it('pasteSection should have the right label', () => {
        expect(configureMenu(metaData, false, true).sections[0].label).toBe(LABELS.pasteSectionLabel);
    });

    it('pasteSection item should have the right label', () => {
        expect(configureMenu(metaData, false, true).sections[0].items[0].label).toBe(LABELS.pasteItemLabel);
    });

    it('pasteSection item should have the right description', () => {
        expect(configureMenu(metaData, false, true).sections[0].items[0].description).toBe(LABELS.pasteItemDescription);
    });

    it('pasteSection item should have the right icon', () => {
        expect(configureMenu(metaData, false, true).sections[0].items[0].icon).toBe('standard:record');
    });

    it('pasteSection item should have the right icon class', () => {
        expect(configureMenu(metaData, false, true).sections[0].items[0].iconClass).toBe('paste-icon');
    });
});
