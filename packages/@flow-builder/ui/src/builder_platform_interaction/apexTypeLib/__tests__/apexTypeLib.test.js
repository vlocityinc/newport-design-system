import { setApexClasses, cachePropertiesForClass, getPropertiesForClass } from '../apexTypeLib';

const string = "String";
const sobject = "SObject";
const className = "ApexClass";
const sobjectType = "Account";
const property1 = "property1";
const property2 = "property2";
const sampleApexClass = [{
      "durableId" : className,
      "innerTypes" : {
          "done" : true,
          "entityTypeName": "FlowApexClassDescriptor",
          "records" : [{
              "fieldsToNull" : [],
              "id" : "000000000000000AAA",
              "name" : "Request",
              "parentId" : className
            },
            {
                "fieldsToNull" : [],
                "id" : "000000000000000AAA",
                "name" : "Request2",
                "parentId" : className
            }],
          "size" : 2,
          "totalSize" : 2
      },
      "name" : className,
      "properties" : {
          "done" : true,
          "entityTypeName" : "FlowApexClassPropertyDesc",
          "records" : [{
              "fieldsToNull" : [],
              "id" : "000000000000000AAA",
              "isCollection" : false,
              "name" : property1,
              "parentId" : className,
              "type" : string
          },
          {
              "fieldsToNull" : [],
              "id" : "000000000000000AAB",
              "isCollection" : false,
              "name" : property2,
              "parentId" : className,
              "type" : sobject,
              "objectType": sobjectType,
          },
          ],
          "size" : 1,
          "totalSize" : 1
      },
}];

describe('apex type lib', () => {
    beforeEach(() => {
        setApexClasses(sampleApexClass);
    });
    it('caches properties when given a class name', () => {
        cachePropertiesForClass(className);
        const properties = getPropertiesForClass(className);
        expect(Object.keys(properties)).toHaveLength(2);
    });
    it("caches primitive properties with api name, data type, and parent's name", () => {
        cachePropertiesForClass(className);
        const expectedProperty = {
            apiName: property1,
            dataType: string,
            apexClass: className,
        };
        const actualProperty = getPropertiesForClass(className)[property1];
        expect(actualProperty).toMatchObject(expectedProperty);
    });
    it('caches complex properties with subtype', () => {
        cachePropertiesForClass(className);
        const expectedProperty = {
            apiName: property2,
            dataType: sobject,
            subtype: sobjectType,
        };
        const actualProperty = getPropertiesForClass(className)[property2];
        expect(actualProperty).toMatchObject(expectedProperty);
    });
});