// @ts-nocheck
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { setGlobalVariables } from 'builder_platform_interaction_mocks/systemLib';
import { mockGlobalVariablesWithMultiPicklistField } from 'mock/globalVariableData';
import { filterAndMutateMenuData, filterFieldsForChosenElement } from '../menuDataRetrieval';
import { getMenuData } from '../resourcePickerUtils';
import { getStoreElements } from '../storeElementsFilter';

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
const state = {
    elements,
    properties: {
        processType: 'someProcessType'
    }
};

const storeInstance = {
    getCurrentState() {
        return state;
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
                traversalConfig: {
                    isEnabled: false
                },
                filter: {
                    allowGlobalConstants: false,
                    includeNewResource: true
                }
            });
            expect(result).toEqual(['field2']);
        });

        it('Should filter the fields when the fields already have been loaded', async () => {
            await getMenuData(null, null, resourcePicker.populateParamTypes, null, parentItem, fields, {
                traversalConfig: {
                    isEnabled: false
                },
                filter: {
                    allowGlobalConstants: false,
                    includeNewResource: true,
                    allowSObjectFieldsTraversal: true
                }
            });
            expect(filterFieldsForChosenElement).toHaveBeenCalledWith(parentItem, fields, {
                allowSObjectFields: true,
                allowedParamTypes: paramTypes,
                allowSObjectFieldsTraversal: true,
                allowElementFields: true,
                showAsFieldReference: true,
                showSubText: true,
                includeEntityRelatedRecordFields: false,
                selectorConfig: undefined,
                shouldBeWritable: false
            });
        });

        it('Should filter the fields after waiting for the fields to load', async () => {
            await getMenuData(null, null, resourcePicker.populateParamTypes, null, parentItem, null);
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
                includeEntityRelatedRecordFields: false,
                selectorConfig: undefined,
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
                    traversalConfig: {
                        isEnabled: false
                    },
                    filter: {
                        allowGlobalConstants: false,
                        includeNewResource: true
                    }
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
                    traversalConfig: {
                        isEnabled: false
                    },
                    filter: {
                        allowGlobalConstants: false,
                        includeNewResource: true,
                        forFormula: true
                    }
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
                    traversalConfig: {
                        isEnabled: resourcePicker.enableFieldDrilldown
                    },
                    filter: {
                        allowGlobalConstants: resourcePicker.allowGlobalConstants,
                        includeNewResource: true
                    }
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
                    traversalConfig: {
                        isEnabled: resourcePicker.enableFieldDrilldown
                    },
                    filter: {
                        allowGlobalConstants: resourcePicker.allowGlobalConstants,
                        includeNewResource: true
                    }
                }
            );
            expect(getStoreElements).toHaveBeenCalledWith(state, {
                elementType: 'Assignment'
            });
            expect(filterAndMutateMenuData).toHaveBeenCalledTimes(1);
            expect(filterAndMutateMenuData).toHaveBeenCalledWith(state, paramTypes, {
                traversalConfig: {
                    isEnabled: false
                },
                filter: {
                    includeNewResource: true,
                    allowGlobalConstants: true,
                    allowsApexCallAnonymousAutoOutput: true,
                    shouldBeWritable: false
                }
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
                    traversalConfig: {
                        isEnabled: resourcePicker.enableFieldDrilldown
                    },
                    filter: {
                        allowGlobalConstants: resourcePicker.allowGlobalConstants,
                        includeNewResource: false
                    }
                }
            );
            expect(getStoreElements).toHaveBeenCalledWith(state, 'elementConfig');
            expect(filterAndMutateMenuData).toHaveBeenCalledTimes(1);
            expect(filterAndMutateMenuData).toHaveBeenCalledWith(state, paramTypes, {
                traversalConfig: {
                    isEnabled: false
                },
                filter: {
                    includeNewResource: false,
                    allowGlobalConstants: true,
                    shouldBeWritable: undefined,
                    allowsApexCallAnonymousAutoOutput: undefined
                }
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
                    traversalConfig: {
                        isEnabled: resourcePicker.enableFieldDrilldown
                    },
                    filter: {
                        allowGlobalConstants: resourcePicker.allowGlobalConstants,
                        includeNewResource: false,
                        forFormula: true
                    }
                }
            );
            expect(filterAndMutateMenuData).toHaveBeenCalledTimes(1);
            expect(filterAndMutateMenuData).toHaveBeenCalledWith(state, paramTypes, {
                traversalConfig: {
                    isEnabled: false
                },
                filter: {
                    includeNewResource: false,
                    allowGlobalConstants: true,
                    allowsApexCallAnonymousAutoOutput: undefined,
                    forFormula: true,
                    shouldBeWritable: undefined
                }
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
                    traversalConfig: {
                        isEnabled: resourcePicker.enableFieldDrilldown
                    },
                    filter: {
                        allowGlobalConstants: resourcePicker.allowGlobalConstants,
                        includeNewResource: false,
                        showGlobalVariables: false
                    }
                }
            );
            expect(filterAndMutateMenuData).toHaveBeenCalledTimes(1);
            expect(filterAndMutateMenuData).toHaveBeenCalledWith(state, paramTypes, {
                traversalConfig: {
                    isEnabled: false
                },
                filter: {
                    includeNewResource: false,
                    allowGlobalConstants: true,
                    allowsApexCallAnonymousAutoOutput: undefined,
                    shouldBeWritable: undefined,
                    showGlobalVariables: false
                }
            });
        });
    });
});
