// @ts-nocheck
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { orgHasScreenFlowsInSlack } from 'builder_platform_interaction/contextLib';
import normalizeDateTime from 'builder_platform_interaction/dateTimeUtils';
import { ComboboxStateChangedEvent, PropertyChangedEvent } from 'builder_platform_interaction/events';
import { FLOW_PROCESS_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { SaveType } from 'builder_platform_interaction/saveType';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { createElement } from 'lwc';
import { MOCK_ALL_FLOW_ENTRIES, MOCK_OVERRIDABLE_FLOWS, MOCK_TEMPLATE_FLOWS } from 'mock/flowEntryData';
import FlowPropertiesEditor from '../flowPropertiesEditor';
import { LABELS } from '../flowPropertiesEditorLabels';

const { format } = commonUtils;

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

jest.mock('builder_platform_interaction/systemLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/systemLib');
    return {
        getBuilderType() {
            return 'abc';
        },

        getGlobalConstantOrSystemVariable: actual.getGlobalConstantOrSystemVariable,
        getGlobalVariable: actual.getGlobalVariable,
        getLatestApiVersion() {
            return 50;
        },
        getMinApiVersion() {
            return 49;
        },
        getDefaultApiVersion() {
            return 49;
        },
        initVersioningInfoForProcessType() {},
        isVersioningDataInitialized() {
            return true;
        },
        isVersioningSupported() {
            return true;
        }
    };
});

jest.mock('builder_platform_interaction/systemVariableConstantsLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/systemVariableConstantsLib');
    return {
        SYSTEM_VARIABLES: actual.SYSTEM_VARIABLES
    };
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/expressionUtils');
    return {
        getRunInModesMenuData() {
            return [
                {
                    value: 'defaultMode',
                    label: 'defaultMode'
                },
                {
                    value: 'systemModeWithSharing',
                    label: 'systemModeWithSharing'
                },
                {
                    value: 'systemModeWithoutSharing',
                    lable: 'systemModeWithoutSharing'
                }
            ];
        },

        getApiVersionMenuData() {
            return [
                {
                    value: '49',
                    label: '49'
                },
                {
                    value: '50',
                    label: '50'
                }
            ];
        },

        filterMatches: jest.fn()
    };
});

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: (serverActionType, params) => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_FLOW_ENTRIES:
                    return Promise.resolve(MOCK_ALL_FLOW_ENTRIES);
                case SERVER_ACTION_TYPE.GET_OVERRIDABLE_FLOWS:
                    if (params.isTemplate === true) {
                        return Promise.resolve(MOCK_TEMPLATE_FLOWS);
                    }
                    return Promise.resolve(MOCK_OVERRIDABLE_FLOWS);
                default:
                    return Promise.reject(new Error('Unexpected server action ' + serverActionType));
            }
        }
    };
});

const mockDateTimeString = 'some date time string';
jest.mock('builder_platform_interaction/dateTimeUtils', () => {
    return {
        getFormat: jest.requireActual('builder_platform_interaction/dateTimeUtils').getFormat,
        normalizeDateTime: jest.fn()
    };
});

jest.mock('builder_platform_interaction/contextLib', () => require('builder_platform_interaction_mocks/contextLib'));

normalizeDateTime.normalizeDateTime = jest.fn(() => {
    return mockDateTimeString;
});

const mockFormattedLabel = 'some user last saved at some date time string';
const cmnUtils = jest.requireActual('builder_platform_interaction/commonUtils');
cmnUtils.format = jest.fn().mockImplementation(() => mockFormattedLabel);

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getTriggerType: jest.fn()
    };
});

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const sharedUtils = require('builder_platform_interaction_mocks/sharedUtils');
    const commonUtils = Object.assign({}, sharedUtils.commonUtils, {
        format: jest.fn(() => {
            return 'some user last saved at some date time string';
        })
    });
    return Object.assign({}, sharedUtils, { commonUtils });
});

const createComponentUnderTest = (node) => {
    const el = createElement('builder_platform_interaction-flowPropertiesEditor', { is: FlowPropertiesEditor });
    el.node = node;
    setDocumentBodyChildren(el);
    return el;
};

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    FLOW_TYPE: 'lightning-combobox.process-type',
    SAVE_AS_TOGGLE: 'lightning-radio-group',
    SHOW_ADVANCED: '.show-advanced-button',
    HIDE_ADVANCED: '.hide-advanced-button',
    ADVANCED_PROPERTIES: 'div.advanced',
    LAST_PROCESS_TYPE: 'div.lastProcessType',
    LAST_MODIFIED: 'div.lastModified',
    VERSION_NUMBER: 'div.versionNumber',
    RESOURCE_TEXT_AREA: 'builder_platform_interaction-resourced-textarea',
    RICH_TEXT_PLAIN_TEXT_SWITCH: 'builder_platform_interaction-rich-text-plain-text-switch',
    API_VERSION: 'lightning-combobox.api-version',
    SLACK_CHECK: 'lightning-input.slack_check',
    TEMPLATE_CHECK: 'lightning-input.template_check',
    SOURCE_TEMPLATE_COMBOBOX: 'builder_platform_interaction-combobox.source-template',
    OVERRIDABLE_CHECK: 'lightning-input.overridable_check',
    OVERRIDABLE_COMBOBOX: 'builder_platform_interaction-combobox.overrides-flow-template',
    NEW_FLOW_OVERRIDES_BANNER: 'div.test-overrides-banner',
    TRIGGER_ORDER: 'lightning-input.priority',
    LEGAL_POPOVER: 'builder_platform_interaction-legal-popover',
    LEGAL_POPOVER_DISMISS_BUTTON: 'lightning-button-icon'
};

const getLabelDescription = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.LABEL_DESCRIPTION);
};

const getProcessType = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.FLOW_TYPE);
};

const getShowAdvancedButton = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.SHOW_ADVANCED);
};

const getHideAdvancedButton = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.HIDE_ADVANCED);
};

const getAdvancedProperties = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.ADVANCED_PROPERTIES);
};

const getLastModifiedDetails = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.LAST_MODIFIED);
};

const getResourceTextArea = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.RESOURCE_TEXT_AREA);
};

const getLastProcessType = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.LAST_PROCESS_TYPE);
};

const getSaveAsToggle = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.SAVE_AS_TOGGLE);
};

const getRichTextPlainTextSwitch = (rexourdedTextArea) =>
    rexourdedTextArea.shadowRoot.querySelector(SELECTORS.RICH_TEXT_PLAIN_TEXT_SWITCH);

