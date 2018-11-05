import {getPropertyEditorConfig} from "../builderUtils";

const EDIT_MODE = 'editelement',
    ADD_MODE = 'addelement';

const getAttributes = mode => ({
        mode,
        node: {
          guid: "d9e45a91-1dae-4acc-a0a8-69e0b316abe2",
          name: {
            value: "record delete",
            error: null
          },
          description: {
            value: "not a very good description I know",
            error: null
          },
          label: {
            value: "record_delete",
            error: null
          },
          locationX: 356,
          locationY: 130,
          isCanvasElement: true,
          connectorCount: 1,
          config: {
            isSelected: true
          },
          inputReference: {
            value: "",
            error: null
          },
          object: {
            value: "Account",
            error: null
          },
          filters: [
            {
              rowIndex: "81effde1-9e6f-4ff7-b879-bfd65538c509",
              leftHandSide: {
                value: "Account.BillingCity",
                error: null
              },
              rightHandSide: {
                value: "CA",
                error: null
              },
              rightHandSideDataType: {
                value: "String",
                error: null
              },
              operator: {
                value: "EqualTo",
                error: null
              }
            }],
          maxConnections: 2,
          availableConnections: [
            {
              type: "FAULT"
            }
          ],
          elementType: "RECORD_DELETE",
          dataType: {
            value: "Boolean",
            error: null
          }
        },
        nodeUpdate : jest.fn()

});

describe('builderUtils', () => {
    describe('Property Editor Config', () => {
        describe('Editor mode (edit, add) correctly returned', () => {
            const modePropertyNestedPath = 'attr.bodyComponent.attr.mode';
            test('Edit mode', () => {
                const actualResult = getPropertyEditorConfig(EDIT_MODE, getAttributes(EDIT_MODE));
                expect(actualResult).toHaveProperty(modePropertyNestedPath, EDIT_MODE);
            });
            test('Add mode', () => {
                const actualResult = getPropertyEditorConfig(ADD_MODE, getAttributes(ADD_MODE));
                expect(actualResult).toHaveProperty(modePropertyNestedPath, ADD_MODE);
            });
        });
    });
});