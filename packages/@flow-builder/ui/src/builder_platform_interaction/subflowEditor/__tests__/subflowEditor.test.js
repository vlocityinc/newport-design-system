import { createElement } from 'lwc';
import SubflowEditor from "../subflowEditor";
import { mockSubflows } from 'mock/actionSelectorData';
import { mockSubflowVariables} from 'mock/calloutData';
import { getShadowRoot } from 'lwc-test-utils';

const createComponentUnderTest = (node) => {
    const el = createElement('builder_platform_interaction-subflow-editor', { is: SubflowEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
};

const commonUtils = require.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest.fn().mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');


jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce : (serverActionType) => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_SUBFLOWS:
                    return Promise.resolve(mockSubflows);
                case SERVER_ACTION_TYPE.GET_FLOW_INPUT_OUTPUT_VARIABLES:
                    return Promise.resolve(mockSubflowVariables);
                default:
                    return Promise.reject();
            }
        }
    };
});

const subflowNode = {
    "guid": "024b2345-97d2-4e67-952b-6cd326a54570",
    "name": {
      "value": "subflowCall2",
      "error": null
    },
    "description": {
      "value": "",
      "error": null
    },
    "label": {
      "value": "subflowCall2",
      "error": null
    },
    "locationX": 561,
    "locationY": 190,
    "isCanvasElement": true,
    "connectorCount": 1,
    "config": {
      "isSelected": true
    },
    "flowName": {
      "value": "mynamespace__subflow",
      "error": null
    },
    "inputAssignments": [
      {
        "rowIndex": "fb1782fd-1434-41dc-89ff-675f209be855",
        "name": {
          "value": "inputNumberVariable",
          "error": null
        },
        "value": {
          "value": "3",
          "error": null
        },
        "valueDataType": "Number"
      }
    ],
    "outputAssignments": [
      {
        "rowIndex": "84499160-72eb-4c03-baa7-ee5641f80477",
        "name": {
          "value": "outputNumberVariable",
          "error": null
        },
        "value": {
          "value": "4e1bdeca-511b-4741-80cb-65ce67aa8a59",
          "error": null
        },
        "valueDataType": "reference"
      }
    ],
    "availableConnections": [],
    "maxConnections": 1,
    "elementType": "SUBFLOW"
  };

const selectors = {
        baseCalloutEditor: 'builder_platform_interaction-base-callout-editor'
    };

const getBaseCalloutEditor = (subflowEditor) => {
    return getShadowRoot(subflowEditor).querySelector(selectors.baseCalloutEditor);
};

describe('subflow-editor', () => {
    let subflowEditor;
    describe('Edit existing subflow', () => {
        beforeEach(() => {
            subflowEditor = createComponentUnderTest(subflowNode);
        });
        it('should display a subtitle including the subflow label', () => {
            const baseCalloutEditor = getBaseCalloutEditor(subflowEditor);
            expect(baseCalloutEditor.subtitle).toBe('FlowBuilderSubflowEditor.subtitle(my subflow)');
        });
    });
});