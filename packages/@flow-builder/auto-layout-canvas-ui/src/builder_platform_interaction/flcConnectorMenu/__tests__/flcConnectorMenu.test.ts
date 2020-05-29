// @ts-nocheck
import { createElement } from 'lwc';
import FlcConnectorMenu from 'builder_platform_interaction/flcConnectorMenu';
import { ticks } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { AddElementEvent } from 'builder_platform_interaction/events';
import { ToggleMenuEvent } from 'builder_platform_interaction/flcEvents';
import { configureMenu } from '../flcConnectorMenuConfig';
import { ICON_SHAPE } from 'builder_platform_interaction/flcComponentsUtils';

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
                ]
            };
        }),
        PASTE_ACTION: 'Paste'
    };
});

const selectors = {
    listboxItem: '.slds-listbox__item',
    decisionIconSpan: '.rotate-icon-container.slds-icon-standard-decision',
    decisionIcon: '.rotate-icon-svg',
    endIcon: '.background-red.end-element-svg'
};

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
        cmp.shadowRoot.querySelector(selectors.listboxItem).click();
        expect(callback).toHaveBeenCalled();
    });

    it('should dispatch add element when paste is not specified ', async () => {
        const cmp = createComponentUnderTest();
        await ticks(1);
        const callback = jest.fn();
        cmp.addEventListener(AddElementEvent.EVENT_NAME, callback);
        cmp.shadowRoot.querySelector(selectors.listboxItem).click();
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
        cmp.shadowRoot.querySelector(selectors.listboxItem).click();
        expect(callback).toHaveBeenCalled();
    });

    it('Decision element row span should be present', () => {
        const cmp = createComponentUnderTest();
        const decisionElementSpan = cmp.shadowRoot.querySelector(selectors.decisionIconSpan);
        expect(decisionElementSpan).not.toBeNull();
    });

    it('Decision element icon should be present', () => {
        const cmp = createComponentUnderTest();
        const decisionElementIcon = cmp.shadowRoot.querySelector(selectors.decisionIcon);
        expect(decisionElementIcon).not.toBeNull();
    });

    it('End element icon should be present', () => {
        const cmp = createComponentUnderTest();
        const endElementIcon = cmp.shadowRoot.querySelector(selectors.endIcon);
        expect(endElementIcon).not.toBeNull();
    });

    it('End element icon should have the right size', () => {
        const cmp = createComponentUnderTest();
        const endElementIcon = cmp.shadowRoot.querySelector(selectors.endIcon);
        expect(endElementIcon.size).toBe('xx-small');
    });

    it('End element icon should have the right variant', () => {
        const cmp = createComponentUnderTest();
        const endElementIcon = cmp.shadowRoot.querySelector(selectors.endIcon);
        expect(endElementIcon.variant).toBe('inverse');
    });
});
