import { createElement } from 'lwc';
import { getProcessTypesMenuData } from 'builder_platform_interaction/expressionUtils';
import FlowPropertiesEditor from '../flowPropertiesEditor';
import { SaveType } from 'builder_platform_interaction/saveType';
import { LABELS } from '../flowPropertiesEditorLabels';
import normalizeDateTime from 'builder_platform_interaction/dateTimeUtils';
import format from 'builder_platform_interaction/commonUtils';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

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
                }
            ];
        }
    };
});

const mockDateTimeString = 'some date time string';
jest.mock('builder_platform_interaction/dateTimeUtils', () => {
    return {
        getFormat: require.requireActual('../../dateTimeUtils/dateTimeUtils.js')
            .getFormat,
        normalizeDateTime: jest.fn()
    };
});

normalizeDateTime.normalizeDateTime = jest.fn(() => {
    return mockDateTimeString;
});

const mockFormattedLabel = 'some user last saved at some date time string';
jest.mock('builder_platform_interaction/commonUtils', () => {
    return {
        format: jest.fn(),
        isUndefinedOrNull: jest.fn(),
        addCurlyBraces: require.requireActual(
            '../../commonUtils/commonUtils.js'
        ).addCurlyBraces,
        removeCurlyBraces: jest.fn()
    };
});

format.format = jest.fn(() => {
    return mockFormattedLabel;
});

const createComponentUnderTest = node => {
    const el = createElement(
        'builder_platform_interaction-flowPropertiesEditor',
        { is: FlowPropertiesEditor }
    );
    el.node = node;
    document.body.appendChild(el);
    return el;
};

const selectors = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    FLOW_TYPE: 'lightning-combobox',
    SAVE_AS_TOGGLE: 'lightning-radio-group',
    SHOW_ADVANCED: '.show-advanced-button',
    HIDE_ADVANCED: '.hide-advanced-button',
    ADVANCED_PROPERTIES: 'div.advanced',
    LAST_PROCESS_TYPE: 'div.lastProcessType',
    LAST_MODIFIED: 'div.lastModified',
    VERSION_NUMBER: 'div.versionNumber',
    RESOURCE_TEXT_AREA: 'builder_platform_interaction-resourced-textarea'
};

const getLabelDescription = flowPropertiesEditor => {
    return flowPropertiesEditor.shadowRoot.querySelector(
        selectors.LABEL_DESCRIPTION
    );
};

const getProcessType = flowPropertiesEditor => {
    return flowPropertiesEditor.shadowRoot.querySelector(selectors.FLOW_TYPE);
};

const getShowAdvancedButton = flowPropertiesEditor => {
    return flowPropertiesEditor.shadowRoot.querySelector(
        selectors.SHOW_ADVANCED
    );
};

const getHideAdvancedButton = flowPropertiesEditor => {
    return flowPropertiesEditor.shadowRoot.querySelector(
        selectors.HIDE_ADVANCED
    );
};

const getAdvancedProperties = flowPropertiesEditor => {
    return flowPropertiesEditor.shadowRoot.querySelector(
        selectors.ADVANCED_PROPERTIES
    );
};

const getLastModifiedDetails = flowPropertiesEditor => {
    return flowPropertiesEditor.shadowRoot.querySelector(
        selectors.LAST_MODIFIED
    );
};

const getResourceTextArea = flowPropertiesEditor => {
    return flowPropertiesEditor.shadowRoot.querySelector(
        selectors.RESOURCE_TEXT_AREA
    );
};

const getLastProcessType = flowPropertiesEditor => {
    return flowPropertiesEditor.shadowRoot.querySelector(
        selectors.LAST_PROCESS_TYPE
    );
};

const getSaveAsToggle = flowPropertiesEditor => {
    return flowPropertiesEditor.shadowRoot.querySelector(
        selectors.SAVE_AS_TOGGLE
    );
};

