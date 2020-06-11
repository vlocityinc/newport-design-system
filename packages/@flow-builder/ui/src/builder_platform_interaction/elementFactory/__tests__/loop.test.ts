// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    createLoop,
    createPastedLoop,
    createDuplicateLoop,
    createLoopWithConnectors,
    createLoopMetadataObject
} from '../loop';
import {
    autolaunchedFlowUIModel,
    loopAccountAutomaticOutput,
    loopOnTextCollectionManualOutput,
    loopOnTextCollectionAutomaticOutput,
    loopOnApexTypeCollectionAutoOutput
} from 'mock/storeDataAutolaunched';
import { Store } from 'builder_platform_interaction/storeLib';
import * as autolaunchedFlow from 'mock/flows/autolaunchedFlow.json';
import { getMetadataFlowElementByName } from 'mock/flows/mock-flow';
import {
    DUPLICATE_ELEMENT_XY_OFFSET,
    INCOMPLETE_ELEMENT,
    baseCanvasElement,
    createPastedCanvasElement,
    duplicateCanvasElement,
    baseCanvasElementsArrayToMap
} from '../base/baseElement';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('../base/baseElement');
baseCanvasElement.mockImplementation(jest.requireActual('../base/baseElement').baseCanvasElement);
createPastedCanvasElement
    .mockImplementation(duplicatedElement => {
        return duplicatedElement;
    })
    .mockName('createPastedCanvasElementMock');
duplicateCanvasElement.mockImplementation(jest.requireActual('../base/baseElement').duplicateCanvasElement);
baseCanvasElementsArrayToMap.mockImplementation(jest.requireActual('../base/baseElement').baseCanvasElementsArrayToMap);

