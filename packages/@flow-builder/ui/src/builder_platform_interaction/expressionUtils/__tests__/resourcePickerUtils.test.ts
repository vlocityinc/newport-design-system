// @ts-nocheck
import { getMenuData } from '../resourcePickerUtils';
import { filterAndMutateMenuData, filterFieldsForChosenElement } from '../menuDataRetrieval';
import { getStoreElements } from '../storeElementsFilter';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { setGlobalVariables } from 'builder_platform_interaction_mocks/systemLib';
import { mockGlobalVariablesWithMultiPicklistField } from 'mock/globalVariableData';

const paramTypes = ['paramType'];

let resourcePicker;

const objectName = 'Account';
const parentItem = {
    dataType: FLOW_DATA_TYPE.SOBJECT.value,
    subtype: objectName
};

const parentGlobalItem = {
    subtype: '$Organization'
};

const fields = ['field1'];
const elements = ['element1'];
const storeInstance = {
    getCurrentState() {
        return elements;
    }
};

jest.mock('../menuDataRetrieval', () => {
    return {
        getChildrenItemsPromise: jest.requireActual('../menuDataRetrieval').getChildrenItemsPromise,
        filterFieldsForChosenElement: jest.fn(),
        filterAndMutateMenuData: jest.fn()
    };
});

jest.mock('../storeElementsFilter', () => ({
    getStoreElements: jest.fn((storeState) => {
        return storeState;
    })
}));

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        fetchFieldsForEntity: jest.fn(() => {
            return Promise.resolve(['field2']);
        })
    };
});

