import {
    getDataTypeLabel,
    FLOW_DATA_TYPE,
    getResourceTypes,
    setResourceTypes,
} from '../dataTypeLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('../dataTypeLib.js', () => {
    const dataTypeLib = Object.assign({}, jest.requireActual('../dataTypeLib.js'));
    dataTypeLib.FLOW_DATA_TYPE.MULTI_PICKLIST.label = undefined;
    return dataTypeLib;
});

describe('dataTypeLib', () => {
    describe('getDataTypeLabel', () => {
        it('thows an error when given an invalid data type api name', () => {
            const invalidDataType = 'fooDataType';
            expect(() => getDataTypeLabel(invalidDataType)).toThrow();
        });

        it('returns the data type api name when there is no label', () => {
            const label = getDataTypeLabel(FLOW_DATA_TYPE.MULTI_PICKLIST.value);
            expect(label).toEqual(FLOW_DATA_TYPE.MULTI_PICKLIST.value);
        });

        it('returns the label of the given data type', () => {
            const label = getDataTypeLabel(FLOW_DATA_TYPE.STRING.value);
            expect(label).toEqual(FLOW_DATA_TYPE.STRING.label);
        });
    });

    describe('setResourceTypes', () => {
        describe('When no resources are available', () => {
            it('return empty array when resource type list is undefined', () => {
                setResourceTypes(undefined);
                expect(getResourceTypes()).toEqual([]);
            });

            it('return empty array when resource type list is empty', () => {
                setResourceTypes([]);
                expect(getResourceTypes()).toEqual([]);
            });
        });

        describe('When resources are available', () => {
            it('return sorted resource type list based on custom ordering when receive child resource list', () => {
                const unsortedResourceTypes = [
                    {name: ELEMENT_TYPE.PICKLIST_CHOICE_SET}, {name: ELEMENT_TYPE.VARIABLE},
                    {name: ELEMENT_TYPE.CONSTANT}, {name: ELEMENT_TYPE.STAGE}, {name: ELEMENT_TYPE.TEXT_TEMPLATE}
                ];
                const sortedResourceTypes = [
                    {name: ELEMENT_TYPE.VARIABLE}, {name: ELEMENT_TYPE.CONSTANT}, {name: ELEMENT_TYPE.TEXT_TEMPLATE},
                    {name: ELEMENT_TYPE.PICKLIST_CHOICE_SET}, {name: ELEMENT_TYPE.STAGE}
                ];
                setResourceTypes(unsortedResourceTypes);
                expect(getResourceTypes()).toEqual(sortedResourceTypes);
            });

            it('return sorted resource type list based on custom ordering when receive full resource list', () => {
                const unsortedResourceTypes = [
                    {name: ELEMENT_TYPE.PICKLIST_CHOICE_SET}, {name: ELEMENT_TYPE.VARIABLE}, {name: ELEMENT_TYPE.CHOICE}, {name: ELEMENT_TYPE.RECORD_CHOICE_SET},
                    {name: ELEMENT_TYPE.CONSTANT}, {name: ELEMENT_TYPE.STAGE}, {name: ELEMENT_TYPE.FORMULA}, {name: ELEMENT_TYPE.TEXT_TEMPLATE}
                ];
                const sortedResourceTypes = [
                    {name: ELEMENT_TYPE.VARIABLE}, {name: ELEMENT_TYPE.CONSTANT}, {name: ELEMENT_TYPE.FORMULA}, {name: ELEMENT_TYPE.TEXT_TEMPLATE},
                    {name: ELEMENT_TYPE.CHOICE}, {name: ELEMENT_TYPE.RECORD_CHOICE_SET}, {name: ELEMENT_TYPE.PICKLIST_CHOICE_SET}, {name: ELEMENT_TYPE.STAGE}
                ];
                setResourceTypes(unsortedResourceTypes);
                expect(getResourceTypes()).toEqual(sortedResourceTypes);
            });
        });
    });
});