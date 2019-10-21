import { getMenuData } from '../resourcePickerUtils';
import {
    filterAndMutateMenuData,
    filterFieldsForChosenElement,
    getStoreElements
} from '../menuDataRetrieval';
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
        getStoreElements: jest.fn(storeState => {
            return storeState;
        }),
        filterAndMutateMenuData: jest.fn()
    };
});

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
                false,
                false,
                null,
                true,
                parentItem
            );
            expect(result).toEqual(['field2']);
        });

        it('Should filter the fields when the fields already have been loaded', async () => {
            await getMenuData(
                null,
                null,
                resourcePicker.populateParamTypes,
                false,
                false,
                null,
                true,
                parentItem,
                fields
            );
            expect(filterFieldsForChosenElement).toHaveBeenCalledWith(
                parentItem,
                fields,
                {
                    allowedParamTypes: paramTypes,
                    showAsFieldReference: true,
                    showSubText: true
                }
            );
        });

        it('Should filter the fields after waiting for the fields to load', async () => {
            await getMenuData(
                null,
                null,
                resourcePicker.populateParamTypes,
                false,
                false,
                null,
                true,
                parentItem
            );
            expect(fetchFieldsForEntity).toHaveBeenCalledWith(objectName);
            expect(filterFieldsForChosenElement).toHaveBeenCalledWith(
                parentItem,
                ['field2'],
                {
                    allowedParamTypes: paramTypes,
                    showAsFieldReference: true,
                    showSubText: true
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
                allowSobjectForFields: true,
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
                resourcePicker.allowSobjectForFields,
                resourcePicker.enableFieldDrilldown,
                storeInstance,
                false
            );
            expect(result).toEqual(mockMenuData);
        });

        it('Should get menu data when there is no element config', async () => {
            await getMenuData(
                null,
                resourcePicker.propertyEditorElementType,
                resourcePicker.populateParamTypes,
                resourcePicker.allowSobjectForFields,
                resourcePicker.enableFieldDrilldown,
                storeInstance,
                true
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
                false
            );
        });

        it('Should get menu data when there is element config and we do not want new resource option', async () => {
            await getMenuData(
                'elementConfig',
                resourcePicker.propertyEditorElementType,
                resourcePicker.populateParamTypes,
                resourcePicker.allowSobjectForFields,
                resourcePicker.enableFieldDrilldown,
                storeInstance,
                false
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
                false
            );
        });
    });
});
