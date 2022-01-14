// @ts-nocheck
import { setApexClasses } from 'builder_platform_interaction/apexTypeLib';
import { Store } from 'builder_platform_interaction/storeLib';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getMetadataFlowElementByName } from 'mock/flows/mock-flow';
import {
    flowWithAllElementsUIModel,
    loopOnAccountAutoOutput,
    loopOnApexAutoOutput,
    loopOnLocalActionSobjectCollInApexAutoOutput,
    loopOnNestedApexTypeAutoOutput,
    loopOnScreenCompSObjectCollAutoOutput,
    loopOnSobjectCollectionInApexTypeAutoOutput,
    loopOnTextCollectionAutoOutput,
    loopOnTextCollectionManualOutput
} from 'mock/storeData';
import { apexTypesForFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    duplicateCanvasElement,
    INCOMPLETE_ELEMENT
} from '../base/baseElement';
import { createDuplicateLoop, createLoop, createLoopMetadataObject, createLoopWithConnectors } from '../loop';

jest.mock('builder_platform_interaction/alcCanvasUtils');
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('../base/baseElement');
baseCanvasElement.mockImplementation(jest.requireActual('../base/baseElement').baseCanvasElement);

duplicateCanvasElement.mockImplementation(jest.requireActual('../base/baseElement').duplicateCanvasElement);
baseCanvasElementsArrayToMap.mockImplementation(jest.requireActual('../base/baseElement').baseCanvasElementsArrayToMap);

