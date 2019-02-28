import { setApexClasses, cachePropertiesForClass, getPropertiesForClass } from '../apexTypeLib';

const className = "ApexClass";
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
              "type" : "String"
          },
          {
              "fieldsToNull" : [],
              "id" : "000000000000000AAB",
              "isCollection" : false,
              "name" : property2,
              "parentId" : className,
              "type" : "String"
          }
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
    it('caches properties with api name, collection, & data type', () => {
        cachePropertiesForClass(className);
        const expectedProperty = {
            "apiName": property1,
            "dataType": "String",
        };
        const actualProperty = getPropertiesForClass(className)[property1];
        expect(actualProperty).toMatchObject(expectedProperty);
    });
});