import { createElement } from 'lwc';
import FlowPropertiesEditor from '../flowPropertiesEditor';
import { getShadowRoot } from 'lwc-test-utils';
import { SaveType } from "builder_platform_interaction/saveType";
import { LABELS } from "../flowPropertiesEditorLabels";
import normalizeDateTime from 'builder_platform_interaction/dateTimeUtils';
import format from 'builder_platform_interaction/commonUtils';

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getProcessTypesMenuData() {
            return [];
        }
    };
});

const mockDateTimeString = 'some date time string';
jest.mock('builder_platform_interaction/dateTimeUtils', () => {
    return {
        getFormat: require.requireActual('builder_platform_interaction/dateTimeUtils').getFormat,
        normalizeDateTime: jest.fn()
    };
});

normalizeDateTime.normalizeDateTime = jest.fn(() => {
    return mockDateTimeString;
});

const mockFormattedLabel = 'some user last saved at some date time string';
jest.mock('builder_platform_interaction/commonUtils', () => {
    return {
        format: jest.fn()
    };
});

format.format = jest.fn(() => {
    return mockFormattedLabel;
});

const defaultNode = {
    label: { value: 'flow label' },
    name: { value: 'flow name' },
    description: { value: 'flow description' },
    processType: { value: 'process type' },
    status: { value: 'status' },
    interviewLabel: { value: 'interviewLabel' },
    lastModifiedDate: { value: '2018-11-12T19:25:22.000+0000' }
};

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-flowPropertiesEditor', { is: FlowPropertiesEditor });

    el.node = Object.assign({}, defaultNode);
    if (props) {
        Object.assign(el, props);
    }

    document.body.appendChild(el);
    return el;
}

const SELECTORS = {
    ADVANCED_TOGGLE: 'lightning-button',
    ADVANCED: 'div.advanced',
    LAST_MODIFIED: 'div.lastModified'
};


describe('FlowPropertiesEditor', () => {
    describe('advanced properties', () => {
        it('is hidden by default', () => {
            const component = createComponentForTest();

            return Promise.resolve().then(() => {
                expect(getShadowRoot(component).querySelector(SELECTORS.ADVANCED)).toBeNull();
            });
        });

        it('defaults to shown for saveType UPDATE', () => {
            const component = createComponentForTest();
            component.node = Object.assign(component.node, {saveType: SaveType.UPDATE});

            return Promise.resolve().then(() => {
                expect(getShadowRoot(component).querySelector(SELECTORS.ADVANCED)).not.toBeNull();
            });
        });

        describe('handleAdvancedToggle', () => {
            it('shows advanced properties if hidden', () => {
                const component = createComponentForTest();

                return Promise.resolve().then(() => {
                    getShadowRoot(component).querySelector(SELECTORS.ADVANCED_TOGGLE).click();
                    return Promise.resolve().then(() => {
                        expect(getShadowRoot(component).querySelector(SELECTORS.ADVANCED)).not.toBeNull();
                    });
                });
            });

            it('hides advanced properties if shown', () => {
                const component = createComponentForTest();
                component.node = Object.assign(component.node, {saveType: SaveType.UPDATE});

                return Promise.resolve().then(() => {
                    getShadowRoot(component).querySelector(SELECTORS.ADVANCED_TOGGLE).click();
                    return Promise.resolve().then(() => {
                        expect(getShadowRoot(component).querySelector(SELECTORS.ADVANCED)).toBeNull();
                    });
                });
            });
        });

        describe('lastModifiedText', () => {
            it('returns the localized label with the correct user name and last modified date/time', () => {
                const component = createComponentForTest();
                // Make sure advanced is shown
                component.node = Object.assign(component.node, {saveType: SaveType.UPDATE});

                return Promise.resolve().then(() => {
                    expect(getShadowRoot(component).querySelector(SELECTORS.LAST_MODIFIED).textContent).toEqual(mockFormattedLabel);
                });
            });

            it('calls normalizeDateTime with the the last modified datetime', () => {
                const component = createComponentForTest();
                // Make sure advanced is shown
                component.node = Object.assign(component.node, {saveType: SaveType.UPDATE});

                return Promise.resolve().then(() => {
                    expect(normalizeDateTime.normalizeDateTime).toHaveBeenCalledWith(component.node.lastModifiedDate.value, true);
                });
            });

            it('calls format with the label, user and datetime', () => {
                const component = createComponentForTest();
                // Make sure advanced is shown
                component.node = Object.assign(component.node, {saveType: SaveType.UPDATE});

                return Promise.resolve().then(() => {
                    expect(format.format).toHaveBeenCalledWith(LABELS.lastModifiedText, 'some_user', mockDateTimeString);
                });
            });
        });
    });
});