jest.mock('builder_platform_interaction/flowExtensionLib', () =>
    require('builder_platform_interaction_mocks/flowExtensionLib')
);
jest.mock('builder_platform_interaction/invocableActionLib', () =>
    require('builder_platform_interaction_mocks/invocableActionLib')
);
jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getEntity: (objectType) => {
            return { apiName: objectType.charAt(0).toUpperCase() + objectType.slice(1) };
        }
    };
});

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
                setApexClasses(apexTypesForFlow);
                Store.setMockState(flowWithAllElementsUIModel);
            });
            afterAll(() => {
                Store.resetStore();
                setApexClasses(null);
            });
            it.each`
                element
                ${loopOnAccountAutoOutput}
                ${loopOnTextCollectionAutoOutput}
                ${loopOnApexAutoOutput}
                ${loopOnNestedApexTypeAutoOutput}
                ${loopOnSobjectCollectionInApexTypeAutoOutput}
                ${loopOnScreenCompSObjectCollAutoOutput}
                ${loopOnLocalActionSobjectCollInApexAutoOutput}
            `('$element.name should have storeOutputAutomatically : true', ({ element }) => {
                const createdLoop = createLoop(element);

                expect(createdLoop.storeOutputAutomatically).toBe(true);
            });
            it.each`
                loop                                            | dataType
                ${loopOnAccountAutoOutput}                      | ${'SObject'}
                ${loopOnTextCollectionAutoOutput}               | ${'String'}
                ${loopOnApexAutoOutput}                         | ${'Apex'}
                ${loopOnNestedApexTypeAutoOutput}               | ${'SObject'}
                ${loopOnSobjectCollectionInApexTypeAutoOutput}  | ${'SObject'}
                ${loopOnScreenCompSObjectCollAutoOutput}        | ${'SObject'}
                ${loopOnLocalActionSobjectCollInApexAutoOutput} | ${'SObject'}
            `('$loop.name should have dataType: $dataType', ({ loop, dataType }) => {
                const createdLoop = createLoop(loop);

                expect(createdLoop.dataType).toBe(dataType);
            });
            it.each`
                loop                                            | subtype
                ${loopOnAccountAutoOutput}                      | ${'Account'}
                ${loopOnTextCollectionAutoOutput}               | ${null}
                ${loopOnApexAutoOutput}                         | ${'ApexComplexTypeTestOne216'}
                ${loopOnNestedApexTypeAutoOutput}               | ${'Account'}
                ${loopOnSobjectCollectionInApexTypeAutoOutput}  | ${'Account'}
                ${loopOnScreenCompSObjectCollAutoOutput}        | ${'Account'}
                ${loopOnLocalActionSobjectCollInApexAutoOutput} | ${'Account'}
            `('$loop.name should have subtype: $subtype', ({ loop, subtype }) => {
                const createdLoop = createLoop(loop);

                expect(createdLoop.subtype).toBe(subtype);
            });
        });
    });

    describe('create duplicate loop', () => {
        beforeAll(() => {
            setApexClasses(apexTypesForFlow);
            Store.setMockState(flowWithAllElementsUIModel);
        });
        afterAll(() => {
            Store.resetStore();
            setApexClasses(null);
        });
        describe('automatic output', () => {
            it.each`
                element
                ${loopOnAccountAutoOutput}
                ${loopOnTextCollectionAutoOutput}
                ${loopOnApexAutoOutput}
            `('$element.name should have storeOutputAutomatically : true', ({ element }) => {
                const createdLoop = createDuplicateLoop(element);

                expect(createdLoop.duplicatedElement.storeOutputAutomatically).toBe(true);
            });
            it.each`
                loop                                            | dataType
                ${loopOnAccountAutoOutput}                      | ${'SObject'}
                ${loopOnTextCollectionAutoOutput}               | ${'String'}
                ${loopOnApexAutoOutput}                         | ${'Apex'}
                ${loopOnNestedApexTypeAutoOutput}               | ${'SObject'}
                ${loopOnSobjectCollectionInApexTypeAutoOutput}  | ${'SObject'}
                ${loopOnScreenCompSObjectCollAutoOutput}        | ${'SObject'}
                ${loopOnLocalActionSobjectCollInApexAutoOutput} | ${'SObject'}
            `('$loop.name should have dataType: $dataType', ({ loop, dataType }) => {
                const createdLoop = createDuplicateLoop(loop);

                expect(createdLoop.duplicatedElement.dataType).toBe(dataType);
            });
            it.each`
                loop                                            | subtype
                ${loopOnAccountAutoOutput}                      | ${'Account'}
                ${loopOnTextCollectionAutoOutput}               | ${null}
                ${loopOnApexAutoOutput}                         | ${'ApexComplexTypeTestOne216'}
                ${loopOnNestedApexTypeAutoOutput}               | ${'Account'}
                ${loopOnSobjectCollectionInApexTypeAutoOutput}  | ${'Account'}
                ${loopOnScreenCompSObjectCollAutoOutput}        | ${'Account'}
                ${loopOnLocalActionSobjectCollInApexAutoOutput} | ${'Account'}
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
                    ${getMetadataFlowElementByName(flowWithAllElements, 'loopOnAccountAutoOutput')}
                    ${getMetadataFlowElementByName(flowWithAllElements, 'loopOnTextCollectionAutoOutput')}
                    ${getMetadataFlowElementByName(flowWithAllElements, 'loopOnApexAutoOutput')}
                    ${getMetadataFlowElementByName(flowWithAllElements, 'loopOnNestedApexTypeAutoOutput')}
                    ${getMetadataFlowElementByName(flowWithAllElements, 'loopOnSobjectCollectionInApexTypeAutoOutput')}
                    ${getMetadataFlowElementByName(flowWithAllElements, 'loopOnScreenCompSObjectCollAutoOutput')}
                    ${getMetadataFlowElementByName(flowWithAllElements, 'loopOnLocalActionSobjectCollInApexAutoOutput')}
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
                beforeAll(() => {
                    setApexClasses(apexTypesForFlow);
                });
                afterAll(() => {
                    setApexClasses(null);
                });
                it.each`
                    element                                                                                              | dataType     | subtype
                    ${getMetadataFlowElementByName(flowWithAllElements, 'loopOnAccountAutoOutput')}                      | ${'SObject'} | ${'Account'}
                    ${getMetadataFlowElementByName(flowWithAllElements, 'loopOnTextCollectionAutoOutput')}               | ${'String'}  | ${null}
                    ${getMetadataFlowElementByName(flowWithAllElements, 'loopOnApexAutoOutput')}                         | ${'Apex'}    | ${'ApexComplexTypeTestOne216'}
                    ${getMetadataFlowElementByName(flowWithAllElements, 'loopOnNestedApexTypeAutoOutput')}               | ${'SObject'} | ${'Account'}
                    ${getMetadataFlowElementByName(flowWithAllElements, 'loopOnSobjectCollectionInApexTypeAutoOutput')}  | ${'SObject'} | ${'Account'}
                    ${getMetadataFlowElementByName(flowWithAllElements, 'loopOnScreenCompSObjectCollAutoOutput')}        | ${'SObject'} | ${'Account'}
                    ${getMetadataFlowElementByName(flowWithAllElements, 'loopOnLocalActionSobjectCollInApexAutoOutput')} | ${'SObject'} | ${'Account'}
                `(
                    '$element.name should have { storeOutputAutomatically : true, dataType : ${dataType}, subtype : ${subtype} }',
                    ({ element, dataType, subtype }) => {
                        const result = createLoopWithConnectors(element, {
                            elements: flowWithAllElementsUIModel.elements
                        });
                        const loopElement = Object.values(result.elements)[0];
                        expect(loopElement.storeOutputAutomatically).toBe(true);
                        expect(loopElement.dataType).toBe(dataType);
                        expect(loopElement.subtype).toBe(subtype);
                        expect(loopElement[INCOMPLETE_ELEMENT]).toBeUndefined();
                    }
                );
                // W-10384755: set INCOMPLETE_ELEMENT status if collectionReference's dataType is not set
                it.each`
                    element
                    ${getMetadataFlowElementByName(flowWithAllElements, 'loopOnAccountAutoOutput')}
                    ${getMetadataFlowElementByName(flowWithAllElements, 'loopOnTextCollectionAutoOutput')}
                    ${getMetadataFlowElementByName(flowWithAllElements, 'loopOnApexAutoOutput')}
                `(
                    '$element.name should have INCOMPLETE_ELEMENT property set to true and type should not be set',
                    ({ element }) => {
                        const elements = flowWithAllElementsUIModel.elements;
                        // set the collectionReference's dataType to null to test the INCOMLETE_ELEMENT status
                        const collectionReference = Object.values(elements).find(
                            (ele) => ele.name === element.collectionReference
                        );
                        const oldDataType = collectionReference.dataType;
                        collectionReference.dataType = null;
                        const result = createLoopWithConnectors(element, {
                            elements
                        });
                        const loopElement = Object.values(result.elements)[0];
                        expect(loopElement.storeOutputAutomatically).toBe(true);
                        expect(loopElement[INCOMPLETE_ELEMENT]).toBe(true);
                        expect(loopElement.dataType).toBeUndefined();
                        expect(loopElement.subtype).toBeUndefined();
                        collectionReference.dataType = oldDataType;
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
            ${loopOnAccountAutoOutput}
            ${loopOnTextCollectionManualOutput}
            ${loopOnTextCollectionAutoOutput}
            ${loopOnApexAutoOutput}
            ${loopOnNestedApexTypeAutoOutput}
            ${loopOnSobjectCollectionInApexTypeAutoOutput}
            ${loopOnScreenCompSObjectCollAutoOutput}
            ${loopOnLocalActionSobjectCollInApexAutoOutput}
        `('$element.name does not set storeOutputAutomatically', ({ element }) => {
            const createdLoop = createLoopMetadataObject(element);

            expect(createdLoop.storeOutputAutomatically).toBeUndefined();
        });
        it.each`
            element
            ${loopOnAccountAutoOutput}
            ${loopOnTextCollectionManualOutput}
            ${loopOnTextCollectionAutoOutput}
            ${loopOnApexAutoOutput}
            ${loopOnNestedApexTypeAutoOutput}
            ${loopOnSobjectCollectionInApexTypeAutoOutput}
            ${loopOnScreenCompSObjectCollAutoOutput}
            ${loopOnLocalActionSobjectCollInApexAutoOutput}
        `('$element.name does not set dataType', ({ element }) => {
            const createdLoop = createLoopMetadataObject(element);

            expect(createdLoop.dataType).toBeUndefined();
        });
        it.each`
            element
            ${loopOnAccountAutoOutput}
            ${loopOnTextCollectionManualOutput}
            ${loopOnTextCollectionAutoOutput}
            ${loopOnNestedApexTypeAutoOutput}
            ${loopOnSobjectCollectionInApexTypeAutoOutput}
            ${loopOnScreenCompSObjectCollAutoOutput}
            ${loopOnLocalActionSobjectCollInApexAutoOutput}
        `('$element.name does not set subtype', ({ element }) => {
            const createdLoop = createLoopMetadataObject(element);

            expect(createdLoop.subtype).toBeUndefined();
        });
    });
});
