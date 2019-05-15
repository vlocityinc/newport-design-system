import { getResourceLabel } from '../elementLabelLib';
import { elements, lookupRecordOutputReferenceGuid, lookupRecordAutomaticOutputGuid, lookupRecordCollectionAutomaticOutputGuid } from "mock/storeData";
import { deepCopy } from 'builder_platform_interaction/storeLib'
;
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('@salesforce/label/FlowBuilderElementLabels.recordLookupAsResourceText', () => {
    return { default: '{0} from {1}' };
}, { virtual: true });
jest.mock('builder_platform_interaction/sobjectLib', () => {
    const mockEntities = require('mock/serverEntityData').mockEntities;
    return {
        getEntity: jest.fn().mockImplementation((apiName) => {
            return mockEntities.find(entity => entity.apiName === apiName);
        }),
    };
});

describe('elementLabelLib', () => {
    describe('getResourceLabel', () => {
        it('returns the resource name in the general case', () => {
            const element = elements[lookupRecordOutputReferenceGuid];
            const label = getResourceLabel(element);
            expect(label).toEqual(element.name);
        });
        describe('GetRecord element with automatic handling mode', () => {
            it('returns "[SObject label] from [elementName]"', () => {
                const element = elements[lookupRecordAutomaticOutputGuid];
                const label = getResourceLabel(element);
                expect(label).toEqual('Account from lookupRecord1');
            });
            it('returns "[SObject plural label] from [elementName]" when returning all records', () => {
                const element = elements[lookupRecordCollectionAutomaticOutputGuid];
                const label = getResourceLabel(element);
                expect(label).toEqual('Accounts from lookupRecord3');
            });
            it('returns the resource name if SObject cannot be found', () => {
                const element = deepCopy(elements[lookupRecordCollectionAutomaticOutputGuid]);
                element.object = 'UnknownRecord';
                element.subtype = 'UnknownRecord';
                const label = getResourceLabel(element);
                expect(label).toEqual(element.name);
            });
        });
    });
});