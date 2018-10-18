import { createElement } from 'lwc';
import ApexPluginEditor from "../apexPluginEditor";
import { apexPluginValidation } from "../apexPluginValidation.js";
import { getErrorsFromHydratedElement } from "builder_platform_interaction/dataMutationLib";

const createComponentForTest = (node) => {
    const el = createElement('builder_platform_interaction-apex-plugin-editor', { is: ApexPluginEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
};

const validate = (node) => {
    return getErrorsFromHydratedElement(apexPluginValidation.validateAll(node));
};

describe('Apex Plugin Editor Validation', () => {
    let apexPluginNode;
    beforeEach(() => {
        apexPluginNode = {
                apexClass: {value: 'flowchat', error: null},
                description : {value: '', error: null},
                elementType : 'APEX_PLUGIN_CALL',
                guid : '6b35c757-1d0f-442e-acb6-6ac8f098ea1f',
                isCanvasElemen : true,
                label : {value: 'flowchat', error: null},
                locationX : 5,
                locationY : 165,
                name : {value: 'flowchat', error: null},
                inputParameters : [
                    {
                        rowIndex: '2067b573-86d6-4bd7-b906-8fc01a7e889a',
                        isInput: true,
                        isRequired: true,
                        dataType: 'String',
                        name: 'Name',
                        value: {
                          value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                          error: null
                        },
                        valueDataType: 'reference',
                      },
                      {
                          rowIndex: 'd58427c8-7db3-458c-b698-a2de1ed3f2f0',
                          isInput: true,
                          isRequired: true,
                          dataType: 'String',
                          name: 'Phone',
                          value: {
                            value: '0123456789',
                            error: null
                          },
                          valueDataType: 'String',
                      }
                ],
                outputParameters: [
                    {
                        rowIndex: '41d02758-f34f-4207-9bf2-42e2c9930100',
                        isInput: false,
                        isRequired: false,
                        dataType: 'String',
                        name: 'AccountId',
                        value: {
                          value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                          error: null
                        },
                        valueDataType: 'reference',
                    }
                ]
        };
    });
    describe('node is valid', () => {
        it('returns no errors', () => {
            const apexPluginEditor = createComponentForTest(apexPluginNode);
            const errors = validate(apexPluginEditor.node);
            expect(errors).toHaveLength(0);
        });
    });
    describe('no label', () => {
        it('should return an error', () => {
            apexPluginNode.label.value = '';
            const apexPluginEditor = createComponentForTest(apexPluginNode);
            const errors = validate(apexPluginEditor.node);
            expect(errors).toEqual([{"errorString": "FlowBuilderValidation.cannotBeBlank", "key": "label"}]);
        });
    });
    describe('no apiName', () => {
        it('should return an error', () => {
            apexPluginNode.name.value = '';
            const apexPluginEditor = createComponentForTest(apexPluginNode);
            const errors = validate(apexPluginEditor.node);
            expect(errors).toEqual([{"errorString": "FlowBuilderValidation.cannotBeBlank", "key": "name"}]);
        });
    });
    describe('required input parameter is not valid', () => {
        it('should return an error if Name is null', () => {
            apexPluginNode.inputParameters[0].value.value = null;
            const apexPluginEditor = createComponentForTest(apexPluginNode);
            const errors = validate(apexPluginEditor.node);
            expect(errors).toEqual([{"errorString": "FlowBuilderValidation.cannotBeBlank", "key": "value"}]);
        });
        it('should return an error if Name is blank', () => {
            apexPluginNode.inputParameters[0].value.value = '';
            const apexPluginEditor = createComponentForTest(apexPluginNode);
            const errors = validate(apexPluginEditor.node);
            expect(errors).toEqual([{"errorString": "FlowBuilderValidation.cannotBeBlank", "key": "value"}]);
        });
    });
});