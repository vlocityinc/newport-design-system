import { createElement } from 'lwc';
import { getProcessTypesMenuData } from "builder_platform_interaction/expressionUtils";
import FlowPropertiesEditor from '../flowPropertiesEditor';
import { getShadowRoot } from 'lwc-test-utils';
import { SaveType } from "builder_platform_interaction/saveType";
import { LABELS } from "../flowPropertiesEditorLabels";
import normalizeDateTime from 'builder_platform_interaction/dateTimeUtils';
import format from 'builder_platform_interaction/commonUtils';
import { PropertyChangedEvent } from "builder_platform_interaction/events";

jest.mock('builder_platform_interaction/ferovResourcePicker', () => require('builder_platform_interaction_mocks/ferovResourcePicker'));

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

const createComponentUnderTest = (node) => {
    const el = createElement('builder_platform_interaction-flowPropertiesEditor', { is: FlowPropertiesEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
};

const selectors = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    FLOW_TYPE: 'lightning-combobox',
    SHOW_ADVANCED: '.show-advanced-button',
    HIDE_ADVANCED: '.hide-advanced-button',
    ADVANCED_PROPERTIES: 'div.advanced',
    LAST_PROCESS_TYPE: 'div.lastProcessType',
    LAST_MODIFIED: 'div.lastModified',
    RESOURCE_TEXT_AREA: 'builder_platform_interaction-resourced-textarea'
};

const getLabelDescription = (flowPropertiesEditor) => {
    return getShadowRoot(flowPropertiesEditor).querySelector(selectors.LABEL_DESCRIPTION);
};

const getProcessType = (flowPropertiesEditor) => {
    return getShadowRoot(flowPropertiesEditor).querySelector(selectors.FLOW_TYPE);
};

const getShowAdvancedButton = (flowPropertiesEditor) => {
    return getShadowRoot(flowPropertiesEditor).querySelector(selectors.SHOW_ADVANCED);
};

const getHideAdvancedButton = (flowPropertiesEditor) => {
    return getShadowRoot(flowPropertiesEditor).querySelector(selectors.HIDE_ADVANCED);
};

const getAdvancedProperties = (flowPropertiesEditor) => {
    return getShadowRoot(flowPropertiesEditor).querySelector(selectors.ADVANCED_PROPERTIES);
};

const getLastModifiedDetails = (flowPropertiesEditor) => {
    return getShadowRoot(flowPropertiesEditor).querySelector(selectors.LAST_MODIFIED);
};

const getResourceTextArea = (flowPropertiesEditor) => {
    return getShadowRoot(flowPropertiesEditor).querySelector(selectors.RESOURCE_TEXT_AREA);
};

const getLastProcessType = (flowPropertiesEditor) => {
    return getShadowRoot(flowPropertiesEditor).querySelector(selectors.LAST_PROCESS_TYPE);
};

describe('FlowPropertiesEditor', () => {
    let flowProperties;
    let flowPropertiesEditor;
    describe('Save As a New Flow (CREATE)', () => {
        beforeEach(() => {
            flowProperties = {
                label: { value: '', error: null },
                name: { value: '', error: null },
                description: { value: '', error: null },
                processType: { value: 'process type', error: null },
                interviewLabel: { value: '', error: null },
                saveType: SaveType.CREATE
            };
            flowPropertiesEditor = createComponentUnderTest(flowProperties);
        });
        describe('Label Description', () => {
            it('check default values', () => {
                const labelDescription = getLabelDescription(flowPropertiesEditor);
                expect(labelDescription).toBeDefined();
                expect(labelDescription.label.value).toBe('');
                expect(labelDescription.label.error).toBeNull();
                expect(labelDescription.devName.value).toBe('');
                expect(labelDescription.devName.error).toBeNull();
                expect(labelDescription.description.value).toBe('');
                expect(labelDescription.description.error).toBeNull();
            });
            it('handles the property changed event and updates the property', () => {
                return Promise.resolve().then(() => {
                    const event = new PropertyChangedEvent('description', 'new desc', null);
                    const labelDescription = getLabelDescription(flowPropertiesEditor);
                    labelDescription.dispatchEvent(event);
                    expect(flowPropertiesEditor.node.description.value).toBe('new desc');
                });
            });
        });
        it('Process Type Drop down', () => {
            const flowTypeDropDown = getProcessType(flowPropertiesEditor);
            expect(flowTypeDropDown).toBeDefined();
            expect(flowTypeDropDown.value).toBe('process type');
        });
        describe('Advanced Properties', () => {
            it('HIDE Advanced Properties', () => {
                const showAdvancedButton = getShowAdvancedButton(flowPropertiesEditor);
                expect(showAdvancedButton.label).toBe(LABELS.showAdvanced);
                expect(getHideAdvancedButton(flowPropertiesEditor)).toBeNull();
                expect(getAdvancedProperties(flowPropertiesEditor)).toBeNull();
                expect(getResourceTextArea(flowPropertiesEditor)).toBeNull();
            });
            it('SHOW Advanced Properties', () => {
                const showAdvancedButton = getShowAdvancedButton(flowPropertiesEditor);
                return Promise.resolve().then(() => {
                    showAdvancedButton.click();
                    return Promise.resolve().then(() => {
                        expect(getShowAdvancedButton(flowPropertiesEditor)).toBeNull();
                        expect(getHideAdvancedButton(flowPropertiesEditor).label).toBe(LABELS.hideAdvanced);
                        expect(getAdvancedProperties(flowPropertiesEditor)).not.toBeNull();
                        expect(getResourceTextArea(flowPropertiesEditor).value.value).toBe('');
                        expect(getResourceTextArea(flowPropertiesEditor).value.error).toBeNull();
                    });
                });
            });
            it('Last Modified Information should NOT be shown for saveType CREATE', () => {
                return Promise.resolve().then(() => {
                    expect(getLastModifiedDetails(flowPropertiesEditor)).toBeNull();
                });
            });
        });
    });
    describe('Save As a New Version (UPDATE)', () => {
        beforeEach(() => {
            flowProperties = {
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
            flowPropertiesEditor = createComponentUnderTest(flowProperties);
        });
        describe('Label Description', () => {
            it('check existing values', () => {
                const labelDescription = getLabelDescription(flowPropertiesEditor);
                expect(labelDescription).toBeDefined();
                expect(labelDescription.label.value).toBe(flowProperties.label.value);
                expect(labelDescription.devName.value).toBe(flowProperties.name.value);
                expect(labelDescription.description.value).toBe(flowProperties.description.value);
            });
        });
        describe('Advanced Properties', () => {
            it('SHOW Advanced Properties', () => {
                return Promise.resolve().then(() => {
                    getHideAdvancedButton(flowPropertiesEditor).click();
                    expect(getHideAdvancedButton(flowPropertiesEditor)).toBeDefined();
                    expect(getShowAdvancedButton(flowPropertiesEditor)).toBeNull();
                    expect(getHideAdvancedButton(flowPropertiesEditor).label).toBe(LABELS.hideAdvanced);
                    expect(getAdvancedProperties(flowPropertiesEditor)).not.toBeNull();
                    expect(getResourceTextArea(flowPropertiesEditor).value.value).toBe(flowProperties.interviewLabel.value);
                });
            });
            describe('Last Modified Information', () => {
                it('returns the localized label with the correct user name and last modified date/time', () => {
                    return Promise.resolve().then(() => {
                        expect(getLastModifiedDetails(flowPropertiesEditor).textContent).toEqual(mockFormattedLabel);
                    });
                });
                it('calls normalizeDateTime with the the last modified datetime', () => {
                    return Promise.resolve().then(() => {
                        expect(normalizeDateTime.normalizeDateTime).toHaveBeenCalledWith(flowPropertiesEditor.node.lastModifiedDate.value, true);
                    });
                });
                it('calls format with the label, user and datetime', () => {
                    return Promise.resolve().then(() => {
                        expect(format.format).toHaveBeenCalledWith(LABELS.lastModifiedText, flowPropertiesEditor.node.lastModifiedBy.value, mockDateTimeString);
                    });
                });
            });
        });
    });
    describe('Process Type', () => {
        it('is empty if no process type found for the value', () => {
            flowProperties = {
                label: { value: '', error: null },
                name: { value: '', error: null },
                description: { value: '', error: null },
                processType: { value: 'bad process type' },
                interviewLabel: { value: '', error: null },
                status: { value: 'Active' },
                lastModifiedBy: { value: 'some user' },
                lastModifiedDate: { value: '2018-11-12T19:25:22.000+0000' },
                saveType: SaveType.UPDATE,
            };
            flowPropertiesEditor = createComponentUnderTest(flowProperties);
            return Promise.resolve().then(() => {
                expect(getLastProcessType(flowPropertiesEditor).textContent).toEqual('');
            });
        });

        it('displays the label associated with the current process type', () => {
            const processTypes = getProcessTypesMenuData();
            flowProperties = {
                label: { value: '', error: null },
                name: { value: '', error: null },
                description: { value: '', error: null },
                processType: { value: processTypes[1].value },
                interviewLabel: { value: '', error: null },
                status: { value: 'Active' },
                lastModifiedBy: { value: 'some user' },
                lastModifiedDate: { value: '2018-11-12T19:25:22.000+0000' },
                saveType: SaveType.UPDATE,
            };
            flowPropertiesEditor = createComponentUnderTest(flowProperties);
            return Promise.resolve().then(() => {
                expect(getLastProcessType(flowPropertiesEditor).textContent).toEqual(processTypes[1].label);
            });
        });
    });
});