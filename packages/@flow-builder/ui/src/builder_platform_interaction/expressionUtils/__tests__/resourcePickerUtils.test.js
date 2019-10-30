import { getMenuData } from '../resourcePickerUtils';
import {
    filterAndMutateMenuData,
    filterFieldsForChosenElement
} from '../menuDataRetrieval';
import { getStoreElements } from '../storeElementsFilter';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';

const paramTypes = ['paramType'];

let resourcePicker;

const objectName = 'Account';
const parentItem = {
    dataType: FLOW_DATA_TYPE.SOBJECT.value,
    subtype: objectName
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
        getChildrenItems: require.requireActual('../menuDataRetrieval')
            .getChildrenItems,
        filterFieldsForChosenElement: jest.fn(),
        filterAndMutateMenuData: jest.fn()
    };
});

jest.mock('../storeElementsFilter', () => ({
    getStoreElements: jest.fn(storeState => {
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

            const result = await getMenuData(
                null,
                null,
                resourcePicker.populateParamTypes,
                null,
                parentItem,
                null,
                {
                    allowGlobalConstants: false,
                    enableFieldDrilldown: false,
                    includeNewResource: true
                }
            );
            expect(result).toEqual(['field2']);
        });

        it('Should filter the fields when the fields already have been loaded', async () => {
            await getMenuData(
                null,
                null,
                resourcePicker.populateParamTypes,
                null,
                parentItem,
                fields,
                {
                    allowGlobalConstants: false,
                    enableFieldDrilldown: false,
                    includeNewResource: true,
                    allowSObjectFieldsTraversal: true
                }
            );
            expect(filterFieldsForChosenElement).toHaveBeenCalledWith(
                parentItem,
                fields,
                {
                    allowedParamTypes: paramTypes,
                    allowSObjectFieldsTraversal: true,
                    showAsFieldReference: true,
                    showSubText: true,
                    shouldBeWritable: false
                }
            );
        });

        it('Should filter the fields after waiting for the fields to load', async () => {
            await getMenuData(
                null,
                null,
                resourcePicker.populateParamTypes,
                null,
                parentItem,
                null,
                {
                    allowedParamTypes: paramTypes,
                    showAsFieldReference: true,
                    showSubText: true
                }
            );
            expect(fetchFieldsForEntity).toHaveBeenCalledWith(objectName);
            expect(filterFieldsForChosenElement).toHaveBeenCalledWith(
                parentItem,
                ['field2'],
                {
                    allowedParamTypes: paramTypes,
                    showAsFieldReference: true,
                    showSubText: true,
                    allowSObjectFieldsTraversal: true,
                    shouldBeWritable: false
                }
            );
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
            expect(filterAndMutateMenuData).toHaveBeenCalledWith(
                elements,
                paramTypes,
                true,
                true,
                true,
                null,
                true,
                false,
                true
            );
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
            expect(getStoreElements).toHaveBeenCalledWith(
                elements,
                'elementConfig'
            );
            expect(filterAndMutateMenuData).toHaveBeenCalledTimes(1);
            expect(filterAndMutateMenuData).toHaveBeenCalledWith(
                elements,
                paramTypes,
                false,
                true,
                true,
                null,
                true,
                false,
                true
            );
        });
    });
});
