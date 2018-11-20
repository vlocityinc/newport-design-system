import { createElement } from 'lwc';
import { getProcessTypesMenuData } from "builder_platform_interaction/expressionUtils";
import FlowPropertiesEditor from '../flowPropertiesEditor';
import { getShadowRoot } from 'lwc-test-utils';
import { SaveType } from "builder_platform_interaction/saveType";
import { LABELS } from "../flowPropertiesEditorLabels";
import normalizeDateTime from 'builder_platform_interaction/dateTimeUtils';
import format from 'builder_platform_interaction/commonUtils';

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getProcessTypesMenuData() {
            return [
                {
                    value: 'processType1',
                    label: 'processTypeLabel1'
                },
                {
                    value: 'processType2',
                    label: 'processTypeLabel2'
                },
            ];
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
    status: { value: 'Active' },
    interviewLabel: { value: 'interviewLabel' },
    lastModifiedBy: { value: 'some user' },
    lastModifiedDate: { value: '2018-11-12T19:25:22.000+0000' },
    saveType: SaveType.UPDATE,
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
    LAST_MODIFIED: 'div.lastModified',
    LAST_PROCESS_TYPE: 'div.lastProcessType',
};


describe('FlowPropertiesEditor', () => {
    describe('advanced properties', () => {
        it('is hidden by default', () => {
            const component = createComponentForTest();
            component.node = Object.assign(component.node, {saveType: SaveType.CREATE});

            return Promise.resolve().then(() => {
                expect(getShadowRoot(component).querySelector(SELECTORS.ADVANCED)).toBeNull();
            });
        });

        it('defaults to shown for saveType UPDATE', () => {
            const component = createComponentForTest();

            return Promise.resolve().then(() => {
                expect(getShadowRoot(component).querySelector(SELECTORS.ADVANCED)).not.toBeNull();
            });
        });

        describe('handleAdvancedToggle', () => {
            it('shows advanced properties if hidden', () => {
                const component = createComponentForTest();
                component.node = Object.assign(component.node, {saveType: SaveType.CREATE});

                return Promise.resolve().then(() => {
                    getShadowRoot(component).querySelector(SELECTORS.ADVANCED_TOGGLE).click();
                    return Promise.resolve().then(() => {
                        expect(getShadowRoot(component).querySelector(SELECTORS.ADVANCED)).not.toBeNull();
                    });
                });
            });

            it('hides advanced properties if shown', () => {
                const component = createComponentForTest();

                return Promise.resolve().then(() => {
                    getShadowRoot(component).querySelector(SELECTORS.ADVANCED_TOGGLE).click();
                    return Promise.resolve().then(() => {
                        expect(getShadowRoot(component).querySelector(SELECTORS.ADVANCED)).toBeNull();
                    });
                });
            });
        });

        describe('process type', () => {
            it('is empty if no process type found for the value', () => {
                const component = createComponentForTest();
                component.node = Object.assign(component.node, {processType: 'bad process type'});

                return Promise.resolve().then(() => {
                    expect(getShadowRoot(component).querySelector(SELECTORS.LAST_PROCESS_TYPE).textContent).toEqual('');
                });
            });

            it('displays the label associated with the current process type', () => {
                const processTypes = getProcessTypesMenuData();

                const component = createComponentForTest();
                component.node = Object.assign(component.node, {processType: { value: processTypes[1].value}});

                return Promise.resolve().then(() => {
                    expect(getShadowRoot(component).querySelector(SELECTORS.LAST_PROCESS_TYPE).textContent).toEqual(processTypes[1].label);
                });
            });
        });

        describe('lastModifiedText', () => {
            it('returns the localized label with the correct user name and last modified date/time', () => {
                const component = createComponentForTest();

                return Promise.resolve().then(() => {
                    expect(getShadowRoot(component).querySelector(SELECTORS.LAST_MODIFIED).textContent).toEqual(mockFormattedLabel);
                });
            });

            it('calls normalizeDateTime with the the last modified datetime', () => {
                const component = createComponentForTest();

                return Promise.resolve().then(() => {
                    expect(normalizeDateTime.normalizeDateTime).toHaveBeenCalledWith(component.node.lastModifiedDate.value, true);
                });
            });

            it('calls format with the label, user and datetime', () => {
                const component = createComponentForTest();

                return Promise.resolve().then(() => {
                    expect(format.format).toHaveBeenCalledWith(LABELS.lastModifiedText, component.node.lastModifiedBy.value, mockDateTimeString);
                });
            });
        });
    });
});