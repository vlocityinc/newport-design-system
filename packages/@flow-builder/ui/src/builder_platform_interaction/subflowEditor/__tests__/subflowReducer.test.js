import { mockSubflowVariables } from 'mock/calloutData';
import { subflowReducer, MERGE_WITH_VARIABLES, REMOVE_UNSET_ASSIGNMENTS } from '../subflowReducer';
import { UpdateParameterItemEvent, DeleteParameterItemEvent } from 'builder_platform_interaction/events';
import { MERGE_WARNING_TYPE } from 'builder_platform_interaction/calloutEditorLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const originalState = {
    "guid": "0302b036-6534-4213-aab1-a22f7999a4d2",
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
        "rowIndex": "67501c16-0fb0-4a25-8b0c-bb933d395b09",
        "name": {
          "value": "inputNumberVariable",
          "error": null
        },
        "value": {
          "value": "3",
          "error": null
        },
        "valueDataType": "Number"
      },
      {
        "rowIndex": "d461606d-cf4c-4bb1-b40b-54bbd4eb1a41",
        "name": {
          "value": "inputNumberVariable",
          "error": null
        },
        "value": {
          "value": "4",
          "error": null
        },
        "valueDataType": "Number"
      },
      {
        "rowIndex": "982416cf-c3bb-4bc3-b189-71ec5c6ee7d3",
        "name": {
          "value": "inputOutputNumberVariable",
          "error": null
        },
        "value": {
          "value": "59627ff3-e137-4deb-9d03-dd2f200afe3f",
          "error": null
        },
        "valueDataType": "reference"
      },
      {
        "rowIndex": "1be7ec41-7dc6-4e3f-98e1-a95f91901b2c",
        "name": {
          "value": "inputTextCollectionVariable",
          "error": null
        },
        "value": {
          "value": "d4d93f60-b466-42e3-8751-1561c65bd08c",
          "error": null
        },
        "valueDataType": "reference"
      },
      {
        "rowIndex": "8143d141-f28a-4c17-aee2-d31f423ec020",
        "name": {
          "value": "inputAccountSObjectVariable",
          "error": null
        },
        "value": {
          "value": "e591de87-a4d4-4d44-9e38-efa9ceb123ab",
          "error": null
        },
        "valueDataType": "reference"
      }
    ],
    "outputAssignments": [
      {
        "rowIndex": "ade1a71a-1f7b-4de1-bd42-3aace88ea956",
        "name": {
          "value": "outputNumberVariable",
          "error": null
        },
        "value": {
          "value": "9d772fad-a141-4883-8493-d477a9ed5759",
          "error": null
        },
        "valueDataType": "reference"
      }
    ],
    "availableConnections": [],
    "maxConnections": 1,
    "elementType": ELEMENT_TYPE.SUBFLOW
  };

const getParameterItemsWithName = (parameterItems, name) => parameterItems.filter(parameterItem => parameterItem.name === name);