const dispatchLabelChangedEvent = (flowPropertiesEditor, newLabelValue, error) => {
    const event = new PropertyChangedEvent('label', newLabelValue, error);
    const labelDescription = getLabelDescription(flowPropertiesEditor);
    labelDescription.dispatchEvent(event);
};

const dispatchToggleSlackCheckboxEvent = (flowPropertiesEditor, value) => {
    const event = new CustomEvent('change', { detail: { checked: value } });
    getSlackCheck(flowPropertiesEditor).dispatchEvent(event);
};

const dispatchChangeProcessTypeEvent = (flowPropertiesEditor, newProcessType) => {
    const processTypeEvent = new CustomEvent('change', {
        detail: { value: newProcessType }
    });
    const processType = getProcessType(flowPropertiesEditor);
    processType.dispatchEvent(processTypeEvent);
};

const getApiVersion = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.API_VERSION);
};

const getTriggerOrder = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.TRIGGER_ORDER);
};

const getTemplateCheck = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.TEMPLATE_CHECK);
};

const getSlackCheck = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.SLACK_CHECK);
};

const getOverridableCheck = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.OVERRIDABLE_CHECK);
};

const getSourceTemplateCombobox = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.SOURCE_TEMPLATE_COMBOBOX);
};

const getOverridenFlowCombobox = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.OVERRIDABLE_COMBOBOX);
};

const getNewFlowOverridesBanner = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.NEW_FLOW_OVERRIDES_BANNER);
};

const getLegalNoticePopover = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.LEGAL_POPOVER);
};