describe('resourcePickerUtils', () => {
    describe('Get field menudata', () => {
        beforeEach(() => {
            resourcePicker = {
                populateParamTypes() {
                    return paramTypes;
                }
            };
        });

        it('returns a promise that contains array of field menu data once settled', async () => {
            const mockFieldMenuData = ['field2'];
            filterFieldsForChosenElement.mockReturnValueOnce(mockFieldMenuData);

            const result = await getMenuData(null, null, resourcePicker.populateParamTypes, null, parentItem, null, {
                allowGlobalConstants: false,
                enableFieldDrilldown: false,
                includeNewResource: true
            });
            expect(result).toEqual(['field2']);
        });

        it('Should filter the fields when the fields already have been loaded', async () => {
            await getMenuData(null, null, resourcePicker.populateParamTypes, null, parentItem, fields, {
                allowGlobalConstants: false,
                enableFieldDrilldown: false,
                includeNewResource: true,
                allowSObjectFieldsTraversal: true
            });
            expect(filterFieldsForChosenElement).toHaveBeenCalledWith(parentItem, fields, {
                allowSObjectFields: true,
                allowedParamTypes: paramTypes,
                allowSObjectFieldsTraversal: true,
                allowElementFields: true,
                showAsFieldReference: true,
                showSubText: true,
                selectorConfig: null,
                shouldBeWritable: false
            });
        });

        it('Should filter the fields after waiting for the fields to load', async () => {
            await getMenuData(null, null, resourcePicker.populateParamTypes, null, parentItem, null, {
                allowedParamTypes: paramTypes,
                showAsFieldReference: true,
                showSubText: true
            });
            expect(fetchFieldsForEntity).toHaveBeenCalledWith(objectName, {
                disableErrorModal: true
            });
            expect(filterFieldsForChosenElement).toHaveBeenCalledWith(parentItem, ['field2'], {
                allowSObjectFields: true,
                allowedParamTypes: paramTypes,
                allowElementFields: true,
                showAsFieldReference: true,
                showSubText: true,
                allowSObjectFieldsTraversal: true,
                selectorConfig: null,
                shouldBeWritable: false
            });
        });

        it('Should hide multipicklist global variable fields by default', async () => {
            setGlobalVariables(mockGlobalVariablesWithMultiPicklistField);
            filterFieldsForChosenElement.mockImplementation((chosenElement, fieldz) => {
                return fieldz;
            });

            const result = await getMenuData(
                null,
                null,
                resourcePicker.populateParamTypes,
                null,
                parentGlobalItem,
                null,
                {
                    allowGlobalConstants: false,
                    enableFieldDrilldown: false,
                    includeNewResource: true
                }
            );
            expect(result['$Organization.Country']).toBeDefined();
            expect(result['$Organization.MP__c']).not.toBeDefined();
        });
        it('Should show multipicklist global variable fields for formula editor', async () => {
            setGlobalVariables(mockGlobalVariablesWithMultiPicklistField);
            filterFieldsForChosenElement.mockImplementation((chosenElement, fieldz) => {
                return fieldz;
            });

            const result = await getMenuData(
                null,
                null,
                resourcePicker.populateParamTypes,
                null,
                parentGlobalItem,
                null,
                {
                    allowGlobalConstants: false,
                    enableFieldDrilldown: false,
                    includeNewResource: true,
                    forFormula: true
                }
            );
            expect(result['$Organization.Country']).toBeDefined();
            expect(result['$Organization.MP__c']).toBeDefined();
        });
    });

    describe('Get FEROV menudata', () => {
        beforeEach(() => {
            resourcePicker = {
                populateParamTypes() {
                    return paramTypes;
                },
                propertyEditorElementType: 'Assignment',
                allowGlobalConstants: true,
                enableFieldDrilldown: false
            };
        });

        it('returns a promise that gives an array of element menu data once settled', async () => {
            const mockMenuData = ['foo'];
            filterAndMutateMenuData.mockReturnValueOnce(mockMenuData);

            const result = await getMenuData(
                'elementConfig',
                resourcePicker.propertyEditorElementType,
                resourcePicker.populateParamTypes,
                storeInstance,
                null,
                null,
                {
                    allowGlobalConstants: resourcePicker.allowGlobalConstants,
                    enableFieldDrilldown: resourcePicker.enableFieldDrilldown,
                    includeNewResource: false
                }
            );
            expect(result).toEqual(mockMenuData);
        });

        it('Should get menu data when there is no element config', async () => {
            await getMenuData(
                null,
                resourcePicker.propertyEditorElementType,
                resourcePicker.populateParamTypes,
                storeInstance,
                null,
                null,
                {
                    allowGlobalConstants: resourcePicker.allowGlobalConstants,
                    enableFieldDrilldown: resourcePicker.enableFieldDrilldown,
                    includeNewResource: true
                }
            );
            expect(getStoreElements).toHaveBeenCalledWith(elements, {
                elementType: 'Assignment'
            });
            expect(filterAndMutateMenuData).toHaveBeenCalledTimes(1);
            expect(filterAndMutateMenuData).toHaveBeenCalledWith(elements, paramTypes, {
                includeNewResource: true,
                activePicklistValues: [],
                allowGlobalConstants: true,
                disableHasNext: true,
                showSystemVariables: true,
                showGlobalVariables: true,
                allowSObjectField: true,
                allowsApexCollAnonymousAutoOutput: true,
                forFormula: false,
                newResourceTypeLabel: null,
                shouldBeWritable: false
            });
        });

        it('Should get menu data when there is element config and we do not want new resource option', async () => {
            await getMenuData(
                'elementConfig',
                resourcePicker.propertyEditorElementType,
                resourcePicker.populateParamTypes,
                storeInstance,
                null,
                null,
                {
                    allowGlobalConstants: resourcePicker.allowGlobalConstants,
                    enableFieldDrilldown: resourcePicker.enableFieldDrilldown,
                    includeNewResource: false
                }
            );
            expect(getStoreElements).toHaveBeenCalledWith(elements, 'elementConfig');
            expect(filterAndMutateMenuData).toHaveBeenCalledTimes(1);
            expect(filterAndMutateMenuData).toHaveBeenCalledWith(elements, paramTypes, {
                includeNewResource: false,
                newResourceTypeLabel: null,
                activePicklistValues: [],
                allowGlobalConstants: true,
                disableHasNext: true,
                showSystemVariables: true,
                showGlobalVariables: true,
                allowSObjectField: true,
                allowsApexCollAnonymousAutoOutput: undefined,
                forFormula: false
            });
        });

        it('should show multipicklist global variables for formula editor', async () => {
            await getMenuData(
                'elementConfig',
                resourcePicker.propertyEditorElementType,
                resourcePicker.populateParamTypes,
                storeInstance,
                null,
                null,
                {
                    allowGlobalConstants: resourcePicker.allowGlobalConstants,
                    enableFieldDrilldown: resourcePicker.enableFieldDrilldown,
                    includeNewResource: false,
                    forFormula: true
                }
            );
            expect(filterAndMutateMenuData).toHaveBeenCalledTimes(1);
            expect(filterAndMutateMenuData).toHaveBeenCalledWith(elements, paramTypes, {
                includeNewResource: false,
                newResourceTypeLabel: null,
                activePicklistValues: [],
                allowGlobalConstants: true,
                disableHasNext: true,
                showSystemVariables: true,
                showGlobalVariables: true,
                allowSObjectField: true,
                allowsApexCollAnonymousAutoOutput: undefined,
                forFormula: true
            });
        });

        it('should not show global variables if showGlobalVariables is false', async () => {
            await getMenuData(
                'elementConfig',
                resourcePicker.propertyEditorElementType,
                resourcePicker.populateParamTypes,
                storeInstance,
                null,
                null,
                {
                    allowGlobalConstants: resourcePicker.allowGlobalConstants,
                    enableFieldDrilldown: resourcePicker.enableFieldDrilldown,
                    includeNewResource: false,
                    showGlobalVariables: false
                }
            );
            expect(filterAndMutateMenuData).toHaveBeenCalledTimes(1);
            expect(filterAndMutateMenuData).toHaveBeenCalledWith(elements, paramTypes, {
                includeNewResource: false,
                newResourceTypeLabel: null,
                activePicklistValues: [],
                allowGlobalConstants: true,
                disableHasNext: true,
                showSystemVariables: true,
                showGlobalVariables: false,
                allowSObjectField: true,
                allowsApexCollAnonymousAutoOutput: undefined,
                forFormula: false
            });
        });
    });
});
