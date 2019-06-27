import { describeExtensions, clearExtensionsCache } from '../flowExtension';
import { mockFlowExtensionListParams } from 'mock/flowExtensionsData';
import { fetch } from 'builder_platform_interaction/serverDataLib';

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual(
        '../../serverDataLib/serverDataLib.js'
    );
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetch: jest
            .fn()
            .mockImplementation((serverActionType, callback, params) =>
                callback({
                    data: params.names.reduce((obj, name) => {
                        obj[name] = mockFlowExtensionListParams[name];
                        return obj;
                    }, {})
                })
            )
    };
});

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
});
