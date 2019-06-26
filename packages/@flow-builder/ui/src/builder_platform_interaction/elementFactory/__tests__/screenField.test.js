import {
    createScreenField,
    createScreenFieldMetadataObject
} from '../screenField';
import { deepFindMatchers } from 'builder_platform_interaction/builderTestUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

expect.extend(deepFindMatchers);

const componentAutomaticScreenFieldMetadata = () => ({
    choiceReferences: [],
    extensionName: 'flowruntime:email',
    fieldType: 'ComponentInstance',
    inputParameters: [
        {
            name: 'placeholder',
            value: {
                stringValue: 'your email address'
            }
        }
    ],
    visibilityRule: {
        conditionLogic: 'and',
        conditions: [
            {
                operator: 'EqualTo'
            }
        ]
    },
    isRequired: true,
    name: 'myEmail',
    outputParameters: [],
    scale: 0,
    storeOutputAutomatically: true
});

const componentAutomaticScreenFieldStore = () => ({
    guid: '06001014-dce2-4206-add3-d73bdcc38174',
    name: 'myEmail',
    choiceReferences: [],
    dataType: 'LightningComponentOutput',
    defaultValue: '',
    defaultValueIndex: '5d457ada-a9de-41b0-8225-847942f4f69b',
    validationRule: {
        formulaExpression: null,
        errorMessage: null
    },
    extensionName: 'flowruntime:email',
    fieldType: 'ComponentInstance',
    fieldText: '',
    helpText: '',
    inputParameters: [
        {
            rowIndex: '9950e933-80b8-4352-b1d1-3c186f502765',
            name: 'placeholder',
            value: 'your email address',
            valueDataType: 'String'
        }
    ],
    isNewField: false,
    isRequired: true,
    outputParameters: [],
    scale: '0',
    type: {
        name: 'flowruntime:email',
        fieldType: 'ComponentInstance',
        label: 'flowruntime:email',
        icon: 'standard:lightning_component',
        source: 'local'
    },
    elementType: 'SCREEN_FIELD',
    visibilityRule: {
        conditionLogic: 'and',
        conditions: [
            {
                operator: 'EqualTo'
            }
        ]
    },
    storeOutputAutomatically: true
});

describe('screenField', () => {
    describe('screenField flow metadata => UI model', () => {
        describe('LC screen field with automatic output handling', () => {
            let screenFieldMetadata;
            beforeEach(() => {
                screenFieldMetadata = componentAutomaticScreenFieldMetadata();
            });
            it('has no common mutable object with screen field metadata passed as parameter', () => {
                const actualResult = createScreenField(screenFieldMetadata);
                expect(actualResult).toHaveNoCommonMutableObjectWith(
                    screenFieldMetadata
                );
            });
            it('"outputParameters" should be an empty array', () => {
                const actualResult = createScreenField(screenFieldMetadata);
                expect(actualResult.outputParameters).toEqual([]);
            });
            it('should have a LIGHTNING_COMPONENT_OUTPUT datatype', () => {
                const actualResult = createScreenField(screenFieldMetadata);
                expect(actualResult.dataType).toBe(
                    FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value
                );
                expect(actualResult.isCollection).toBeFalsy();
                expect(actualResult.subtype).toBeFalsy();
            });
            it('"storeOutputAutomatically" should be true', () => {
                const actualResult = createScreenField(screenFieldMetadata);
                expect(actualResult.storeOutputAutomatically).toBe(true);
            });
        });
    });
    describe('screenField UI model => flow metadata', () => {
        describe('LC screen field with automatic output handling', () => {
            it('convert to flow metadata', () => {
                const actualResult = createScreenFieldMetadataObject(
                    componentAutomaticScreenFieldStore()
                );

                expect(actualResult).toMatchObject(
                    componentAutomaticScreenFieldMetadata()
                );
            });
            it('has no common mutable object with screen field from store passed as parameter', () => {
                const screenFieldStore = componentAutomaticScreenFieldStore();
                const actualResult = createScreenFieldMetadataObject(
                    screenFieldStore
                );
                expect(actualResult).toHaveNoCommonMutableObjectWith(
                    screenFieldStore
                );
            });
        });
    });
});