describe('subflowReducer', () => {
    describe('MERGE_WITH_VARIABLES event', () => {
        let newState;
        beforeEach(() => {
            const event = new CustomEvent(MERGE_WITH_VARIABLES, { detail : mockSubflowVariables });
            newState = subflowReducer(originalState, event);
        });
        it('merges assignments with variables', () => {
          expect(getParameterItemsWithName(originalState.inputAssignments, 'inputAccountCollectionVariable')).toHaveLength(0);
          expect(getParameterItemsWithName(newState.inputAssignments, 'inputAccountCollectionVariable')).toHaveLength(1);
          expect(getParameterItemsWithName(originalState.outputAssignments, 'inputOutputNumberVariable')).toHaveLength(0);
          expect(getParameterItemsWithName(newState.outputAssignments, 'inputOutputNumberVariable')).toHaveLength(1);
        });
    });
    describe('REMOVE_UNSET_ASSIGNMENTS event', () => {
        let newState;
        beforeEach(() => {
          let event = new CustomEvent(MERGE_WITH_VARIABLES, { detail : mockSubflowVariables });
          newState = subflowReducer(originalState, event);
          event = new CustomEvent(REMOVE_UNSET_ASSIGNMENTS);
          newState = subflowReducer(newState, event);
        });
        it('removes input assignments that are not set from the ui model', () => {
          expect(newState.inputAssignments).toHaveLength(originalState.inputAssignments.length);
          expect(getParameterItemsWithName(newState.inputAssignments, 'inputAccountCollectionVariable')).toHaveLength(0);
        });
        it('removes output assignments that are not set from the ui model', () => {
          expect(newState.outputAssignments).toHaveLength(originalState.outputAssignments.length);
          expect(getParameterItemsWithName(newState.outputAssignments, 'inputOutputNumberVariable')).toHaveLength(0);
        });
    });

    describe('UpdateParameterItemEvent', () => {
      let newState;
      beforeEach(() => {
          const event = new CustomEvent(MERGE_WITH_VARIABLES, { detail : mockSubflowVariables });
          newState = subflowReducer(originalState, event);
      });
      it('updates assignment', () => {
          const rowId = '67501c16-0fb0-4a25-8b0c-bb933d395b09';
          const value = '8';
          const valueDataType = 'Number';
          const event = new UpdateParameterItemEvent(true, rowId, 'inputNumberVariable', value, valueDataType);
          newState = subflowReducer(newState, event);
          expect(getParameterItemsWithName(newState.inputAssignments, 'inputNumberVariable')[0].value.value).toEqual('8');
      });
      it('updates assignment correctly when there are several assignments using same variable', () => {
        const rowId = 'd461606d-cf4c-4bb1-b40b-54bbd4eb1a41';
        const value = '8';
        const valueDataType = 'Number';
        const event = new UpdateParameterItemEvent(true, rowId, 'inputNumberVariable', value, valueDataType);
        newState = subflowReducer(newState, event);
        expect(getParameterItemsWithName(newState.inputAssignments, 'inputNumberVariable')[0].value.value).toEqual('3');
        expect(getParameterItemsWithName(newState.inputAssignments, 'inputNumberVariable')[1].value.value).toEqual('8');
      });
      it('updates the error for the assignment', () => {
        const rowId = '67501c16-0fb0-4a25-8b0c-bb933d395b09';
        const value = 'invalid value';
        const valueDataType = 'Number';
        const error = 'Entered an invalid value';
        const event = new UpdateParameterItemEvent(true, rowId, 'inputNumberVariable', value, valueDataType, error);
        newState = subflowReducer(newState, event);
        expect(getParameterItemsWithName(newState.inputAssignments, 'inputNumberVariable')[0].value).toEqual({"error": "Entered an invalid value", "value": "invalid value"});
      });
      it('set the value to null when we unset an assignment', () => {
        const rowId = '67501c16-0fb0-4a25-8b0c-bb933d395b09';
        const value = null;
        const valueDataType = 'Number';
        const event = new UpdateParameterItemEvent(true, rowId, 'inputNumberVariable', value, valueDataType);
        newState = subflowReducer(newState, event);
        expect(getParameterItemsWithName(newState.inputAssignments, 'inputNumberVariable')[0].value).toEqual({"value": null, "error": null});
      });
      it('set the value to null when we assign an empty string to an output parameter', () => {
          const rowId = 'ade1a71a-1f7b-4de1-bd42-3aace88ea956';
          const value = '';
          const valueDataType = 'Number';
          const event = new UpdateParameterItemEvent(false, rowId, 'outputNumberVariable', value, valueDataType);
          newState = subflowReducer(newState, event);
          expect(getParameterItemsWithName(newState.outputAssignments, 'outputNumberVariable')[0].value).toEqual({"value": null, "error": null});
        });
    });
    describe('DeleteParameterItemEvent', () => {
        let newState;
        beforeEach(() => {
            const event = new CustomEvent(MERGE_WITH_VARIABLES, { detail : mockSubflowVariables });
            newState = subflowReducer(originalState, event);
        });
        it('deletes the assignment', () => {
          const rowIndex = 'd461606d-cf4c-4bb1-b40b-54bbd4eb1a41';
          const event = new DeleteParameterItemEvent(true, rowIndex, 'inputNumberVariable');
          newState = subflowReducer(newState, event);
          const inputNumberVariableParameterItems = getParameterItemsWithName(newState.inputAssignments, 'inputNumberVariable');
          expect(inputNumberVariableParameterItems).toHaveLength(1);
          expect(inputNumberVariableParameterItems[0].value.value).toEqual('3');
        });
        it('removes duplicate warning if there is no more duplicate', () => {
            let inputNumberVariableParameterItems = getParameterItemsWithName(newState.inputAssignments, 'inputNumberVariable');
            expect(inputNumberVariableParameterItems[0].warnings).toEqual([MERGE_WARNING_TYPE.DUPLICATE]);
            expect(inputNumberVariableParameterItems[1].warnings).toEqual([MERGE_WARNING_TYPE.DUPLICATE]);
            const rowIndex = inputNumberVariableParameterItems[1].rowIndex;
            const event = new DeleteParameterItemEvent(true, rowIndex, 'inputNumberVariable');
            newState = subflowReducer(newState, event);
            inputNumberVariableParameterItems = getParameterItemsWithName(newState.inputAssignments, 'inputNumberVariable');
            expect(inputNumberVariableParameterItems).toHaveLength(1);
            expect(inputNumberVariableParameterItems[0].warnings).toEqual([]);
        });
    });
});