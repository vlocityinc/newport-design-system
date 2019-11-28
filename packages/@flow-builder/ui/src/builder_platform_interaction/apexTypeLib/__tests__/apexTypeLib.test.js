import {
    setApexClasses,
    cachePropertiesForClass,
    getPropertiesForClass
} from '../apexTypeLib';
import { apexTypesForFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';
import { allEntities as mockEntities } from 'serverData/GetEntities/allEntities.json';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getEntity: jest.fn().mockImplementation(apiName => {
            return mockEntities.find(
                entity => entity.apiName.toLowerCase() === apiName.toLowerCase()
            );
        })
    };
});

describe('apex type lib', () => {
    beforeEach(() => {
        setApexClasses(apexTypesForFlow);
        cachePropertiesForClass('ApexComplexTypeTestOne216');
    });
    afterEach(() => {
        setApexClasses(null);
    });
    it('caches properties when given a class name', () => {
        const properties = getPropertiesForClass('ApexComplexTypeTestOne216');
        expect(Object.keys(properties)).toHaveLength(27);
    });
    it("caches primitive properties with api name, data type, and parent's name", () => {
        const actualProperty = getPropertiesForClass(
            'ApexComplexTypeTestOne216'
        ).name;
        expect(actualProperty).toMatchObject({
            apiName: 'name',
            dataType: 'String',
            apexClass: 'ApexComplexTypeTestOne216'
        });
    });
    it('caches SObject properties with subtype', () => {
        const actualProperty = getPropertiesForClass(
            'ApexComplexTypeTestOne216'
        ).acct;
        expect(actualProperty).toMatchObject({
            apiName: 'acct',
            dataType: 'SObject',
            subtype: 'Account'
        });
    });
    it('caches apex properties with subtype', () => {
        const actualProperty = getPropertiesForClass('Car').wheel;
        expect(actualProperty).toMatchObject({
            apiName: 'wheel',
            dataType: 'Apex',
            subtype: 'Wheel'
        });
    });
});
