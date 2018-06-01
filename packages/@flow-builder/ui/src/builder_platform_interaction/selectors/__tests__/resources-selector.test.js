import { resourceSectionsSelector } from '../resources-selector';
import { getConfigForElementType } from 'builder_platform_interaction-element-config';

jest.mock('builder_platform_interaction-store-lib', () => {
    return {
        createSelector: (selectors, transformation) => {
            return function selector(state) {
                const dataFromSelectors = selectors.map(arg => arg(state));
                return transformation(...dataFromSelectors);
            };
        },
        generateGuid: (prefix) => {
            return prefix;
        }
    };
});

const STATE_EMPTY = {
    elements: {},
    canvasElements: [],
    resources: []
};

/**
 * A sample store state retrieved using JSON stringify and parse.
 */
const STATE_NON_EMPTY = {
    "elements": {
        "STARTELEMENT_0": {
            "connector": {
                "processMetadataValues": [],
                "targetReference": "ASSIGNMENT_1",
                "config": {
                    "isSelected": false
                }
            },
            "processMetadataValues": [],
            "elementType": "START_ELEMENT",
            "config": {
                "isSelected": false
            },
            "maxConnections": 1,
            "connectorCount": 1,
            "guid": "STARTELEMENT_0"
        },
        "ASSIGNMENT_1": {
            "assignmentItems": [{
                "assignToReference": "VARIABLE_5",
                "operator": "Assign",
                "processMetadataValues": [],
                "value": {
                    "stringValue": "def"
                }
            }],
            "connector": {
                "processMetadataValues": [],
                "targetReference": "DECISION_3",
                "config": {
                    "isSelected": false
                }
            },
            "label": "Assignment Two",
            "locationX": 321,
            "locationY": 66,
            "name": "Assignment_Two",
            "processMetadataValues": [],
            "elementType": "ASSIGNMENT",
            "isCanvasElement": true,
            "config": {
                "isSelected": false
            },
            "maxConnections": 1,
            "connectorCount": 1,
            "guid": "ASSIGNMENT_1"
        },
        "OUTCOME_2": {
            "conditionLogic": "and",
            "conditions": [{
                "leftValueReference": "VARIABLE_4",
                "operator": "EqualTo",
                "processMetadataValues": [],
                "rightValue": {
                    "stringValue": "abc"
                }
            }],
            "label": "Outcome One",
            "name": "Outcome_One",
            "processMetadataValues": [],
            "elementType": "OUTCOME",
            "isCanvasElement": false,
            "guid": "OUTCOME_2"
        },
        "DECISION_3": {
            "defaultConnectorLabel": "[Default Outcome]",
            "label": "Decision One",
            "locationX": 525,
            "locationY": 69,
            "name": "Decision_One",
            "processMetadataValues": [],
            "elementType": "DECISION",
            "isCanvasElement": true,
            "config": {
                "isSelected": false
            },
            "maxConnections": 1,
            "connectorCount": 0,
            "outcomeReferences": [{
                "outcomeReference": "OUTCOME_2"
            }],
            "guid": "DECISION_3"
        },
        "VARIABLE_4": {
            "dataType": "String",
            "isCollection": false,
            "isInput": false,
            "isOutput": false,
            "name": "VariableOne",
            "processMetadataValues": [],
            "scale": 0,
            "elementType": "VARIABLE",
            "isCanvasElement": false,
            "guid": "VARIABLE_4"
        },
        "VARIABLE_5": {
            "dataType": "String",
            "isCollection": false,
            "isInput": false,
            "isOutput": false,
            "name": "VariableTwo",
            "processMetadataValues": [],
            "scale": 0,
            "elementType": "VARIABLE",
            "isCanvasElement": false,
            "guid": "VARIABLE_5"
        },
        "FORMULA_8": {
            "dataType": "Number",
            "expression": "2+2",
            "name": "myFormula",
            "processMetadataValues": [],
            "scale": 2,
            "elementType": "FORMULA",
            "guid": "FORMULA_8",
            "isCanvasElement": false
        }
    },
    "connectors": [{
        "guid": "CONNECTOR_6",
        "source": "ASSIGNMENT_0",
        "target": "ASSIGNMENT_1",
        "label": "Label",
        "config": {
            "isSelected": false
        }
    }, {
        "guid": "CONNECTOR_7",
        "source": "ASSIGNMENT_1",
        "target": "DECISION_3",
        "label": "Label",
        "config": {
            "isSelected": false
        }
    }],
    "resources": ["VARIABLE_4", "VARIABLE_5", "FORMULA_8"],
    "canvasElements": ["STARTELEMENT_0", "ASSIGNMENT_1", "DECISION_3"],
    "properties": {
        "label": "Assignment and Decision",
        "interviewLabel": "Assignment and Decision {!$Flow.CurrentDateTime}",
        "processType": "AutoLaunchedFlow",
        "fullName": "Assignment_and_Decision-1"
    },
    "outcomes": ["OUTCOME_2"],
    "startElement": "STARTELEMENT_0"
};

function verifyItem(item) {
    expect(item.elementType).not.toBe('START_ELEMENT');
    expect(item).toHaveProperty('elementType');
    expect(item.guid).toMatch(new RegExp('^' + item.elementType + '_'));
    expect(item).toHaveProperty('label');

    const config = getConfigForElementType(item.elementType);
    if (config.canvasElement) {
        expect(item).not.toHaveProperty('iconName');
    } else {
        expect(item.iconName).toMatch(config.nodeConfig.iconName);
    }
}

function verifySection(section) {
    expect(section.guid).toMatch(new RegExp('^RESOURCES_PALETTE_SECTION'));

    // Empty sections should not be included.
    expect(section).toHaveProperty('_children');
    expect(section._children.length).toBeGreaterThan(0);

    const count = section._children.length;
    let elementType, previousLabel;
    for (let i = 0; i < count; i++) {
        const item = section._children[i];
        verifyItem(item);

        // Verify that all items are of the same type.
        if (!elementType) {
            elementType = item.elementType;
        } else {
            expect(item.elementType).toEqual(elementType);
        }

        // Verify that the items are sorted in ascending order.
        if (!previousLabel) {
            previousLabel = item.label;
        } else {
            expect(item.label.toUpperCase() >= previousLabel.toUpperCase()).toBe(true);
            previousLabel = item.label;
        }
    }

    const config = getConfigForElementType(elementType);
    expect(section.label).toEqual(config.labels.plural);
}

function verifyResources(resources) {
    // TODO: Verify that the order of sections is correct, order is TBD.
    for (let i = 0; i < resources.length; i++) {
        const section = resources[i];
        verifySection(section);
    }
}

describe('resourcesSelector', () => {
    describe('When flow is empty', () => {
        it('should be handled gracefully', () => {
            const resources = resourceSectionsSelector(STATE_EMPTY);
            expect(resources).toHaveLength(0);
        });
    });

    describe('When flow has resources', () => {
        it('should return resources excluding START_ELEMENT with expected values for the resource tab of the left-panel', () => {
            const resources = resourceSectionsSelector(STATE_NON_EMPTY);
            verifyResources(resources);
        });
        it('should have a non-empty section for formulas', () => {
            const resources = resourceSectionsSelector(STATE_NON_EMPTY);
            const formulaSections = resources.filter(section => section.label === 'Formulas');
            expect(formulaSections).toHaveLength(1);
        });
        it('should return empty section for Start Elements', () => {
            const resources = resourceSectionsSelector(STATE_NON_EMPTY);
            const unCategorizedSections = resources.filter(section => section.label === 'Uncategorized');
            expect(unCategorizedSections).toHaveLength(0);
        });
    });
});