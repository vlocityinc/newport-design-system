import { getMenuData } from '../resourcePickerUtils';
import {
    filterAndMutateMenuData,
    filterFieldsForChosenElement,
    getStoreElements,
} from '../menuDataRetrieval';
import { getFieldsForEntity } from 'builder_platform_interaction/sobjectLib';

const paramTypes = ['paramType'];

let resourcePicker;

const objectName = 'Account';
const parentItem = {
    objectType: objectName,
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
        filterFieldsForChosenElement: jest.fn(),
        getStoreElements: jest.fn((storeState) => {
            return storeState;
        }),
        filterAndMutateMenuData: jest.fn(),
    };
});

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getFieldsForEntity: jest.fn((entityName, fieldsFn) => {
            fieldsFn(['field2']);
        }),
    };
});

describe('resourcePickerUtils', () => {
    describe('Get field menudata', () => {
        beforeEach(() => {
            resourcePicker = {
                populateParamTypes() {
                    this.paramTypes = paramTypes;
                }
            };
        });
        it('Should filter the fields when the fields already have been loaded', () => {
            getMenuData(resourcePicker, null, true, parentItem, fields);
            expect(filterFieldsForChosenElement).toHaveBeenCalledWith(parentItem, paramTypes,
                fields, true, true);
        });

        it('Should filter the fields after waiting for the fields to load', () => {
            getMenuData(resourcePicker, null, true, parentItem);
            expect(getFieldsForEntity).toHaveBeenCalledWith(objectName, expect.anything());
            expect(filterFieldsForChosenElement).toHaveBeenCalledWith(parentItem, paramTypes,
                ['field2'], true, true);
        });
    });

    describe('Get FEROV menudata', () => {
        beforeEach(() => {
            resourcePicker = {
                populateParamTypes() {
                    this.paramTypes = paramTypes;
                },
                propertyEditorElementType: 'Assignment',
                allowSobjectForFields: true,
                disableFieldDrilldown: true
            };
        });
        it('Should get menu data when there is no element config', () => {
            getMenuData(resourcePicker, storeInstance, true);
            expect(getStoreElements).toHaveBeenCalledWith(elements, { elementType: 'Assignment' });
            expect(filterAndMutateMenuData).toHaveBeenCalledTimes(1);
            expect(filterAndMutateMenuData).toHaveBeenCalledWith(elements, ['paramType'], true,
                true, true);
        });

        it('Should get menu data when there is element config and we do not want new resource option', () => {
            resourcePicker.elementConfig = 'elementConfig';
            getMenuData(resourcePicker, storeInstance, false);
            expect(getStoreElements).toHaveBeenCalledWith(elements, 'elementConfig');
            expect(filterAndMutateMenuData).toHaveBeenCalledTimes(1);
            expect(filterAndMutateMenuData).toHaveBeenCalledWith(elements, null, false,
                true, true);
        });
    });

    describe('getFieldMenuData', () => {
        let mockResourcePicker;

        beforeEach(() => {
            mockResourcePicker = {
                populateParamTypes: jest.fn().mockName('populateParamTypes'),
            };
        });

        it('calls populateParamTypes when the picker has no elementConfig', () => {
            getMenuData(mockResourcePicker, {}, true, {});
            expect(mockResourcePicker.populateParamTypes).toHaveBeenCalledTimes(1);
        });
    });
});