// @ts-nocheck
import { createDynamicTypeMappings, createDataTypeMappingsMetadataObject } from '../dynamicTypeMapping';

describe('Dynamic Type Mappings', () => {
    describe('cloneDynamicTypeMappings', () => {
        it('clones dynamic type mappings', () => {
            const dtms1 = [
                {
                    typeName: 'a_name',
                    typeValue: 'a_value'
                },
                {
                    typeName: 'b_name',
                    typeValue: 'b_value',
                    rowIndex: 'abc'
                }
            ];
            const dtms2 = createDynamicTypeMappings(dtms1);
            expect(dtms2).toHaveLength(2);
            expect(dtms2[0]).not.toBe(dtms1[0]);
            expect(dtms2[1]).not.toBe(dtms1[1]);
            expect(dtms2[0]).toMatchObject({
                typeName: 'a_name',
                typeValue: 'a_value',
                rowIndex: expect.anything()
            });
            expect(dtms2[1]).toEqual(dtms1[1]);
        });

        it('does not clone unknown properties', () => {
            const dtms1 = [
                {
                    typeName: 'a_name',
                    typeValue: 'a_value',
                    b: 'b'
                },
                {
                    typeName: 'b_name',
                    typeValue: 'b_value',
                    c: ['c']
                }
            ];
            const dtms2 = createDynamicTypeMappings(dtms1);
            expect(dtms2).toMatchObject([
                {
                    typeName: 'a_name',
                    typeValue: 'a_value'
                },
                {
                    typeName: 'b_name',
                    typeValue: 'b_value'
                }
            ]);
        });
    });

    describe('createDynamicTypeMappingsMetadataObject', () => {
        it('creates dynamic type mappings metadata object from dynamic type mapping internal representation', () => {
            const output = createDataTypeMappingsMetadataObject([
                {
                    typeName: 'T',
                    typeValue: 'Account',
                    type: {
                        name: 'T',
                        superType: 'SOBJECT'
                    },
                    rowIndex: 'abc'
                },
                {
                    typeName: {
                        value: 'S',
                        error: null
                    },
                    typeValue: {
                        value: 'Asset',
                        error: null
                    },
                    type: {
                        name: 'S',
                        superType: 'SOBJECT'
                    },
                    rowIndex: 'def'
                },
                {
                    typeName: {
                        value: 'Z',
                        error: null
                    },
                    typeValue: {
                        value: 'zzz',
                        error: 'There is some issue with the Z'
                    }
                }
            ]);
            expect(output).toEqual([
                {
                    typeName: 'T',
                    typeValue: 'Account'
                },
                {
                    typeName: 'S',
                    typeValue: 'Asset'
                },
                {
                    typeName: 'Z',
                    typeValue: 'zzz'
                }
            ]);
        });

        it('returns undefined if no dynamic type mappings are supplied', () => {
            expect(createDataTypeMappingsMetadataObject()).toBeUndefined();
            expect(createDataTypeMappingsMetadataObject([])).toBeUndefined();
        });
    });
});
