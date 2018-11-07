import { mutateFlowResourceToComboboxShape, mutatePicklistValue } from '../menuDataGenerator';
import { getDataTypeLabel, getDataTypeIcons } from 'builder_platform_interaction/dataTypeLib';
import { getElementCategory } from 'builder_platform_interaction/elementConfig';

jest.mock('builder_platform_interaction/dataTypeLib', () => {
    return {
        getDataTypeLabel: jest.fn().mockName('getDataTypeLabel'),
        getDataTypeIcons: jest.fn().mockName('getDataTypeIcons'),
        FLOW_DATA_TYPE: require.requireActual('builder_platform_interaction/dataTypeLib').FLOW_DATA_TYPE,
        FEROV_DATA_TYPE: require.requireActual('builder_platform_interaction/dataTypeLib').FEROV_DATA_TYPE,
    };
});

jest.mock('builder_platform_interaction/elementConfig', () => {
    return {
        getElementCategory: jest.fn().mockReturnValue('').mockName('getElementCategory'),
    };
});

describe('menuDataGenerator', () => {
    describe('mutateFlowResourceToComboboxShape', () => {
        let mockResource;
        beforeEach(() => {
            mockResource = {
                dataType: 'sfdcDataType',
            };
        });
        it('calls getDataTypeLabel when given a non sobject resource with no label', () => {
            mutateFlowResourceToComboboxShape(mockResource);
            expect(getDataTypeLabel).toHaveBeenCalledWith(mockResource.dataType);
        });

        it('gets a localized label when getting subtext for a data type', () => {
            const mockLabel = 'sfdc label';
            getDataTypeLabel.mockReturnValueOnce(mockLabel);
            const result = mutateFlowResourceToComboboxShape(mockResource);
            expect(result.subText).toEqual(mockLabel);
        });

        it('gets the data type from a type object when dataType does not exist', () => {
            mockResource.dataType = undefined;
            mockResource.type = { type: 'screenFieldDataType' };
            mutateFlowResourceToComboboxShape(mockResource);
            expect(getDataTypeLabel).toHaveBeenCalledWith(mockResource.type.type);
            expect(getDataTypeIcons).toHaveBeenCalledWith(mockResource.type.type, expect.any(String));
            expect(getElementCategory).toHaveBeenCalledWith(undefined, mockResource.type.type, undefined);
        });

        it('calls getDataTypeIcons if no icon exists in type object', () => {
            mockResource.type = { };
            mutateFlowResourceToComboboxShape(mockResource);
            expect(getDataTypeIcons).toHaveBeenCalledTimes(1);
        });

        it('calls getDataTypeIcons when no icon exists', () => {
            mutateFlowResourceToComboboxShape(mockResource);
            expect(getDataTypeIcons).toHaveBeenCalledTimes(1);
        });
    });
    describe('mutatePicklistValue', () => {
        it('will display the value if no label exists', () => {
            const val = 'Pick1';
            const expectedMutatedValue = {
                displayText: val,
                iconSize: 'xx-small',
                subText: 'FlowBuilderDataTypes.textDataTypeLabel',
                text: val,
                type: 'option-card',
                value: val
            };
            const picklistValue = {value: val};
            const mutatedValue = mutatePicklistValue(picklistValue);
            expect(mutatedValue).toEqual(expectedMutatedValue);
        });
    });
});