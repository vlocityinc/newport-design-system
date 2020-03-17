import { createLoop, createDuplicateLoop, createLoopWithConnectors, createLoopMetadataObject } from '../loop';
import {
    autolaunchedFlowUIModel,
    loopAccountAutomaticOutput,
    loopOnTextCollectionManualOutput,
    loopOnTextCollectionAutomaticOutput,
    loopOnApexTypeCollectionAutoOutput
} from 'mock/storeDataAutolaunched';
import { Store } from 'builder_platform_interaction/storeLib';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

describe('loop factory', () => {
    beforeAll(() => {
        Store.setMockState(autolaunchedFlowUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('create loop', () => {
        describe('new loop', () => {
            it('has store output automatically true', () => {
                const newLoop = createLoop();

                expect(newLoop.storeOutputAutomatically).toBe(true);
            });
            it('has no dataType', () => {
                const newLoop = createLoop();

                expect(newLoop.dataType).toBeUndefined();
            });
            it('has no subtype', () => {
                const newLoop = createLoop();

                expect(newLoop.subtype).toBeUndefined();
            });
        });
        describe('existing loop with manual output', () => {
            it('sets storeOutputAutomatically false on existing loop with manual output', () => {
                const createdLoop = createLoop(loopOnTextCollectionManualOutput);

                expect(createdLoop.storeOutputAutomatically).toBe(false);
            });
            it('has no dataType', () => {
                const createdLoop = createLoop(loopOnTextCollectionManualOutput);

                expect(createdLoop.dataType).toBeUndefined();
            });
            it('has no subtype', () => {
                const createdLoop = createLoop(loopOnTextCollectionManualOutput);

                expect(createdLoop.subtype).toBeUndefined();
            });
        });
        describe('existing loop with auto output', () => {
            it.each([
                loopAccountAutomaticOutput,
                loopOnTextCollectionAutomaticOutput,
                loopOnApexTypeCollectionAutoOutput
            ])('sets storeOutputAutomatically true', element => {
                const createdLoop = createLoop(element);

                expect(createdLoop.storeOutputAutomatically).toBe(true);
            });
            it.each`
                loop                                   | dataType
                ${loopAccountAutomaticOutput}          | ${'SObject'}
                ${loopOnTextCollectionAutomaticOutput} | ${'String'}
                ${loopOnApexTypeCollectionAutoOutput}  | ${'Apex'}
            `('$loop should have dataType: $dataType', ({ loop, dataType }) => {
                const createdLoop = createLoop(loop);

                expect(createdLoop.dataType).toBe(dataType);
            });
            it.each`
                loop                                   | subtype
                ${loopAccountAutomaticOutput}          | ${'Account'}
                ${loopOnTextCollectionAutomaticOutput} | ${null}
                ${loopOnApexTypeCollectionAutoOutput}  | ${'ApexComplexTypeTestOne216'}
            `('$loop should have subtype: $subtype', ({ loop, subtype }) => {
                const createdLoop = createLoop(loop);

                expect(createdLoop.subtype).toBe(subtype);
            });
        });
    });
    describe('create duplicate loop', () => {
        describe('automatic output', () => {
            it.each([
                loopAccountAutomaticOutput,
                loopOnTextCollectionAutomaticOutput,
                loopOnApexTypeCollectionAutoOutput
            ])('sets storeOutputAutomatically true', element => {
                const createdLoop = createDuplicateLoop(element);

                expect(createdLoop.duplicatedElement.storeOutputAutomatically).toBe(true);
            });
            it.each`
                loop                                   | dataType
                ${loopAccountAutomaticOutput}          | ${'SObject'}
                ${loopOnTextCollectionAutomaticOutput} | ${'String'}
                ${loopOnApexTypeCollectionAutoOutput}  | ${'Apex'}
            `('$loop should have dataType: $dataType', ({ loop, dataType }) => {
                const createdLoop = createDuplicateLoop(loop);

                expect(createdLoop.duplicatedElement.dataType).toBe(dataType);
            });
            it.each`
                loop                                   | subtype
                ${loopAccountAutomaticOutput}          | ${'Account'}
                ${loopOnTextCollectionAutomaticOutput} | ${null}
                ${loopOnApexTypeCollectionAutoOutput}  | ${'ApexComplexTypeTestOne216'}
            `('$loop should have subtype: $subtype', ({ loop, subtype }) => {
                const createdLoop = createDuplicateLoop(loop);

                expect(createdLoop.duplicatedElement.subtype).toBe(subtype);
            });
        });

        describe('manual output', () => {
            it('sets storeOutputAutomatically false', () => {
                const createdLoop = createDuplicateLoop(loopOnTextCollectionManualOutput);

                expect(createdLoop.duplicatedElement.storeOutputAutomatically).toBe(false);
            });
            it('has no dataType', () => {
                const createdLoop = createDuplicateLoop(loopOnTextCollectionManualOutput);

                expect(createdLoop.duplicatedElement.dataType).toBeUndefined();
            });
            it('has no subtype on existing loop with manual output', () => {
                const createdLoop = createDuplicateLoop(loopOnTextCollectionManualOutput);

                expect(createdLoop.duplicatedElement.subtype).toBeUndefined();
            });
        });
    });
    describe('create loop with connectors', () => {
        describe('automatic output', () => {
            it.each([
                loopAccountAutomaticOutput,
                loopOnTextCollectionAutomaticOutput,
                loopOnApexTypeCollectionAutoOutput
            ])('sets storeOutputAutomatically true', element => {
                const createdLoop = createLoopWithConnectors(element);

                expect(Object.values(createdLoop.elements)[0].storeOutputAutomatically).toBe(true);
            });
            it.each`
                loop                                   | dataType
                ${loopAccountAutomaticOutput}          | ${'SObject'}
                ${loopOnTextCollectionAutomaticOutput} | ${'String'}
                ${loopOnApexTypeCollectionAutoOutput}  | ${'Apex'}
            `('$loop should have dataType: $dataType', ({ loop, dataType }) => {
                const createdLoop = createLoopWithConnectors(loop);

                expect(Object.values(createdLoop.elements)[0].dataType).toBe(dataType);
            });
            it.each`
                loop                                   | subtype
                ${loopAccountAutomaticOutput}          | ${'Account'}
                ${loopOnTextCollectionAutomaticOutput} | ${null}
                ${loopOnApexTypeCollectionAutoOutput}  | ${'ApexComplexTypeTestOne216'}
            `('$loop should have subtype: $subtype', ({ loop, subtype }) => {
                const createdLoop = createLoopWithConnectors(loop);

                expect(Object.values(createdLoop.elements)[0].subtype).toBe(subtype);
            });
        });

        describe('manual output', () => {
            it('sets storeOutputAutomatically false', () => {
                const createdLoop = createLoopWithConnectors(loopOnTextCollectionManualOutput);

                expect(Object.values(createdLoop.elements)[0].storeOutputAutomatically).toBe(false);
            });
            it('has no dataType', () => {
                const createdLoop = createLoopWithConnectors(loopOnTextCollectionManualOutput);

                expect(Object.values(createdLoop.elements)[0].dataType).toBeUndefined();
            });
            it('has no subtype', () => {
                const createdLoop = createLoopWithConnectors(loopOnTextCollectionManualOutput);

                expect(Object.values(createdLoop.elements)[0].subtype).toBeUndefined();
            });
        });
    });
    describe('create loop metadata object', () => {
        it.each([
            loopAccountAutomaticOutput,
            loopOnTextCollectionManualOutput,
            loopOnTextCollectionAutomaticOutput,
            loopOnApexTypeCollectionAutoOutput
        ])('does not set storeOutputAutomatically', element => {
            const createdLoop = createLoopMetadataObject(element);

            expect(createdLoop.storeOutputAutomatically).toBeUndefined();
        });
        it.each([
            loopAccountAutomaticOutput,
            loopOnTextCollectionManualOutput,
            loopOnTextCollectionAutomaticOutput,
            loopOnApexTypeCollectionAutoOutput
        ])('does not set dataType', element => {
            const createdLoop = createLoopMetadataObject(element);

            expect(createdLoop.dataType).toBeUndefined();
        });
        it.each([
            loopAccountAutomaticOutput,
            loopOnTextCollectionManualOutput,
            loopOnTextCollectionAutomaticOutput,
            loopOnApexTypeCollectionAutoOutput
        ])('does not set subtype', element => {
            const createdLoop = createLoopMetadataObject(element);

            expect(createdLoop.subtype).toBeUndefined();
        });
    });
});
