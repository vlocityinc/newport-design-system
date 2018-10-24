import { mergeSubflowAssignmentsWithInputOutputVariables } from "../subflowParametersMerger";
import { MERGE_WARNING_TYPE } from "../mergeWarningType";

const numberVariableDescription = (name, { isInput, isOutput }) => ({
        "dataType": "Number",
        isInput,
        isOutput,
        name,
        "processMetadataValues": [],
        "scale": 2
      });
const stringVariableDescription = (name, { isInput, isOutput }) => ({
        "dataType": "String",
        isInput,
        isOutput,
        name,
        "processMetadataValues": [],
      });


const inputNumberVariableDescription = (name = "inputNumberVariable") => numberVariableDescription(name, { isInput : true, isOutput : false });
const outputNumberVariableDescription = (name = "outputNumberVariable") => numberVariableDescription(name, { isInput : false, isOutput : true });
const inputOutputNumberVariableDescription = (name = "inputOutputNumberVariable") => numberVariableDescription(name, { isInput : true, isOutput : true });

const inputStringVariableDescription = (name = "inputStringVariable") => stringVariableDescription(name, { isInput : true, isOutput : false });

const subflowVariableAssignmentToReference = (referencedVariableName, masterVariableName) => ({
        "rowIndex": "c6516d24-7fdc-40d8-bb85-602e41ccb1d2",
        "name": {
          "value": referencedVariableName,
          "error": null
        },
        "value": {
          "value": masterVariableName,
          "error": null
        },
        "valueDataType": "reference"
      });

const subflowVariableAssignmentToNumber = (referencedVariableName, value = 0) => ({
        "rowIndex": "e816e6ae-60cb-451b-a5cd-7faef66ec950",
        "name": {
          "value": referencedVariableName,
          "error": null
        },
        "value": {
          "value": value.toString(),
          "error": null
        },
        "valueDataType": "Number"
      });

const getParameterItem = (parameterItems, name) => parameterItems.find(parameterItem => parameterItem.name === name);

