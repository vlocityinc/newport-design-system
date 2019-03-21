import { getConfigForElementType } from "builder_platform_interaction/elementConfig";
import { getDataTypeIcons } from "builder_platform_interaction/dataTypeLib";
import { resourceFilter } from "builder_platform_interaction/filterLib";
import { labelComparator, nameComparator } from "builder_platform_interaction/sortLib";
import { getResourceSections } from "../resourceLib";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

/**
 * A sample store state retrieved using JSON stringify.
 */
const STATE_EMPTY = {
    "elements": {
        "STARTELEMENT_0": {
            "guid": "STARTELEMENT_0",
            "elementType": "START_ELEMENT",
            "label": "Start",
            "locationX": 50,
            "locationY": 50,
            "config": {
                "isSelected": false
            },
            "maxConnections": 1,
            "connectorCount": 0
        }
    },
    "properties": {
        "processType": "AutoLaunchedFlow",
        "elementType": "FLOW_PROPERTIES"
    },
    "canvasElements": ["STARTELEMENT_0"],
    "connectors": []
};

/**
 * A sample store state retrieved using JSON stringify.
 */
const STATE_NON_EMPTY = {
    "elements": {
        "STARTELEMENT_0": {
            "guid": "STARTELEMENT_0",
            "elementType": "START_ELEMENT",
            "label": "Start",
            "locationX": 50,
            "locationY": 50,
            "config": {
                "isSelected": false
            },
            "maxConnections": 1,
            "connectorCount": 1
        },
        "ASSIGNMENT_1": {
            "assignmentItems": [{
                "assignToReference": "VARIABLE_5",
                "operator": "Assign",
                "processMetadataValues": []
            }],
            "label": "Assignment One",
            "locationX": 249,
            "locationY": 109,
            "name": "Assignment_One",
            "processMetadataValues": [],
            "elementType": ELEMENT_TYPE.ASSIGNMENT,
            "guid": "Assignment_1",
            "isCanvasElement": true,
            "config": {
                "isSelected": false
            },
            "connectorCount": 1,
            "maxConnections": 1
        },
        "ASSIGNMENT_2": {
            "assignmentItems": [{
                "assignToReference": "VARIABLE_6",
                "operator": "Assign",
                "processMetadataValues": []
            }],
            "label": "Assignment Two",
            "locationX": 429,
            "locationY": 306,
            "name": "Assignment_Two",
            "processMetadataValues": [],
            "elementType": ELEMENT_TYPE.ASSIGNMENT,
            "guid": "Assignment_2",
            "isCanvasElement": true,
            "config": {
                "isSelected": false
            },
            "connectorCount": 0,
            "maxConnections": 1
        },
        "OUTCOME_4": {
            "conditionLogic": "and",
            "conditions": [{
                "leftValueReference": "VARIABLE_5",
                "operator": "EqualTo",
                "processMetadataValues": [],
                "rightValue": {
                    "stringValue": "abc"
                }
            }],
            "label": "Outcome One",
            "name": "Outcome_One",
            "processMetadataValues": [],
            "dataType": "Boolean",
            "elementType": "OUTCOME",
            "guid": "OUTCOME_4",
            "isCanvasElement": false
        },
        "DECISION_3": {
            "defaultConnectorLabel": "[Default Outcome]",
            "label": "Decision One",
            "locationX": 429,
            "locationY": 109,
            "name": "Decision_One",
            "processMetadataValues": [],
            "elementType": ELEMENT_TYPE.DECISION,
            "guid": "Decision_3",
            "isCanvasElement": true,
            "config": {
                "isSelected": false
            },
            "outcomeReferences": [{
                "outcomeReference": "OUTCOME_4"
            }],
            "availableConnections": [{
                "type": "DEFAULT"
            }],
            "connectorCount": 1,
            "maxConnections": 2
        },
        "VARIABLE_5": {
            "dataType": "String",
            "isCollection": false,
            "isInput": false,
            "isOutput": false,
            "name": "VariableOne",
            "processMetadataValues": [],
            "scale": 0,
            "elementType": ELEMENT_TYPE.VARIABLE,
            "guid": "Variable_5",
            "isCanvasElement": false
        },
        "VARIABLE_6": {
            "dataType": "String",
            "isCollection": false,
            "isInput": false,
            "isOutput": false,
            "name": "VariableTwo",
            "processMetadataValues": [],
            "scale": 0,
            "elementType": ELEMENT_TYPE.VARIABLE,
            "guid": "Variable_6",
            "isCanvasElement": false
        },
        "FORMULA_7": {
            "dataType": "String",
            "expression": "'Hello, World!'",
            "name": "FormulaOne",
            "processMetadataValues": [],
            "scale": 0,
            "elementType": ELEMENT_TYPE.FORMULA,
            "guid": "Formula_7",
            "isCanvasElement": false
        }
    },
    "properties": {
        "processType": "AutoLaunchedFlow",
        "elementType": "FLOW_PROPERTIES",
        "label": "Simple",
        "fullName": "Simple",
        "versionNumber": 1
    },
    "canvasElements": ["STARTELEMENT_0", "ASSIGNMENT_1", "ASSIGNMENT_2", "DECISION_3"],
    "connectors": [{
        "guid": "CONNECTOR_8",
        "source": "STARTELEMENT_0",
        "childSource": null,
        "target": "ASSIGNMENT_1",
        "label": null,
        "type": "START",
        "config": {
            "isSelected": false
        }
    }, {
        "guid": "CONNECTOR_9",
        "source": "ASSIGNMENT_1",
        "childSource": null,
        "target": "DECISION_3",
        "label": null,
        "type": "REGULAR",
        "config": {
            "isSelected": false
        }
    }, {
        "guid": "CONNECTOR_10",
        "source": "DECISION_3",
        "childSource": "OUTCOME_4",
        "target": "ASSIGNMENT_2",
        "label": "Outcome One",
        "type": "REGULAR",
        "config": {
            "isSelected": false
        }
    }]
};

