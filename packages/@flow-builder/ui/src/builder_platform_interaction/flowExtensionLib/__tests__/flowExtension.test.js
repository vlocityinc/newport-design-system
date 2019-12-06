import {
    describeExtensions,
    clearExtensionsCache,
    applyDynamicTypeMappings,
    getCachedExtension,
    listExtensions
} from '../flowExtension';
import {
    flowExtensionListParams
} from 'serverData/GetFlowExtensionListParams/flowExtensionListParams.json';
import {
    flowExtensionsForFlow as mockFlowExtensions
} from 'serverData/GetFlowExtensions/flowExtensionsForFlow.json';

import {
    fetch,
    SERVER_ACTION_TYPE
} from 'builder_platform_interaction/serverDataLib';

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual(
        'builder_platform_interaction/serverDataLib'
    );
    return {
        SERVER_ACTION_TYPE: actual.SERVER_ACTION_TYPE,
        fetch: jest.fn().mockImplementation((serverActionType, callback, params) =>
            callback({
                data: mockServerResponse(serverActionType, params)
            }))
    };
});

// Extend flowExtensionListParams to include <c:lookup/>
const mockFlowExtensionListParams = Object.assign({
    'c:lookup': [
        {
            "apiName" : "selectedRecord",
            "dataType" : "sobject",
            "objectType": "{T}",
            "defaultValue" : "false",
            "description" : "Selected record.",
            "fieldsToNull": [],
            "hasDefaultValue" : true,
            "isInput" : false,
            "isOutput" : true,
            "isRequired" : false,
            "label" : "Selected Record",
            "maxOccurs" : 1
        }
    ]
}, flowExtensionListParams);

function mockServerResponse(serverActionType, params) {
    if (serverActionType === SERVER_ACTION_TYPE.GET_FLOW_EXTENSIONS) {
        return [{
            qualifiedApiName: 'c:lookup',
            genericTypes: {
                records: [{
                    name: 'T',
                    superType: 'SOBJECT'
                }]
            },
            fieldsToNull: []
        }].concat(mockFlowExtensions);
    }

    expect(serverActionType).toEqual(SERVER_ACTION_TYPE.GET_FLOW_EXTENSION_LIST_PARAMS);
    const s = params.names.reduce((obj, name) => Object.assign(obj, {
        [name]: mockFlowExtensionListParams[name]
    }), {});
    return s;
}

describe('flowExtension', () => {
    beforeEach(() => {
        clearExtensionsCache();
    });

    describe('describeExtensions', () => {
        it('returns descriptions of extensions', async () => {
            const descriptions = await describeExtensions([
                'flowruntime:email',
                'flowruntime:slider'
            ]);
            let description = descriptions[0];
            expect(description.name).toBe('flowruntime:email');
            expect(description.inputParameters).toBeDefined();
            expect(description.outputParameters).toBeDefined();
            description = descriptions[1];
            expect(description.name).toBe('flowruntime:slider');
            expect(description.inputParameters).toBeDefined();
            expect(description.outputParameters).toBeDefined();
        });

        it('get the description of the extension from cache if description already fetched', async () => {
            await describeExtensions(['flowruntime:email']);
            await describeExtensions(['flowruntime:email']);
            expect(fetch.mock.calls).toHaveLength(1);
        });

        it('only fetches description of extensions that are not yet in the cache', async () => {
            await describeExtensions(['flowruntime:email']);
            await describeExtensions([
                'flowruntime:slider',
                'flowruntime:email'
            ]);
            expect(fetch.mock.calls).toHaveLength(2);
            expect(fetch.mock.calls[0][2]).toEqual({
                names: ['flowruntime:email']
            });
            expect(fetch.mock.calls[1][2]).toEqual({
                names: ['flowruntime:slider']
            });
        });

        it('returns immutable descriptions', async () => {
            const descriptions = await describeExtensions([
                'flowruntime:email'
            ]);
            const description = descriptions[0];
            expect(() => {
                description.name = 'flowruntime:email2';
            }).toThrow(Error);
        });
    });

    describe('getCachedExtension', () => {
        it('applies dynamic type mappings, when supplied', (done) => {
            listExtensions('', false, async () => {
                await describeExtensions([
                    'c:lookup'
                ]);
                const dynamicTypeMappings = [{
                    typeName: 'T',
                    typeValue: 'Asset'
                }];
                const extension = getCachedExtension('c:lookup', dynamicTypeMappings);
                expect(extension.outputParameters).toHaveLength(1);
                expect(extension.outputParameters[0]).toHaveProperty('dataType');
                expect(extension.outputParameters[0].dataType).toEqual('sobject');
                expect(extension.outputParameters[0]).toHaveProperty('subtype');
                expect(extension.outputParameters[0].subtype).toEqual('Asset');
                done();
            });
        });
    });

    describe('applyDynamicTypeMappings', () => {
        const paramsIn1 = [{
            apiName: 'pT',
            dataType: 'SOBJECT',
            subtype: '{T}',
            propA: 'A',
            propB: {
                B: 'B'
            }
        }, {
            apiName: 'pS',
            dataType: 'SOBJECT',
            subtype: '{S}'
        }, {
            apiName: 'pZ',
            dataType: 'SOBJECT',
            subtype: '{Z}'
        }, {
            apiName: 'pA',
            dataType: 'STRING'
        }, {
            apiName: 'pB',
            dataType: 'SOBJECT',
            subtype: 'WorkItem'
        }];

        const dynamicTypeMappings = [{
            typeName: 'T',
            typeValue: 'Account'
        }, {
            typeName: {
                value: 'S',
                error: null
            },
            typeValue: {
                value: 'Asset',
                error: null
            }
        }, {
            typeName: {
                value: 'Z',
                error: null
            },
            typeValue: {
                value: 'zzz',
                error: 'There\'s some error in the Z'
            }
        }];

        it('assigns concrete types to generically typed parameters, which types are bound', () => {
            const paramsOut1 = applyDynamicTypeMappings(paramsIn1, dynamicTypeMappings);
            expect(paramsOut1).toHaveLength(5);
            expect(paramsOut1[0]).toMatchObject({
                dataType: 'SOBJECT',
                subtype: 'Account'
            });
            expect(paramsOut1[1]).toMatchObject({
                dataType: 'SOBJECT',
                subtype: 'Asset'
            });
            expect(paramsOut1[2]).toMatchObject({
                dataType: 'SOBJECT',
                subtype: 'zzz'
            });
            expect(paramsOut1[3]).toBe(paramsIn1[3]);
            expect(paramsOut1[4]).toBe(paramsIn1[4]);
        });

        it('returns supplied parameters intact if no dynamic type mappings are supplied', () => {
            expect(applyDynamicTypeMappings(paramsIn1, undefined)).toBe(paramsIn1);
            expect(applyDynamicTypeMappings(paramsIn1, [])).toBe(paramsIn1);
        });
    });
});