describe('Subflow parameters merger', () => {
    let inputOutputVariablesVersions;
    let nodeInputAssignments;
    let nodeOutputAssignments;
    describe('When there is only one version for variables', () => {
        beforeEach(() => {
            inputOutputVariablesVersions = [{
                  "variables": [inputNumberVariableDescription('inputNumberVariable'),
                                inputOutputNumberVariableDescription('inputOutputNumberVariable'),
                                outputNumberVariableDescription('outputNumberVariable')],
                  "isLatestVersion": true,
                  "isActiveVersion": false
                }];
            nodeInputAssignments = [subflowVariableAssignmentToReference('inputNumberVariable', 'numberVariable'),
                                    subflowVariableAssignmentToNumber('inputOutputNumberVariable', '2')];
            nodeOutputAssignments = [subflowVariableAssignmentToReference('inputOutputNumberVariable', 'numberVariable'),
                                     subflowVariableAssignmentToReference('outputNumberVariable', 'numberVariable2')];
        });
        it('merges node parameters with the variables from this version', () => {
            const { inputs, outputs }  = mergeSubflowAssignmentsWithInputOutputVariables(nodeInputAssignments, nodeOutputAssignments, inputOutputVariablesVersions);
            expect(inputs).toHaveLength(2);
            expect(outputs).toHaveLength(2);
            const parameterItem = getParameterItem(inputs, 'inputNumberVariable');
            expect(parameterItem).toEqual(
                    { "dataType": "Number", "isInput": true, "isRequired": false, "label": "inputNumberVariable", "name": "inputNumberVariable", "value": {"error": null, "value": "numberVariable"}, "valueDataType": "reference", "rowIndex" : expect.any(String) });
        });
    });
    describe('When there is a latest version and an active version for variables', () => {
      beforeEach(() => {
          inputOutputVariablesVersions = [
            {
              "variables": [inputNumberVariableDescription('inputVariable'),
                            inputOutputNumberVariableDescription('inputOutputNumberVariable'),
                            outputNumberVariableDescription('outputNumberVariable'),
                            outputNumberVariableDescription('onlyInActiveVersionVariable')],
              "isLatestVersion": false,
              "isActiveVersion": true
            }, {
              "variables": [inputStringVariableDescription('inputVariable'),
                            inputOutputNumberVariableDescription('inputOutputNumberVariable'),
                            outputNumberVariableDescription('outputNumberVariable'),
                            outputNumberVariableDescription('onlyInLatestVersionVariable')
                          ],
              "isLatestVersion": true,
              "isActiveVersion": false
            }];
          nodeInputAssignments = [subflowVariableAssignmentToReference('inputVariable', 'numberVariable'),
                                  subflowVariableAssignmentToNumber('inputOutputNumberVariable', '2')];
          nodeOutputAssignments = [subflowVariableAssignmentToReference('inputOutputNumberVariable', 'numberVariable'),
                                   subflowVariableAssignmentToReference('outputNumberVariable', 'numberVariable2')];
      });
      it('uses the active version if variable is both in active and latest version', () => {
          const { inputs }  = mergeSubflowAssignmentsWithInputOutputVariables(nodeInputAssignments, nodeOutputAssignments, inputOutputVariablesVersions);
          const parameterItemInput = getParameterItem(inputs, 'inputVariable');
          expect(parameterItemInput).toMatchObject(
            { "dataType": "Number", "value": {"error": null, "value": "numberVariable"} });
      });
      it('uses the latest version if variable is only in latest version', () => {
        const { outputs }  = mergeSubflowAssignmentsWithInputOutputVariables(nodeInputAssignments, nodeOutputAssignments, inputOutputVariablesVersions);
        const parameterItemOutput = getParameterItem(outputs, 'onlyInLatestVersionVariable');
        expect(parameterItemOutput).toBeDefined();
      });
      it('generates a ONLY_AVAILABLE_IN_LATEST warning if variable is only in latest version', () => {
          const { outputs }  = mergeSubflowAssignmentsWithInputOutputVariables(nodeInputAssignments, nodeOutputAssignments, inputOutputVariablesVersions);
          const parameterItemOutput = getParameterItem(outputs, 'onlyInLatestVersionVariable');
          expect(parameterItemOutput.warnings).toEqual([MERGE_WARNING_TYPE.ONLY_AVAILABLE_IN_LATEST]);
        });
      it('generates a ONLY_AVAILABLE_IN_ACTIVE warning if variable is only in active version', () => {
          const { outputs }  = mergeSubflowAssignmentsWithInputOutputVariables(nodeInputAssignments, nodeOutputAssignments, inputOutputVariablesVersions);
          const parameterItemOutput = getParameterItem(outputs, 'onlyInActiveVersionVariable');
          expect(parameterItemOutput.warnings).toEqual([MERGE_WARNING_TYPE.ONLY_AVAILABLE_IN_ACTIVE]);
        });
      it('generates a DATA_TYPE_CHANGED warning if type has changed between active and latest version', () => {
          const { inputs }  = mergeSubflowAssignmentsWithInputOutputVariables(nodeInputAssignments, nodeOutputAssignments, inputOutputVariablesVersions);
          const parameterItemInput = getParameterItem(inputs, 'inputVariable');
          expect(parameterItemInput.warnings).toEqual([MERGE_WARNING_TYPE.DATA_TYPE_CHANGED]);
      });
    });
    describe('When a variable is both an input and output variable', () => {
        beforeEach(() => {
            inputOutputVariablesVersions = [{
                  "variables": [inputOutputNumberVariableDescription('inputOutputNumberVariable')],
                  "isLatestVersion": true,
                  "isActiveVersion": false
                }];
        });
        it('generates a parameterItem both for input and output', () => {
            nodeInputAssignments = [];
            nodeOutputAssignments = [];
            const { inputs, outputs }  = mergeSubflowAssignmentsWithInputOutputVariables(nodeInputAssignments, nodeOutputAssignments, inputOutputVariablesVersions);
            expect(inputs).toHaveLength(1);
            expect(outputs).toHaveLength(1);
            const parameterItemInput = getParameterItem(inputs, 'inputOutputNumberVariable');
            const parameterItemOutput = getParameterItem(outputs, 'inputOutputNumberVariable');
            expect(parameterItemInput.isInput).toBe(true);
            expect(parameterItemOutput.isInput).toBe(false);
        });
    });
    describe('When there is no variable in the referenced flow for the assignment', () => {
        beforeEach(() => {
          inputOutputVariablesVersions = [{
              "variables": [],
              "isLatestVersion": true,
              "isActiveVersion": false
            }];
        nodeInputAssignments = [subflowVariableAssignmentToReference('inputVariable', 'numberVariable')];
        nodeOutputAssignments = [];
      });
      it('generates a parameter item with datatype String', () => {
        const { inputs }  = mergeSubflowAssignmentsWithInputOutputVariables(nodeInputAssignments, nodeOutputAssignments, inputOutputVariablesVersions);
        const parameterItem = getParameterItem(inputs, 'inputVariable');
        expect(parameterItem.dataType).toEqual('String');
      });
      it('generates a parameter item with notAvailableInSubflow warning', () => {
          const { inputs }  = mergeSubflowAssignmentsWithInputOutputVariables(nodeInputAssignments, nodeOutputAssignments, inputOutputVariablesVersions);
          const parameterItem = getParameterItem(inputs, 'inputVariable');
          expect(parameterItem.warnings).toEqual([MERGE_WARNING_TYPE.NOT_AVAILABLE]);
      });
    });
    describe('When there is no assignment for a given variable', () => {
      beforeEach(() => {
          inputOutputVariablesVersions = [{
              "variables": [inputNumberVariableDescription('inputVariable')],
              "isLatestVersion": true,
              "isActiveVersion": true
            }];
          nodeInputAssignments = [];
          nodeOutputAssignments = [];
      });
      it('generates a parameter item without value and valueDataType', () => {
        const { inputs }  = mergeSubflowAssignmentsWithInputOutputVariables(nodeInputAssignments, nodeOutputAssignments, inputOutputVariablesVersions);
        const parameterItem = getParameterItem(inputs, 'inputVariable');
        expect(parameterItem).toEqual(
          { "dataType": "Number", "isInput": true, "isRequired": false, "label": "inputVariable", "name": "inputVariable", "rowIndex" : expect.any(String)});
      });
    });
    describe('When a variable is assigned several times', () => {
        // note that assigning a variable several times is only possible in CFD
        beforeEach(() => {
            inputOutputVariablesVersions = [{
                  "variables": [inputNumberVariableDescription('inputVariable'), outputNumberVariableDescription('outputVariable')],
                  "isLatestVersion": true,
                  "isActiveVersion": false
                }];
        });
        it('generates a parameterItem for each output assignment with this variable', () => {
            nodeInputAssignments = [];
            nodeOutputAssignments = [subflowVariableAssignmentToReference('outputVariable', 'masterVariable1'),
                                     subflowVariableAssignmentToReference('outputVariable', 'masterVariable2')];
            const { inputs, outputs }  = mergeSubflowAssignmentsWithInputOutputVariables(nodeInputAssignments, nodeOutputAssignments, inputOutputVariablesVersions);
            expect(inputs).toHaveLength(1);
            expect(outputs).toHaveLength(2);
            expect(outputs[0]).toMatchObject(
              { "isInput": false, "name": "outputVariable", "value": {"error": null, "value": "masterVariable1"}, "valueDataType": "reference"});
              expect(outputs[1]).toMatchObject(
              { "isInput": false, "name": "outputVariable", "value": {"error": null, "value": "masterVariable2"}, "valueDataType": "reference"});
        });
        it('generates a parameterItem for each input assignment with this variable', () => {
            nodeInputAssignments = [subflowVariableAssignmentToReference('inputVariable', 'masterVariable1'),
                                    subflowVariableAssignmentToReference('inputVariable', 'masterVariable2')];
            nodeOutputAssignments = [];
            const { inputs, outputs }  = mergeSubflowAssignmentsWithInputOutputVariables(nodeInputAssignments, nodeOutputAssignments, inputOutputVariablesVersions);
            expect(inputs).toHaveLength(2);
            expect(outputs).toHaveLength(1);
            expect(inputs[0]).toMatchObject(
              { "isInput": true, "name": "inputVariable", "value": {"error": null, "value": "masterVariable1"}, "valueDataType": "reference"});
            expect(inputs[1]).toMatchObject(
              { "isInput": true, "name": "inputVariable", "value": {"error": null, "value": "masterVariable2"}, "valueDataType": "reference"});
        });
        it('generates a parameterItem with duplicate warning', () => {
            nodeInputAssignments = [subflowVariableAssignmentToReference('inputVariable', 'masterVariable1'),
                                    subflowVariableAssignmentToReference('inputVariable', 'masterVariable2')];
            nodeOutputAssignments = [];
            const { inputs }  = mergeSubflowAssignmentsWithInputOutputVariables(nodeInputAssignments, nodeOutputAssignments, inputOutputVariablesVersions);
            expect(inputs).toHaveLength(2);
            expect(inputs[0].warnings).toEqual([MERGE_WARNING_TYPE.DUPLICATE]);
            expect(inputs[1].warnings).toEqual([MERGE_WARNING_TYPE.DUPLICATE]);
        });
    });
});