describe('FlowPropertiesEditor', () => {
    let flowProperties;
    let flowPropertiesEditor;
    const minProperties = {
        label: { value: '', error: null },
        name: { value: '', error: null },
        description: { value: '', error: null },
        processType: { value: 'process type', error: null },
        interviewLabel: { value: 'interviewLabel' },
        runInMode: { value: null, error: null },
        status: { value: 'Active' },
        environments: []
    };
    const sampleProperties = {
        label: { value: 'flow label' },
        name: { value: 'flow name' },
        description: { value: 'flow description' },
        processType: { value: 'process type', error: null },
        interviewLabel: { value: 'interviewLabel' },
        runInMode: { value: null, error: null },
        lastModifiedBy: { value: 'some user' },
        lastModifiedDate: { value: '2018-11-12T19:25:22.000+0000' },
        status: { value: 'Active' },
        environments: []
    };
    describe('Save As a New Flow (CREATE)', () => {
        beforeEach(() => {
            flowProperties = {
                ...minProperties,
                triggerType: { value: 'trigger type', error: null },
                interviewLabel: { value: '', error: null },
                saveType: SaveType.CREATE,
                apiVersion: 49
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
                const event = new PropertyChangedEvent('description', 'new desc', null);
                const labelDescription = getLabelDescription(flowPropertiesEditor);
                labelDescription.dispatchEvent(event);
                expect(flowPropertiesEditor.node.description.value).toBe('new desc');
            });
            describe('Updating the flow label', () => {
                it('should update the interview label if it is blank', () => {
                    dispatchLabelChangedEvent(flowPropertiesEditor, 'new label', null);
                    expect(flowPropertiesEditor.node.interviewLabel.value).toBe('new label {!$Flow.CurrentDateTime}');
                });
                it('should not update the interview label if the flow label has an error', () => {
                    dispatchLabelChangedEvent(flowPropertiesEditor, 'new label', 'error');
                    expect(flowPropertiesEditor.node.interviewLabel.value).toBe('');
                });
                it('should not update the interview label if it already has a value', () => {
                    flowProperties.interviewLabel.value = 'old interview label';
                    dispatchLabelChangedEvent(flowPropertiesEditor, 'new label', 'error');
                    expect(flowPropertiesEditor.node.interviewLabel.value).toBe('old interview label');
                });
            });
        });
        describe('Advanced Properties', () => {
            it('HIDE Advanced Properties', () => {
                const showAdvancedButton = getShowAdvancedButton(flowPropertiesEditor);
                expect(showAdvancedButton.label).toBe(LABELS.showAdvanced);
                expect(getHideAdvancedButton(flowPropertiesEditor)).toBeNull();
                expect(getAdvancedProperties(flowPropertiesEditor)).toBeNull();
                expect(getProcessType(flowPropertiesEditor)).toBeNull();
                expect(getResourceTextArea(flowPropertiesEditor)).toBeNull();
                expect(getApiVersion(flowPropertiesEditor)).toBeNull();
            });
            it('SHOW Advanced Properties', async () => {
                const showAdvancedButton = getShowAdvancedButton(flowPropertiesEditor);
                showAdvancedButton.click();
                await ticks(1);
                expect(getShowAdvancedButton(flowPropertiesEditor)).toBeNull();
                expect(getHideAdvancedButton(flowPropertiesEditor)).not.toBeNull();
                expect(getAdvancedProperties(flowPropertiesEditor)).not.toBeNull();
                expect(getProcessType(flowPropertiesEditor)).toBeDefined();
                expect(getProcessType(flowPropertiesEditor).disabled).toBe(false);
                expect(getProcessType(flowPropertiesEditor).value).toBe('process type trigger type');
                const recourcedTextArea = getResourceTextArea(flowPropertiesEditor);
                expect(recourcedTextArea.value.value).toBe('');
                expect(recourcedTextArea.value.error).toBeNull();
                expect(getRichTextPlainTextSwitch(recourcedTextArea)).toBeNull();
                expect(getApiVersion(flowPropertiesEditor)).toBeDefined();
                expect(getApiVersion(flowPropertiesEditor).value).toBe('49');
            });
            it('Last Modified Information should NOT be shown for saveType CREATE', () => {
                expect(getLastModifiedDetails(flowPropertiesEditor)).toBeNull();
            });
        });
    });
    describe('Save As a New Version (UPDATE)', () => {
        beforeEach(() => {
            flowProperties = {
                ...sampleProperties,
                triggerType: { value: 'trigger type' },
                saveType: SaveType.UPDATE,
                apiVersion: 50
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
            it('SHOW Advanced Properties', async () => {
                expect(getShowAdvancedButton(flowPropertiesEditor)).toBeDefined();
                expect(getHideAdvancedButton(flowPropertiesEditor)).toBeNull();
                expect(getShowAdvancedButton(flowPropertiesEditor).label).toBe(LABELS.showAdvanced);
                getShowAdvancedButton(flowPropertiesEditor).click();
                await ticks(1);
                expect(getAdvancedProperties(flowPropertiesEditor)).not.toBeNull();
                const resourcedTextArea = getResourceTextArea(flowPropertiesEditor);
                expect(resourcedTextArea.value.value).toBe(flowProperties.interviewLabel.value);
                expect(getRichTextPlainTextSwitch(resourcedTextArea)).toBeNull();
                expect(getProcessType(flowPropertiesEditor).disabled).toBe(true);
                expect(getApiVersion(flowPropertiesEditor)).not.toBeNull();
                expect(getApiVersion(flowPropertiesEditor).value).toBe('50');
            });
            describe('Last Modified Information', () => {
                it('returns the localized label with the correct user name and last modified date/time', async () => {
                    getShowAdvancedButton(flowPropertiesEditor).click();
                    await ticks(1);
                    expect(getLastModifiedDetails(flowPropertiesEditor).textContent).toEqual(mockFormattedLabel);
                });
                it('calls normalizeDateTime with the last modified datetime', async () => {
                    getShowAdvancedButton(flowPropertiesEditor).click();
                    await ticks(1);
                    expect(normalizeDateTime.normalizeDateTime).toHaveBeenCalledWith(
                        flowPropertiesEditor.node.lastModifiedDate.value,
                        true
                    );
                });
                it('calls format with the label, user and datetime', async () => {
                    getShowAdvancedButton(flowPropertiesEditor).click();
                    await ticks(1);
                    expect(format).toHaveBeenCalledWith(
                        LABELS.lastModifiedText,
                        flowPropertiesEditor.node.lastModifiedBy.value,
                        mockDateTimeString
                    );
                });
            });
        });
    });
    describe('Process Type', () => {
        const baseProperties = {
            ...minProperties,
            processType: { value: 'bad process type' },
            triggerType: { value: '' },
            interviewLabel: { value: '', error: null },
            lastModifiedBy: { value: 'some user' },
            lastModifiedDate: { value: '2018-11-12T19:25:22.000+0000' },
            saveType: SaveType.UPDATE
        };
        it('is empty if no process type found for the value', async () => {
            flowProperties = {
                ...baseProperties,
                processType: { value: 'bad process type' },
                triggerType: { value: '' }
            };
            flowPropertiesEditor = createComponentUnderTest(flowProperties);
            getShowAdvancedButton(flowPropertiesEditor).click();
            await ticks(1);
            expect(getLastProcessType(flowPropertiesEditor).textContent).toEqual('');
        });

        it('displays the label associated with the current process type', async () => {
            flowProperties = {
                ...baseProperties,
                processType: { value: 'AutoLaunchedFlow' }
            };
            flowPropertiesEditor = createComponentUnderTest(flowProperties);
            getShowAdvancedButton(flowPropertiesEditor).click();
            await Promise.resolve();
            expect(getLastProcessType(flowPropertiesEditor).textContent).toEqual('Autolaunched Flow');
            expect(getProcessType(flowPropertiesEditor).value).toEqual('AutoLaunchedFlow None');
        });

        it('displays the label associated with the current process and trigger type', async () => {
            flowProperties = {
                ...baseProperties,
                processType: { value: 'AutoLaunchedFlow' },
                triggerType: { value: 'RecordBeforeSave' }
            };
            flowPropertiesEditor = createComponentUnderTest(flowProperties);
            getShowAdvancedButton(flowPropertiesEditor).click();
            await Promise.resolve();
            expect(getLastProcessType(flowPropertiesEditor).textContent).toEqual('Record Changed');
            expect(getProcessType(flowPropertiesEditor).value).toEqual('AutoLaunchedFlow RecordAfterSave');
        });

        it('displays the label associated with Autolauched Flow and After Save trigger', async () => {
            flowProperties = {
                ...baseProperties,
                processType: { value: 'AutoLaunchedFlow' },
                triggerType: { value: 'RecordAfterSave' }
            };
            flowPropertiesEditor = createComponentUnderTest(flowProperties);
            getShowAdvancedButton(flowPropertiesEditor).click();
            await Promise.resolve();
            expect(getLastProcessType(flowPropertiesEditor).textContent).toEqual('Record Changed');
            expect(getProcessType(flowPropertiesEditor).value).toEqual('AutoLaunchedFlow RecordAfterSave');
        });

        describe('versionNumber', () => {
            let defaultNode;
            beforeEach(() => {
                defaultNode = {
                    ...sampleProperties,
                    versionNumber: 1,
                    saveType: SaveType.UPDATE
                };
            });

            it('is shown when save type is UPDATE', async () => {
                const component = createComponentUnderTest(defaultNode);
                getShowAdvancedButton(component).click();
                await ticks(1);
                expect(component.shadowRoot.querySelector(SELECTORS.VERSION_NUMBER)).not.toBeNull();
            });

            it('is shown when save type is NEW_VERSION', async () => {
                defaultNode.saveType = SaveType.NEW_VERSION;
                const component = createComponentUnderTest(defaultNode);
                getShowAdvancedButton(component).click();
                await ticks(1);
                expect(component.shadowRoot.querySelector(SELECTORS.VERSION_NUMBER)).not.toBeNull();
            });
        });

        describe('Toggle between save as types', () => {
            let defaultNode;
            beforeEach(() => {
                defaultNode = {
                    ...sampleProperties,
                    processType: { value: 'AutoLaunchedFlow' },
                    triggerType: { value: 'RecordBeforeSave' },
                    versionNumber: 1,
                    saveType: SaveType.NEW_DEFINITION
                };
            });

            it('restores the original flow property values when toggling back to New Version', async () => {
                flowPropertiesEditor = createComponentUnderTest(defaultNode);
                const labelEvent = new PropertyChangedEvent('interviewLabel', 'new label');
                const labelDescription = getLabelDescription(flowPropertiesEditor);
                labelDescription.dispatchEvent(labelEvent);
                // This first expect is to ensure the test is not a false positive
                expect(flowPropertiesEditor.node.interviewLabel.value).toBe('new label');
                getShowAdvancedButton(flowPropertiesEditor).click();
                await ticks(1);
                const processTypeEvent = new CustomEvent('change', {
                    detail: { value: 'Flow None' }
                });
                const processType = getProcessType(flowPropertiesEditor);
                processType.dispatchEvent(processTypeEvent);
                await ticks(1);
                expect(flowPropertiesEditor.node.processType.value).toBe('Flow');
                expect(flowPropertiesEditor.node.triggerType.value).toBeNull();
                getSaveAsToggle(flowPropertiesEditor).dispatchEvent(
                    new CustomEvent('change', {
                        detail: { value: SaveType.NEW_VERSION }
                    })
                );
                expect(flowPropertiesEditor.node.interviewLabel.value).toBe('interviewLabel');
                expect(flowPropertiesEditor.node.processType.value).toBe('AutoLaunchedFlow');
                expect(flowPropertiesEditor.node.triggerType.value).toBe('RecordBeforeSave');
            });

            it('clears the label, name, description, interview label flow properties when toggling to New Flow', () => {
                defaultNode.saveType = SaveType.NEW_VERSION;
                flowPropertiesEditor = createComponentUnderTest(defaultNode);
                getSaveAsToggle(flowPropertiesEditor).dispatchEvent(
                    new CustomEvent('change', {
                        detail: { value: SaveType.NEW_DEFINITION }
                    })
                );
                expect(flowPropertiesEditor.node.label.value).toBe('');
                expect(flowPropertiesEditor.node.name.value).toBe('');
                expect(flowPropertiesEditor.node.description.value).toBe('');
                expect(flowPropertiesEditor.node.interviewLabel.value).toBe('');
            });
        });
    });
    describe('Trigger Order Field', () => {
        describe('Basic check', () => {
            let baseProperties;
            beforeEach(() => {
                baseProperties = {
                    ...sampleProperties,
                    processType: { value: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW },
                    versionNumber: 1,
                    triggerType: FLOW_TRIGGER_TYPE.AFTER_SAVE,
                    saveType: SaveType.UPDATE,
                    triggerOrder: 150,
                    apiVersion: 49
                };
                flowProperties = {
                    ...baseProperties,
                    triggerType: FLOW_TRIGGER_TYPE.AFTER_SAVE,
                    processType: { value: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW },
                    triggerOrder: 150
                };
                flowPropertiesEditor = createComponentUnderTest(flowProperties);
                getShowAdvancedButton(flowPropertiesEditor).click();
            });

            it('displays the value associated with current priority', async () => {
                await Promise.resolve();
                expect(getTriggerOrder(flowPropertiesEditor).value).toEqual(150);
            });
            it('will show an error if the value entered is out of the range', async () => {
                await Promise.resolve();
                const triggerOrderField = getTriggerOrder(flowPropertiesEditor);
                triggerOrderField.dispatchEvent(
                    new CustomEvent('change', {
                        detail: { value: 2001 }
                    })
                );
                expect(triggerOrderField.getAttribute('aria-invalid')).toEqual('true');
            });
            it('will revert an error if the value is in the range', async () => {
                const triggerOrderField = getTriggerOrder(flowPropertiesEditor);
                triggerOrderField.dispatchEvent(
                    new CustomEvent('change', {
                        detail: { value: 2001 }
                    })
                );
                expect(triggerOrderField.getAttribute('aria-invalid')).toEqual('true');
                triggerOrderField.dispatchEvent(
                    new CustomEvent('change', {
                        detail: { value: 1000 }
                    })
                );
                await ticks(1);
                expect(triggerOrderField.getAttribute('aria-invalid')).toEqual('false');
            });
        });
    });
    describe('Api Version', () => {
        describe('Basic checks', () => {
            let baseProperties;
            beforeEach(() => {
                baseProperties = {
                    ...sampleProperties,
                    processType: { value: 'process type2' },
                    versionNumber: 1,
                    saveType: SaveType.UPDATE,
                    apiVersion: 49
                };
            });

            it('displays the value associated with the current api Version', async () => {
                flowProperties = {
                    ...baseProperties,
                    apiVersion: 50
                };
                flowPropertiesEditor = createComponentUnderTest(flowProperties);
                getShowAdvancedButton(flowPropertiesEditor).click();
                await Promise.resolve();
                expect(getApiVersion(flowPropertiesEditor).value).toEqual('50');
            });
        });

        describe('Toggle between save as types', () => {
            let defaultNode;
            beforeEach(() => {
                defaultNode = {
                    ...sampleProperties,
                    processType: { value: 'AutoLaunchedFlow' },
                    triggerType: { value: 'RecordBeforeSave' },
                    versionNumber: 1,
                    saveType: SaveType.NEW_VERSION,
                    apiVersion: 50
                };
            });

            it('gets the same apiVersion selected in New Version when switching to New Definiton', async () => {
                flowPropertiesEditor = createComponentUnderTest(defaultNode);
                getShowAdvancedButton(flowPropertiesEditor).click();
                await ticks(1);
                const apiVersionEvent = new CustomEvent('change', {
                    detail: { value: '49' }
                });
                const apiVersion = getApiVersion(flowPropertiesEditor);
                apiVersion.dispatchEvent(apiVersionEvent);
                await ticks(1);
                expect(getApiVersion(flowPropertiesEditor).value).toBe('49');
                getSaveAsToggle(flowPropertiesEditor).dispatchEvent(
                    new CustomEvent('change', {
                        detail: { value: SaveType.NEW_DEFINITION }
                    })
                );
                await ticks(1);
                expect(getApiVersion(flowPropertiesEditor).value).toBe('49');
            });

            it('restores the original ApiVersion properties when toggling back to New Version from new Defintion', async () => {
                flowPropertiesEditor = createComponentUnderTest(defaultNode);
                getShowAdvancedButton(flowPropertiesEditor).click();
                await ticks(1);
                expect(getApiVersion(flowPropertiesEditor).value).toBe('50');
                getSaveAsToggle(flowPropertiesEditor).dispatchEvent(
                    new CustomEvent('change', {
                        detail: { value: SaveType.NEW_DEFINITION }
                    })
                );
                const apiVersionEvent = new CustomEvent('change', {
                    detail: { value: '49' }
                });
                const apiVersion = getApiVersion(flowPropertiesEditor);
                apiVersion.dispatchEvent(apiVersionEvent);
                await ticks(1);
                expect(getApiVersion(flowPropertiesEditor).value).toBe('49');
                getSaveAsToggle(flowPropertiesEditor).dispatchEvent(
                    new CustomEvent('change', {
                        detail: { value: SaveType.NEW_VERSION }
                    })
                );
                await ticks(1);
                expect(getApiVersion(flowPropertiesEditor).value).toBe('50');
            });
        });

        describe('Toggle between ProcessTypes', () => {
            let defaultNode;
            beforeEach(() => {
                defaultNode = {
                    ...sampleProperties,
                    processType: { value: 'AutoLaunchedFlow' },
                    triggerType: { value: 'RecordBeforeSave' },
                    versionNumber: 1,
                    saveType: SaveType.NEW_DEFINITION,
                    apiVersion: 50
                };
            });

            it('gets the same apiVersion selected in New Defintion when switching ProcessTypes', async () => {
                flowPropertiesEditor = createComponentUnderTest(defaultNode);
                getShowAdvancedButton(flowPropertiesEditor).click();
                await ticks(1);
                expect(getApiVersion(flowPropertiesEditor).value).toBe('50');
                const apiVersionEvent = new CustomEvent('change', {
                    detail: { value: '49' }
                });
                const apiVersion = getApiVersion(flowPropertiesEditor);
                apiVersion.dispatchEvent(apiVersionEvent);
                await ticks(1);
                expect(getApiVersion(flowPropertiesEditor).value).toBe('49');
                dispatchChangeProcessTypeEvent(flowPropertiesEditor, 'Flow None');
                await ticks(1);
                expect(getApiVersion(flowPropertiesEditor).value).toBe('49');
            });
        });
    });
    describe('Test overrides and templates from gear icon', () => {
        let defaultNode;
        beforeAll(() => {
            defaultNode = {
                ...sampleProperties,
                processType: { value: 'AutoLaunchedFlow' },
                triggerType: { value: 'RecordBeforeSave' },
                versionNumber: 1,
                saveType: SaveType.UPDATE,
                apiVersion: 50,
                isTemplate: false,
                isOverridable: false,
                overriddenFlow: null,
                sourceTemplate: null
            };
        });
        describe('When no values are set', () => {
            beforeAll(() => {
                flowPropertiesEditor = createComponentUnderTest(defaultNode);
                getShowAdvancedButton(flowPropertiesEditor).click();
            });
            beforeEach(async () => {
                await ticks(1);
            });
            it('should have isTemplate checkbox enabled and unchecked', async () => {
                expect(getTemplateCheck(flowPropertiesEditor).checked).toBe(false);
                expect(getTemplateCheck(flowPropertiesEditor).disabled).toBeFalsy();
            });
            it('should have isOverridable checkbox enabled and unchecked', async () => {
                expect(getOverridableCheck(flowPropertiesEditor).checked).toBe(false);
                expect(getOverridableCheck(flowPropertiesEditor).disabled).toBeFalsy();
            });
            it('should have sourceTemplate combobox enabled and empty', async () => {
                expect(getSourceTemplateCombobox(flowPropertiesEditor).value).toBe('');
                expect(getSourceTemplateCombobox(flowPropertiesEditor).disabled).toBeFalsy();
            });
            it('should have overriddenFlow combobox enabled and empty', async () => {
                expect(getOverridenFlowCombobox(flowPropertiesEditor).value).toBe('');
                expect(getOverridenFlowCombobox(flowPropertiesEditor).disabled).toBeFalsy();
            });
            describe('when isTemplate checkbox is toggled on', () => {
                beforeAll(() => {
                    const toFalseEvent = new CustomEvent('change', {
                        detail: { checked: true }
                    });
                    getTemplateCheck(flowPropertiesEditor).dispatchEvent(toFalseEvent);
                });
                it('should have isTemplate checkbox enabled and checked', async () => {
                    expect(getTemplateCheck(flowPropertiesEditor).checked).toBe(true);
                    expect(getTemplateCheck(flowPropertiesEditor).disabled).toBeFalsy();
                });
                it('should have isOverridable checkbox disabled', async () => {
                    expect(getOverridableCheck(flowPropertiesEditor).checked).toBe(false);
                    expect(getOverridableCheck(flowPropertiesEditor).disabled).toBeTruthy();
                });
                it('should have sourceTemplate combobox disabled and empty', async () => {
                    expect(getSourceTemplateCombobox(flowPropertiesEditor).disabled).toBeTruthy();
                    expect(getSourceTemplateCombobox(flowPropertiesEditor).value).toBe('');
                });
                it('should have overriddenFlow combobox disabled and empty', async () => {
                    expect(getOverridenFlowCombobox(flowPropertiesEditor).value).toBe('');
                    expect(getOverridenFlowCombobox(flowPropertiesEditor).disabled).toBeTruthy();
                });
            });
        });
        describe('When isTemplate is set', () => {
            beforeAll(() => {
                defaultNode.isTemplate = true;
                defaultNode.isOverridable = false;
                defaultNode.overriddenFlow = null;
                defaultNode.sourceTemplate = null;
                flowPropertiesEditor = createComponentUnderTest(defaultNode);
                getShowAdvancedButton(flowPropertiesEditor).click();
            });
            beforeEach(async () => {
                await ticks(1);
            });
            it('should have isTemplate checkbox enabled and checked', async () => {
                expect(getTemplateCheck(flowPropertiesEditor).checked).toBe(true);
                expect(getTemplateCheck(flowPropertiesEditor).disabled).toBeFalsy();
            });
            it('should have isOverridable checkbox disabled', async () => {
                expect(getOverridableCheck(flowPropertiesEditor).checked).toBe(false);
                expect(getOverridableCheck(flowPropertiesEditor).disabled).toBeTruthy();
            });
            it('should have sourceTemplate combobox disabled and empty', async () => {
                expect(getSourceTemplateCombobox(flowPropertiesEditor).disabled).toBeTruthy();
                expect(getSourceTemplateCombobox(flowPropertiesEditor).value).toBe('');
            });
            it('should have overriddenFlow combobox disabled and empty', async () => {
                expect(getOverridenFlowCombobox(flowPropertiesEditor).value).toBe('');
                expect(getOverridenFlowCombobox(flowPropertiesEditor).disabled).toBeTruthy();
            });
            describe('when isTemplate checkbox is toggled off', () => {
                beforeAll(() => {
                    const toFalseEvent = new CustomEvent('change', {
                        detail: { checked: false }
                    });
                    getTemplateCheck(flowPropertiesEditor).dispatchEvent(toFalseEvent);
                });
                it('should have isTemplate checkbox enabled and unchecked', async () => {
                    expect(getTemplateCheck(flowPropertiesEditor).checked).toBe(false);
                    expect(getTemplateCheck(flowPropertiesEditor).disabled).toBeFalsy();
                });
                it('should have isOverridable checkbox enabled and unchecked', async () => {
                    expect(getOverridableCheck(flowPropertiesEditor).checked).toBe(false);
                    expect(getOverridableCheck(flowPropertiesEditor).disabled).toBeFalsy();
                });
                it('should have sourceTemplate combobox enabled and empty', async () => {
                    expect(getSourceTemplateCombobox(flowPropertiesEditor).value).toBe('');
                    expect(getSourceTemplateCombobox(flowPropertiesEditor).disabled).toBeFalsy();
                });
                it('should have overriddenFlow combobox enabled and empty', async () => {
                    expect(getOverridenFlowCombobox(flowPropertiesEditor).value).toBe('');
                    expect(getOverridenFlowCombobox(flowPropertiesEditor).disabled).toBeFalsy();
                });
            });
        });
        describe('When isOverridable is set', () => {
            beforeAll(() => {
                defaultNode.isTemplate = false;
                defaultNode.isOverridable = true;
                defaultNode.overriddenFlow = null;
                defaultNode.sourceTemplate = null;
                flowPropertiesEditor = createComponentUnderTest(defaultNode);
                getShowAdvancedButton(flowPropertiesEditor).click();
            });
            beforeEach(async () => {
                await ticks(1);
            });
            it('should have isOverridable checkbox enabled and checked', async () => {
                expect(getOverridableCheck(flowPropertiesEditor).checked).toBe(true);
                expect(getOverridableCheck(flowPropertiesEditor).disabled).toBeFalsy();
            });
            it('should have isTemplate checkbox disabled', async () => {
                expect(getTemplateCheck(flowPropertiesEditor).checked).toBe(false);
                expect(getTemplateCheck(flowPropertiesEditor).disabled).toBeTruthy();
            });
            it('should have sourceTemplate combobox disabled and empty', async () => {
                expect(getSourceTemplateCombobox(flowPropertiesEditor).value).toBe('');
                expect(getSourceTemplateCombobox(flowPropertiesEditor).disabled).toBeTruthy();
            });
            it('should have overriddenFlow combobox disabled and empty', async () => {
                expect(getOverridenFlowCombobox(flowPropertiesEditor).value).toBe('');
                expect(getOverridenFlowCombobox(flowPropertiesEditor).disabled).toBeTruthy();
            });
            describe('when isOverriddable checkbox is toggled off', () => {
                beforeAll(() => {
                    const toFalseEvent = new CustomEvent('change', {
                        detail: { checked: false }
                    });
                    getOverridableCheck(flowPropertiesEditor).dispatchEvent(toFalseEvent);
                });
                it('should have isTemplate checkbox enabled and unchecked', async () => {
                    expect(getTemplateCheck(flowPropertiesEditor).checked).toBe(false);
                    expect(getTemplateCheck(flowPropertiesEditor).disabled).toBeFalsy();
                });
                it('should have isOverridable checkbox enabled and unchecked', async () => {
                    expect(getOverridableCheck(flowPropertiesEditor).checked).toBe(false);
                    expect(getOverridableCheck(flowPropertiesEditor).disabled).toBeFalsy();
                });
                it('should have sourceTemplate combobox enabled and empty', async () => {
                    expect(getSourceTemplateCombobox(flowPropertiesEditor).value).toBe('');
                    expect(getSourceTemplateCombobox(flowPropertiesEditor).disabled).toBeFalsy();
                });
                it('should have overriddenFlow combobox enabled and empty', async () => {
                    expect(getOverridenFlowCombobox(flowPropertiesEditor).value).toBe('');
                    expect(getOverridenFlowCombobox(flowPropertiesEditor).disabled).toBeFalsy();
                });
            });
        });
        describe('When overriddenFlow is set', () => {
            beforeAll(() => {
                defaultNode.isTemplate = false;
                defaultNode.isOverridable = false;
                defaultNode.overriddenFlow = 'Flow1';
                defaultNode.sourceTemplate = null;
                flowPropertiesEditor = createComponentUnderTest(defaultNode);
                getShowAdvancedButton(flowPropertiesEditor).click();
            });
            beforeEach(async () => {
                await ticks(1);
            });
            it('should have isOverridable checkbox disabled', async () => {
                expect(getOverridableCheck(flowPropertiesEditor).checked).toBe(false);
                expect(getOverridableCheck(flowPropertiesEditor).disabled).toBeTruthy();
            });
            it('should have isTemplate checkbox disabled', async () => {
                expect(getTemplateCheck(flowPropertiesEditor).checked).toBe(false);
                expect(getTemplateCheck(flowPropertiesEditor).disabled).toBeTruthy();
            });
            it('should have sourceTemplate combobox disabled and empty', async () => {
                expect(getSourceTemplateCombobox(flowPropertiesEditor).value).toBe('');
                expect(getSourceTemplateCombobox(flowPropertiesEditor).disabled).toBeTruthy();
            });
            it('should have overriddenFlow combobox enabled with a value', async () => {
                expect(getOverridenFlowCombobox(flowPropertiesEditor).value.value).toBe('Flow1');
                expect(getOverridenFlowCombobox(flowPropertiesEditor).disabled).toBeFalsy();
            });
            describe('when overriddenFlow combobox is cleared', () => {
                beforeAll(() => {
                    const toEmptyEvent = new ComboboxStateChangedEvent(null, null, null);
                    getOverridenFlowCombobox(flowPropertiesEditor).dispatchEvent(toEmptyEvent);
                });
                beforeEach(async () => {
                    await ticks(1);
                });
                it('should have isTemplate checkbox enabled and unchecked', async () => {
                    expect(getTemplateCheck(flowPropertiesEditor).checked).toBe(false);
                    expect(getTemplateCheck(flowPropertiesEditor).disabled).toBeFalsy();
                });
                it('should have isOverridable checkbox enabled and unchecked', async () => {
                    expect(getOverridableCheck(flowPropertiesEditor).checked).toBe(false);
                    expect(getOverridableCheck(flowPropertiesEditor).disabled).toBeFalsy();
                });
                it('should have sourceTemplate combobox enabled and empty', async () => {
                    expect(getSourceTemplateCombobox(flowPropertiesEditor).value).toBe('');
                    expect(getSourceTemplateCombobox(flowPropertiesEditor).disabled).toBeFalsy();
                });
                it('should have overriddenFlow combobox enabled and empty', async () => {
                    expect(getOverridenFlowCombobox(flowPropertiesEditor).value).toBe('');
                    expect(getOverridenFlowCombobox(flowPropertiesEditor).disabled).toBeFalsy();
                });
            });
        });
        describe('When sourceTemplate is set', () => {
            beforeAll(() => {
                defaultNode.isTemplate = false;
                defaultNode.isOverridable = false;
                defaultNode.overriddenFlow = null;
                defaultNode.sourceTemplate = 'Temp1';
                flowPropertiesEditor = createComponentUnderTest(defaultNode);
                getShowAdvancedButton(flowPropertiesEditor).click();
            });
            beforeEach(async () => {
                await ticks(1);
            });
            it('should have isOverridable checkbox disabled', async () => {
                expect(getOverridableCheck(flowPropertiesEditor).checked).toBe(false);
                expect(getOverridableCheck(flowPropertiesEditor).disabled).toBeTruthy();
            });
            it('should have isTemplate checkbox disabled', async () => {
                expect(getTemplateCheck(flowPropertiesEditor).checked).toBe(false);
                expect(getTemplateCheck(flowPropertiesEditor).disabled).toBeTruthy();
            });
            it('should have sourceTemplate combobox enabled with a value', async () => {
                expect(getSourceTemplateCombobox(flowPropertiesEditor).value.value).toBe('Temp1');
                expect(getSourceTemplateCombobox(flowPropertiesEditor).disabled).toBeFalsy();
            });
            it('should have overriddenFlow combobox disabled and empty', async () => {
                expect(getOverridenFlowCombobox(flowPropertiesEditor).value).toBe('');
                expect(getOverridenFlowCombobox(flowPropertiesEditor).disabled).toBeTruthy();
            });
            describe('when isTemplate combobox is cleared', () => {
                beforeAll(() => {
                    const toEmptyEvent = new ComboboxStateChangedEvent(null, null, null);
                    getSourceTemplateCombobox(flowPropertiesEditor).dispatchEvent(toEmptyEvent);
                });
                beforeEach(async () => {
                    await ticks(1);
                });
                it('should have isTemplate checkbox enabled and unchecked', async () => {
                    expect(getTemplateCheck(flowPropertiesEditor).checked).toBe(false);
                    expect(getTemplateCheck(flowPropertiesEditor).disabled).toBeFalsy();
                });
                it('should have isOverridable checkbox enabled and unchecked', async () => {
                    expect(getOverridableCheck(flowPropertiesEditor).checked).toBe(false);
                    expect(getOverridableCheck(flowPropertiesEditor).disabled).toBeFalsy();
                });
                it('should have sourceTemplate combobox enabled and empty', async () => {
                    expect(getSourceTemplateCombobox(flowPropertiesEditor).value).toBe('');
                    expect(getSourceTemplateCombobox(flowPropertiesEditor).disabled).toBeFalsy();
                });
                it('should have overriddenFlow combobox enabled and empty', async () => {
                    expect(getOverridenFlowCombobox(flowPropertiesEditor).value).toBe('');
                    expect(getOverridenFlowCombobox(flowPropertiesEditor).disabled).toBeFalsy();
                });
            });
        });
    });
    describe('Test overrides and templates from Save As New Definition', () => {
        let defaultNode;
        beforeAll(() => {
            defaultNode = {
                ...sampleProperties,
                processType: { value: 'AutoLaunchedFlow' },
                triggerType: { value: 'RecordBeforeSave' },
                versionNumber: 1,
                saveType: SaveType.NEW_DEFINITION,
                apiVersion: 50,
                isTemplate: false,
                isOverridable: false,
                overriddenFlow: null,
                sourceTemplate: null
            };
        });
        describe('When isOverridable is set', () => {
            beforeAll(() => {
                defaultNode.isTemplate = false;
                defaultNode.isOverridable = true;
                defaultNode.name = { value: 'Flow1' };
                flowPropertiesEditor = createComponentUnderTest(defaultNode);
                getShowAdvancedButton(flowPropertiesEditor).click();
            });
            beforeEach(async () => {
                await ticks(1);
            });
            it('should have overriddenFlow combobox enabled and set to Flow1', async () => {
                expect(getOverridenFlowCombobox(flowPropertiesEditor).value.value).toBe('Flow1');
                expect(getOverridenFlowCombobox(flowPropertiesEditor).disabled).toBeFalsy();
            });
            it('should have isOverridable checkbox disabled', async () => {
                expect(getOverridableCheck(flowPropertiesEditor).checked).toBe(false);
                expect(getOverridableCheck(flowPropertiesEditor).disabled).toBeTruthy();
            });
            it('should have template related banner', async () => {
                expect(getNewFlowOverridesBanner(flowPropertiesEditor)).not.toBeNull();
                expect(getNewFlowOverridesBanner(flowPropertiesEditor).textContent).toBe(
                    LABELS.newFlowOverrideBannerLabel
                );
            });
        });
        describe('When isTemplate is set', () => {
            beforeAll(() => {
                defaultNode.isTemplate = true;
                defaultNode.isOverridable = false;
                defaultNode.name = { value: 'Temp1' };
                flowPropertiesEditor = createComponentUnderTest(defaultNode);
                getShowAdvancedButton(flowPropertiesEditor).click();
            });
            beforeEach(async () => {
                await ticks(1);
            });
            it('should have sourceTemplate combobox enabled and set to Flow1', async () => {
                expect(getSourceTemplateCombobox(flowPropertiesEditor).value.value).toBe('Temp1');
                expect(getSourceTemplateCombobox(flowPropertiesEditor).disabled).toBeFalsy();
            });
            it('should have isTemplate checkbox disabled', async () => {
                expect(getTemplateCheck(flowPropertiesEditor).checked).toBe(false);
                expect(getTemplateCheck(flowPropertiesEditor).disabled).toBeTruthy();
            });
            it('should have template related banner', async () => {
                expect(getNewFlowOverridesBanner(flowPropertiesEditor)).not.toBeNull();
                expect(getNewFlowOverridesBanner(flowPropertiesEditor).textContent).toBe(
                    LABELS.newSourceTemplateBannerLabel
                );
            });
        });
    });
    // TODO Update some tests to empty values instead of null
    describe('Test overrides and templates from Save As New Version', () => {
        let defaultNode;
        beforeAll(() => {
            defaultNode = {
                ...sampleProperties,
                processType: { value: 'AutoLaunchedFlow' },
                triggerType: { value: 'RecordBeforeSave' },
                versionNumber: 1,
                saveType: SaveType.NEW_VERSION,
                apiVersion: 50,
                isTemplate: false,
                isOverridable: false,
                overriddenFlow: null,
                sourceTemplate: null
            };
        });
        describe('When isOverridable is set', () => {
            beforeAll(() => {
                defaultNode.isTemplate = false;
                defaultNode.isOverridable = true;
                defaultNode.name = { value: 'Flow1' };
                flowPropertiesEditor = createComponentUnderTest(defaultNode);
                getShowAdvancedButton(flowPropertiesEditor).click();
            });
            beforeEach(async () => {
                await ticks(1);
            });
            it('should have overriddenFlow combobox disabled and empty', async () => {
                expect(getOverridenFlowCombobox(flowPropertiesEditor).value).toBe('');
                expect(getOverridenFlowCombobox(flowPropertiesEditor).disabled).toBeTruthy();
            });
            it('should have isOverridable checkbox enabled and checked', async () => {
                expect(getOverridableCheck(flowPropertiesEditor).checked).toBe(true);
                expect(getOverridableCheck(flowPropertiesEditor).disabled).toBeFalsy();
            });
        });
        describe('When isTemplate is set', () => {
            beforeAll(() => {
                defaultNode.isTemplate = true;
                defaultNode.isOverridable = false;
                defaultNode.name = { value: 'Temp1' };
                flowPropertiesEditor = createComponentUnderTest(defaultNode);
                getShowAdvancedButton(flowPropertiesEditor).click();
            });
            beforeEach(async () => {
                await ticks(1);
            });
            it('should have sourceTemplate combobox disabled and empty', async () => {
                expect(getSourceTemplateCombobox(flowPropertiesEditor).value).toBe('');
                expect(getSourceTemplateCombobox(flowPropertiesEditor).disabled).toBeTruthy();
            });
            it('should have isTemplate checkbox enabled and checked', async () => {
                expect(getTemplateCheck(flowPropertiesEditor).checked).toBe(true);
                expect(getTemplateCheck(flowPropertiesEditor).disabled).toBeFalsy();
            });
        });
    });
    describe('Slack check in Flowbuilder', () => {
        let defaultNode;
        beforeAll(() => {
            defaultNode = {
                ...sampleProperties,
                processType: { value: 'Flow' },
                interviewLabel: { value: 'interviewLabel' },
                runInMode: { value: null, error: null },
                status: { value: 'Active' },
                saveType: SaveType.UPDATE,
                triggerType: { value: '' },
                versionNumber: 1,
                environments: ['Slack']
            };
        });
        it('Slack in Flowbuilder checkbox and label is not present when slack perm is off', async () => {
            (orgHasScreenFlowsInSlack as jest.Mock).mockReturnValue(false);
            flowPropertiesEditor = createComponentUnderTest(defaultNode);
            getShowAdvancedButton(flowPropertiesEditor).click();
            await ticks(1);
            const slackCheck = getSlackCheck(flowPropertiesEditor);
            expect(slackCheck).toBeFalsy();
        });
        it('Slack in Flowbuilder checkbox and label is present when slack perm is on', async () => {
            (orgHasScreenFlowsInSlack as jest.Mock).mockReturnValue(true);
            flowPropertiesEditor = createComponentUnderTest(defaultNode);
            getShowAdvancedButton(flowPropertiesEditor).click();
            await ticks(1);
            const slackCheck = getSlackCheck(flowPropertiesEditor);
            expect(slackCheck).toBeTruthy();
        });
    });
    describe('Slack Screen Flows Beta Notice', () => {
        let defaultNode;
        beforeAll(() => {
            defaultNode = {
                ...sampleProperties,
                processType: { value: 'Flow' },
                interviewLabel: { value: 'interviewLabel' },
                runInMode: { value: null, error: null },
                status: { value: 'Active' },
                saveType: SaveType.CREATE,
                triggerType: { value: '' },
                versionNumber: 1,
                environments: ['Slack']
            };
            (orgHasScreenFlowsInSlack as jest.Mock).mockReturnValue(true);
        });
        beforeEach(async () => {
            flowPropertiesEditor = createComponentUnderTest(defaultNode);
            getShowAdvancedButton(flowPropertiesEditor).click();
            await ticks(1);
            dispatchToggleSlackCheckboxEvent(flowPropertiesEditor, true);
            await ticks(1);
        });
        it('Legal Beta Notice is shown if slack checkbox is checked', async () => {
            expect(getLegalNoticePopover(flowPropertiesEditor)).toBeTruthy();
        });
        it('Legal Beta Notice is hidden if user now clicks on hide advanced', async () => {
            getHideAdvancedButton(flowPropertiesEditor).click();
            await ticks(1);
            expect(getLegalNoticePopover(flowPropertiesEditor)).toBeFalsy();
        });
        it('Legal Beta Notice is re-shown if user clicks on hide advanced and then show advanced again', async () => {
            getHideAdvancedButton(flowPropertiesEditor).click();
            await ticks(1);
            expect(getLegalNoticePopover(flowPropertiesEditor)).toBeFalsy();
            getShowAdvancedButton(flowPropertiesEditor).click();
            await ticks(1);
            expect(getLegalNoticePopover(flowPropertiesEditor)).toBeTruthy();
        });
        it('Legal Beta Notice is hidden if process type is changed to something other than screen flow', async () => {
            dispatchChangeProcessTypeEvent(flowPropertiesEditor, FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
            await ticks(1);
            expect(getLegalNoticePopover(flowPropertiesEditor)).toBeFalsy();
        });
        it('Legal Beta Notice is re-shown if process type is changed back to screen flow', async () => {
            dispatchChangeProcessTypeEvent(flowPropertiesEditor, FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
            await ticks(1);
            expect(getLegalNoticePopover(flowPropertiesEditor)).toBeFalsy();
            dispatchChangeProcessTypeEvent(flowPropertiesEditor, FLOW_PROCESS_TYPE.FLOW);
            await ticks(1);
            expect(getLegalNoticePopover(flowPropertiesEditor)).toBeTruthy();
        });
        it('Legal Beta Notice is hidden if user unchecks slack checkbox', async () => {
            dispatchToggleSlackCheckboxEvent(flowPropertiesEditor, false);
            await ticks(1);
            expect(getLegalNoticePopover(flowPropertiesEditor)).toBeFalsy();
        });
        it('Legal Beta Notice is hidden once dismissed', async () => {
            const dismissButton = getLegalNoticePopover(flowPropertiesEditor).shadowRoot.querySelector(
                SELECTORS.LEGAL_POPOVER_DISMISS_BUTTON
            );
            dismissButton.click();
            await ticks(1);
            expect(getLegalNoticePopover(flowPropertiesEditor)).toBeFalsy();
        });
    });
});