function getExpectedSectionCounts(state) {
    const expectedSectionCounts = Object.keys(state.elements).reduce((acc, guid) => {
        const element = state.elements[guid];
        if (element.elementType === 'START_ELEMENT') {
            return acc;
        }
        const config = getConfigForElementType(element.elementType);
        const label = config.labels.plural;
        if (!acc[label]) {
            acc[label] = 0;
        }
        acc[label]++;
        return acc;
    }, {});
    return expectedSectionCounts;
}

function verifyItem(item) {
    expect(item.elementType).not.toBe('START_ELEMENT');
    expect(item).toHaveProperty('elementType');
    expect(item.guid).toMatch(new RegExp('^' + item.elementType + '_'));
    expect(item).toHaveProperty('label');

    if ((item.elementType === ELEMENT_TYPE.VARIABLE || item.elementType === ELEMENT_TYPE.FORMULA) && item.dataType) {
        const iconName = getDataTypeIcons(item.dataType, 'utility');
        expect(item.iconName).toMatch(iconName);
    }
}

function verifySection(section, expectedSectionCounts) {
    expect(section.guid).toBeDefined();
    expect(section.guid).not.toBe('');

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
    expect(count).toEqual(expectedSectionCounts[section.label]);
}

function verifyGroup(sections, expectedSectionCounts) {
    let previousLabel;
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        verifySection(section, expectedSectionCounts);

        // Verify that the sections are sorted in ascending order.
        if (!previousLabel) {
            previousLabel = section.label;
        } else {
            expect(section.label.toUpperCase() >= previousLabel.toUpperCase()).toBe(true);
            previousLabel = section.label;
        }
    }
}

describe('resource-lib', () => {
    describe('When flow is empty', () => {
        it('should be handled gracefully', () => {
            const canvasElements = getResourceSections(STATE_EMPTY.elements, resourceFilter(true), labelComparator);
            const nonCanvasElements = getResourceSections(STATE_EMPTY.elements, resourceFilter(false), nameComparator);
            expect(canvasElements).toHaveLength(0);
            expect(nonCanvasElements).toHaveLength(0);
        });
    });

    describe('When flow has resources', () => {
        it('should return resources excluding START_ELEMENT with expected values for the resource tab of the left-panel', () => {
            const canvasElements = getResourceSections(STATE_NON_EMPTY.elements, resourceFilter(true), labelComparator);
            const nonCanvasElements = getResourceSections(STATE_NON_EMPTY.elements, resourceFilter(false), nameComparator);
            const expectedSectionCounts = getExpectedSectionCounts(STATE_NON_EMPTY);
            verifyGroup(canvasElements, expectedSectionCounts);
            verifyGroup(nonCanvasElements, expectedSectionCounts);
        });
    });
});