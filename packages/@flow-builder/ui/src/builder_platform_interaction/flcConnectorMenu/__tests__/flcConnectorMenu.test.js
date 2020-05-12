// @ts-nocheck
import { createElement } from 'lwc';
import FlcConnectorMenu from 'builder_platform_interaction/flcConnectorMenu';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { AddElementEvent, ToggleMenuEvent } from 'builder_platform_interaction/events';
import { configureMenu } from '../flcConnectorMenuConfig';
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
        section: 'Data Operation',
        type: 'default',
        icon: 'standard:record_create',
        label: 'RecordCreate',
        value: 'RecordCreate',
        elementType: 'RecordCreate',
        description: 'Create Salesforce recor'
    }
];

jest.mock('../flcConnectorMenuConfig', () => {
    return {
        configureMenu: jest.fn(() => {
            return {
                sections: [
                    {
                        guid: 1,
                        heading: 'Interaction',
                        items: [
                            {
                                description: 'Collect information from',
                                elementType: 'Screen',
                                guid: 1,
                                icon: 'standard:screen',
                                label: 'Screen'
                            }
                        ],
                        label: 'Interaction'
                    }
                ]
            };
        }),
        PASTE_ACTION: 'Paste'
    };
});

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-flc-connector-menu', {
        is: FlcConnectorMenu
    });
    el.elementsMetadata = metaData;
    document.body.appendChild(el);
    return el;
};

describe('connector menu', () => {
    it('should render the component', () => {
        const menu = createComponentUnderTest();
        expect(menu).toBeDefined();
    });
    it('should dispatch toggle menu event on selecting a menu item ', async () => {
        const cmp = createComponentUnderTest();
        await ticks(1);
        const callback = jest.fn();
        cmp.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
        cmp.shadowRoot.querySelector('.slds-listbox__item').click();
        expect(callback).toHaveBeenCalled();
    });
    it('should dispatch add element when paste is not specified ', async () => {
        const cmp = createComponentUnderTest();
        await ticks(1);
        const callback = jest.fn();
        cmp.addEventListener(AddElementEvent.EVENT_NAME, callback);
        cmp.shadowRoot.querySelector('.slds-listbox__item').click();
        expect(callback).toHaveBeenCalled();
    });
    it('should dispatch paste event when paste is specified ', async () => {
        configureMenu.mockReturnValueOnce({
            sections: [
                {
                    guid: 1,
                    heading: '',
                    items: [
                        {
                            guid: 1,
                            description: 'Paste copied element(s)',
                            icon: 'standard:textbox',
                            separator: true,
                            label: 'Paste',
                            elementType: 'Paste'
                        }
                    ],
                    label: 'Paste Section'
                }
            ]
        });
        const cmp = createComponentUnderTest();
        await ticks(1);
        const callback = jest.fn();
        cmp.addEventListener('paste', callback);
        cmp.shadowRoot.querySelector('.slds-listbox__item').click();
        expect(callback).toHaveBeenCalled();
    });
});