const dispatchLabelChangedEvent = (
    flowPropertiesEditor,
    newLabelValue,
    error
) => {
    const event = new PropertyChangedEvent('label', newLabelValue, error);
    const labelDescription = getLabelDescription(flowPropertiesEditor);
    labelDescription.dispatchEvent(event);
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
                const labelDescription = getLabelDescription(
                    flowPropertiesEditor
                );
                expect(labelDescription).toBeDefined();
                expect(labelDescription.label.value).toBe('');
                expect(labelDescription.label.error).toBeNull();
                expect(labelDescription.devName.value).toBe('');
                expect(labelDescription.devName.error).toBeNull();
                expect(labelDescription.description.value).toBe('');
                expect(labelDescription.description.error).toBeNull();
            });
            it('handles the property changed event and updates the property', () => {
                const event = new PropertyChangedEvent(
                    'description',
                    'new desc',
                    null
                );
                const labelDescription = getLabelDescription(
                    flowPropertiesEditor
                );
                labelDescription.dispatchEvent(event);
                expect(flowPropertiesEditor.node.description.value).toBe(
                    'new desc'
                );
            });
            describe('Updating the flow label', () => {
                it('should update the interview label if it is blank', () => {
                    dispatchLabelChangedEvent(
                        flowPropertiesEditor,
                        'new label',
                        null
                    );
                    expect(flowPropertiesEditor.node.interviewLabel.value).toBe(
                        'new label {!$Flow.CurrentDateTime}'
                    );
                });
                it('should not update the interview label if the flow label has an error', () => {
                    dispatchLabelChangedEvent(
                        flowPropertiesEditor,
                        'new label',
                        'error'
                    );
                    expect(flowPropertiesEditor.node.interviewLabel.value).toBe(
                        ''
                    );
                });
                it('should not update the interview label if it already has a value', () => {
                    flowProperties.interviewLabel.value = 'old interview label';
                    dispatchLabelChangedEvent(
                        flowPropertiesEditor,
                        'new label',
                        'error'
                    );
                    expect(flowPropertiesEditor.node.interviewLabel.value).toBe(
                        'old interview label'
                    );
                });
            });
        });
        describe('Advanced Properties', () => {
            it('HIDE Advanced Properties', () => {
                const showAdvancedButton = getShowAdvancedButton(
                    flowPropertiesEditor
                );
                expect(showAdvancedButton.label).toBe(LABELS.showAdvanced);
                expect(getHideAdvancedButton(flowPropertiesEditor)).toBeNull();
                expect(getAdvancedProperties(flowPropertiesEditor)).toBeNull();
                expect(getProcessType(flowPropertiesEditor)).toBeNull();
                expect(getResourceTextArea(flowPropertiesEditor)).toBeNull();
            });
            it('SHOW Advanced Properties', () => {
                const showAdvancedButton = getShowAdvancedButton(
                    flowPropertiesEditor
                );
                showAdvancedButton.click();
                return Promise.resolve().then(() => {
                    expect(
                        getShowAdvancedButton(flowPropertiesEditor)
                    ).toBeNull();
                    expect(
                        getHideAdvancedButton(flowPropertiesEditor).label
                    ).toBe(LABELS.hideAdvanced);
                    expect(
                        getAdvancedProperties(flowPropertiesEditor)
                    ).not.toBeNull();
                    expect(getProcessType(flowPropertiesEditor)).toBeDefined();
                    expect(getProcessType(flowPropertiesEditor).value).toBe(
                        'process type'
                    );
                    expect(
                        getResourceTextArea(flowPropertiesEditor).value.value
                    ).toBe('');
                    expect(
                        getResourceTextArea(flowPropertiesEditor).value.error
                    ).toBeNull();
                });
            });
            it('Last Modified Information should NOT be shown for saveType CREATE', () => {
                expect(getLastModifiedDetails(flowPropertiesEditor)).toBeNull();
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
                saveType: SaveType.UPDATE
            };
            flowPropertiesEditor = createComponentUnderTest(flowProperties);
        });
        describe('Label Description', () => {
            it('check existing values', () => {
                const labelDescription = getLabelDescription(
                    flowPropertiesEditor
                );
                expect(labelDescription).toBeDefined();
                expect(labelDescription.label.value).toBe(
                    flowProperties.label.value
                );
                expect(labelDescription.devName.value).toBe(
                    flowProperties.name.value
                );
                expect(labelDescription.description.value).toBe(
                    flowProperties.description.value
                );
            });
        });
        describe('Advanced Properties', () => {
            it('SHOW Advanced Properties', () => {
                expect(
                    getShowAdvancedButton(flowPropertiesEditor)
                ).toBeDefined();
                expect(getHideAdvancedButton(flowPropertiesEditor)).toBeNull();
                expect(getShowAdvancedButton(flowPropertiesEditor).label).toBe(
                    LABELS.showAdvanced
                );
                getShowAdvancedButton(flowPropertiesEditor).click();
                return Promise.resolve().then(() => {
                    expect(
                        getAdvancedProperties(flowPropertiesEditor)
                    ).not.toBeNull();
                    expect(
                        getResourceTextArea(flowPropertiesEditor).value.value
                    ).toBe(flowProperties.interviewLabel.value);
                });
            });
            describe('Last Modified Information', () => {
                it('returns the localized label with the correct user name and last modified date/time', () => {
                    getShowAdvancedButton(flowPropertiesEditor).click();
                    return Promise.resolve().then(() => {
                        expect(
                            getLastModifiedDetails(flowPropertiesEditor)
                                .textContent
                        ).toEqual(mockFormattedLabel);
                    });
                });
                it('calls normalizeDateTime with the the last modified datetime', () => {
                    getShowAdvancedButton(flowPropertiesEditor).click();
                    return Promise.resolve().then(() => {
                        expect(
                            normalizeDateTime.normalizeDateTime
                        ).toHaveBeenCalledWith(
                            flowPropertiesEditor.node.lastModifiedDate.value,
                            true
                        );
                    });
                });
                it('calls format with the label, user and datetime', () => {
                    getShowAdvancedButton(flowPropertiesEditor).click();
                    return Promise.resolve().then(() => {
                        expect(format.format).toHaveBeenCalledWith(
                            LABELS.lastModifiedText,
                            flowPropertiesEditor.node.lastModifiedBy.value,
                            mockDateTimeString
                        );
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
                saveType: SaveType.UPDATE
            };
            flowPropertiesEditor = createComponentUnderTest(flowProperties);
            getShowAdvancedButton(flowPropertiesEditor).click();
            return Promise.resolve().then(() => {
                expect(
                    getLastProcessType(flowPropertiesEditor).textContent
                ).toEqual('');
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
                saveType: SaveType.UPDATE
            };
            flowPropertiesEditor = createComponentUnderTest(flowProperties);
            getShowAdvancedButton(flowPropertiesEditor).click();
            return Promise.resolve().then(() => {
                expect(
                    getLastProcessType(flowPropertiesEditor).textContent
                ).toEqual(processTypes[1].label);
            });
        });

        describe('versionNumber', () => {
            let defaultNode;
            beforeEach(() => {
                defaultNode = {
                    label: { value: 'flow label' },
                    name: { value: 'flow name' },
                    description: { value: 'flow description' },
                    processType: { value: 'process type' },
                    status: { value: 'Active' },
                    interviewLabel: { value: 'interviewLabel' },
                    lastModifiedBy: { value: 'some user' },
                    lastModifiedDate: { value: '2018-11-12T19:25:22.000+0000' },
                    versionNumber: 1,
                    saveType: SaveType.UPDATE
                };
            });

            it('is shown when save type is UPDATE', () => {
                const component = createComponentUnderTest(defaultNode);
                getShowAdvancedButton(component).click();
                return Promise.resolve().then(() => {
                    expect(
                        component.shadowRoot.querySelector(
                            selectors.VERSION_NUMBER
                        )
                    ).not.toBeNull();
                });
            });

            it('is shown when save type is NEW_VERSION', () => {
                defaultNode.saveType = SaveType.NEW_VERSION;
                const component = createComponentUnderTest(defaultNode);
                getShowAdvancedButton(component).click();
                return Promise.resolve().then(() => {
                    expect(
                        component.shadowRoot.querySelector(
                            selectors.VERSION_NUMBER
                        )
                    ).not.toBeNull();
                });
            });
        });

        describe('Toggle between save as types', () => {
            let defaultNode;
            beforeEach(() => {
                defaultNode = {
                    label: { value: 'flow label' },
                    name: { value: 'flow name' },
                    description: { value: 'flow description' },
                    processType: { value: 'process type' },
                    status: { value: 'Active' },
                    interviewLabel: { value: 'interviewLabel' },
                    versionNumber: 1,
                    saveType: SaveType.NEW_DEFINITION
                };
            });

            it('restores the original flow property values when toggling back to New Version', () => {
                flowPropertiesEditor = createComponentUnderTest(defaultNode);
                const event = new PropertyChangedEvent(
                    'interviewLabel',
                    'new label',
                    null
                );
                const labelDescription = getLabelDescription(
                    flowPropertiesEditor
                );
                labelDescription.dispatchEvent(event);
                // This first expect is to ensure the test is not a false positive
                expect(flowPropertiesEditor.node.interviewLabel.value).toBe(
                    'new label'
                );
                getSaveAsToggle(flowPropertiesEditor).dispatchEvent(
                    new CustomEvent('change', {
                        detail: { value: SaveType.NEW_VERSION }
                    })
                );
                expect(flowPropertiesEditor.node.interviewLabel.value).toBe(
                    'interviewLabel'
                );
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
});