describe('loop factory', () => {
    describe('create loop', () => {
        describe('new loop', () => {
            it('has store output automatically true', () => {
                const newLoop = createLoop();

                expect(newLoop.storeOutputAutomatically).toBe(true);
            });
            // case when creating a loop in a flow that doesn't support auto output
            it('has store output automatically false on loop that had storeOutputAutomatically true and has assignNextValueToReference set', () => {
                const newLoop = createLoop({ assignNextValueToReference: 'nonNull', storeOutputAutomatically: true });

                expect(newLoop.storeOutputAutomatically).toBe(false);
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
            beforeAll(() => {
                Store.setMockState(autolaunchedFlowUIModel);
            });
            afterAll(() => {
                Store.resetStore();
            });
            it.each`
                element
                ${loopAccountAutomaticOutput}
                ${loopOnTextCollectionAutomaticOutput}
                ${loopOnApexTypeCollectionAutoOutput}
            `('$element.name should have storeOutputAutomatically : true', ({ element }) => {
                const createdLoop = createLoop(element);

                expect(createdLoop.storeOutputAutomatically).toBe(true);
            });
            it.each`
                loop                                   | dataType
                ${loopAccountAutomaticOutput}          | ${'SObject'}
                ${loopOnTextCollectionAutomaticOutput} | ${'String'}
                ${loopOnApexTypeCollectionAutoOutput}  | ${'Apex'}
            `('$loop.name should have dataType: $dataType', ({ loop, dataType }) => {
                const createdLoop = createLoop(loop);

                expect(createdLoop.dataType).toBe(dataType);
            });
            it.each`
                loop                                   | subtype
                ${loopAccountAutomaticOutput}          | ${'Account'}
                ${loopOnTextCollectionAutomaticOutput} | ${null}
                ${loopOnApexTypeCollectionAutoOutput}  | ${'ApexComplexTypeTestOne216'}
            `('$loop.name should have subtype: $subtype', ({ loop, subtype }) => {
                const createdLoop = createLoop(loop);

                expect(createdLoop.subtype).toBe(subtype);
            });
        });
    });

    describe('create pasted loop', () => {
        const dataForPasting = {
            canvasElementToPaste: {
                guid: 'originalGuid',
                name: 'originalName',
                label: 'label',
                elementType: ELEMENT_TYPE.LOOP,
                locationX: 100,
                locationY: 100,
                config: {
                    isSelectd: true,
                    isHighlighted: false
                },
                connectorCount: 0,
                maxConnections: 2
            },
            newGuid: 'updatedSubflowGuid',
            newName: 'updatedSubflowName'
        };

        const { pastedCanvasElement } = createPastedLoop(dataForPasting);

        it('has the new guid', () => {
            expect(pastedCanvasElement.guid).toEqual('updatedSubflowGuid');
        });
        it('has the new name', () => {
            expect(pastedCanvasElement.name).toEqual('updatedSubflowName');
        });
        it('has the updated locationX', () => {
            expect(pastedCanvasElement.locationX).toEqual(
                dataForPasting.canvasElementToPaste.locationX + DUPLICATE_ELEMENT_XY_OFFSET
            );
        });
        it('has the updated locationY', () => {
            expect(pastedCanvasElement.locationY).toEqual(
                dataForPasting.canvasElementToPaste.locationY + DUPLICATE_ELEMENT_XY_OFFSET
            );
        });
        it('has isSelected set to true', () => {
            expect(pastedCanvasElement.config.isSelected).toBeTruthy();
        });
        it('has isHighlighted set to false', () => {
            expect(pastedCanvasElement.config.isHighlighted).toBeFalsy();
        });
        it('has connectorCount set to 0', () => {
            expect(pastedCanvasElement.connectorCount).toEqual(0);
        });
        it('has maxConnections set to 1', () => {
            expect(pastedCanvasElement.maxConnections).toEqual(2);
        });
        it('has the right elementType', () => {
            expect(pastedCanvasElement.elementType).toEqual(ELEMENT_TYPE.LOOP);
        });
    });

    describe('create duplicate loop', () => {
        beforeAll(() => {
            Store.setMockState(autolaunchedFlowUIModel);
        });
        afterAll(() => {
            Store.resetStore();
        });
        describe('automatic output', () => {
            it.each`
                element
                ${loopAccountAutomaticOutput}
                ${loopOnTextCollectionAutomaticOutput}
                ${loopOnApexTypeCollectionAutoOutput}
            `('$element.name should have storeOutputAutomatically : true', ({ element }) => {
                const createdLoop = createDuplicateLoop(element);

                expect(createdLoop.duplicatedElement.storeOutputAutomatically).toBe(true);
            });
            it.each`
                loop                                   | dataType
                ${loopAccountAutomaticOutput}          | ${'SObject'}
                ${loopOnTextCollectionAutomaticOutput} | ${'String'}
                ${loopOnApexTypeCollectionAutoOutput}  | ${'Apex'}
            `('$loop.name should have dataType: $dataType', ({ loop, dataType }) => {
                const createdLoop = createDuplicateLoop(loop);

                expect(createdLoop.duplicatedElement.dataType).toBe(dataType);
            });
            it.each`
                loop                                   | subtype
                ${loopAccountAutomaticOutput}          | ${'Account'}
                ${loopOnTextCollectionAutomaticOutput} | ${null}
                ${loopOnApexTypeCollectionAutoOutput}  | ${'ApexComplexTypeTestOne216'}
            `('$loop.name should have subtype: $subtype', ({ loop, subtype }) => {
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
            describe('No elements passed', () => {
                it.each`
                    element
                    ${getMetadataFlowElementByName(autolaunchedFlow, 'loopAccountAutomaticOutput')}
                    ${getMetadataFlowElementByName(autolaunchedFlow, 'loopOnTextAutomaticOutput')}
                    ${getMetadataFlowElementByName(autolaunchedFlow, 'loopOnApexTypeCollectionAutoOutput')}
                `(
                    '$element.name should have INCOMPLETE_ELEMENT property set to true and type should not be set',
                    ({ element }) => {
                        const result = createLoopWithConnectors(element, { elements: {} });
                        const loopElement = Object.values(result.elements)[0];
                        expect(loopElement.storeOutputAutomatically).toBe(true);
                        expect(loopElement[INCOMPLETE_ELEMENT]).toBe(true);
                        expect(loopElement.dataType).toBeUndefined();
                        expect(loopElement.subtype).toBeUndefined();
                    }
                );
            });
            describe('Elements passed', () => {
                it.each`
                    element                                                                                 | dataType     | subtype
                    ${getMetadataFlowElementByName(autolaunchedFlow, 'loopAccountAutomaticOutput')}         | ${'SObject'} | ${'Account'}
                    ${getMetadataFlowElementByName(autolaunchedFlow, 'loopOnTextAutomaticOutput')}          | ${'String'}  | ${null}
                    ${getMetadataFlowElementByName(autolaunchedFlow, 'loopOnApexTypeCollectionAutoOutput')} | ${'Apex'}    | ${'ApexComplexTypeTestOne216'}
                `(
                    '$element.name should have { storeOutputAutomatically : true, dataType : ${dataType}, subtype : ${subtype} }',
                    ({ element, dataType, subtype }) => {
                        const result = createLoopWithConnectors(element, {
                            elements: autolaunchedFlowUIModel.elements
                        });
                        const loopElement = Object.values(result.elements)[0];
                        expect(loopElement.storeOutputAutomatically).toBe(true);
                        expect(loopElement.dataType).toBe(dataType);
                        expect(loopElement.subtype).toBe(subtype);
                        expect(loopElement[INCOMPLETE_ELEMENT]).toBeUndefined();
                    }
                );
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
        it('should throw error if no "loop" passed', () => {
            expect(() => createLoopMetadataObject(null)).toThrowError('loop is not defined');
        });
        it.each`
            element
            ${loopAccountAutomaticOutput}
            ${loopOnTextCollectionManualOutput}
            ${loopOnTextCollectionAutomaticOutput}
            ${loopOnApexTypeCollectionAutoOutput}
        `('$element.name does not set storeOutputAutomatically', ({ element }) => {
            const createdLoop = createLoopMetadataObject(element);

            expect(createdLoop.storeOutputAutomatically).toBeUndefined();
        });
        it.each`
            element
            ${loopAccountAutomaticOutput}
            ${loopOnTextCollectionManualOutput}
            ${loopOnTextCollectionAutomaticOutput}
            ${loopOnApexTypeCollectionAutoOutput}
        `('$element.name does not set dataType', ({ element }) => {
            const createdLoop = createLoopMetadataObject(element);

            expect(createdLoop.dataType).toBeUndefined();
        });
        it.each`
            element
            ${loopAccountAutomaticOutput}
            ${loopOnTextCollectionManualOutput}
            ${loopOnTextCollectionAutomaticOutput}
        `('does not set subtype', ({ element }) => {
            const createdLoop = createLoopMetadataObject(element);

            expect(createdLoop.subtype).toBeUndefined();
        });
    });
});
