import { mutateFlowResourceToComboboxShape } from '../menuDataGenerator';
import { getDataTypeLabel } from 'builder_platform_interaction/dataTypeLib';

jest.mock('builder_platform_interaction/dataTypeLib', () => {
    return {
        getDataTypeLabel: jest.fn().mockName('getDataTypeLabel'),
        getDataTypeIcons: jest.fn().mockName('getDataTypeIcons'),
        FLOW_DATA_TYPE: require.requireActual('builder_platform_interaction/dataTypeLib').FLOW_DATA_TYPE,
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
    });
});