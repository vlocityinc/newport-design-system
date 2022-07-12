// @ts-nocheck
import { ELEMENT_TYPE, FLOW_PROCESS_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { PROCESS_TRIGGER_TYPE_LABELS, TRIGGER_TYPE_LABELS } from 'builder_platform_interaction/processTypeLib';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import { getProcessTypes } from 'builder_platform_interaction/systemLib';
import {
    copyAlcExtraProps,
    createPastedCanvasElement,
    findStartElement,
    getChildCount,
    getElementsMetadata,
    setElementsMetadata,
    startElementDescription,
    supportsChildren
} from '../alcCanvasUtils';

jest.mock('builder_platform_interaction/systemLib', () => {
    return {
        getProcessTypes: jest.fn()
    };
});

jest.mock('builder_platform_interaction/storeLib');

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getProcessType: jest.fn()
    };
});

const { AFTER_SAVE, BEFORE_DELETE, BEFORE_SAVE, SCHEDULED, PLATFORM_EVENT, EVENT_DRIVEN_JOURNEY } = FLOW_TRIGGER_TYPE;

describe('alc canvas utils', () => {
    beforeEach(() => {
        // Some tests override the getProcessType return value
        // so reset at the beginning of each test
        getProcessType.mockReturnValue('testProcessType');
        getProcessTypes.mockReturnValue([
            {
                name: 'testProcessType',
                label: 'test process type label'
            }
        ]);
    });

    describe('startElementDescription', () => {
        it('returns the trigger type label for record change, scheduled, platform event and event driven journey trigger types', () => {
            const triggerTypes = [
                AFTER_SAVE,
                BEFORE_DELETE,
                BEFORE_SAVE,
                SCHEDULED,
                PLATFORM_EVENT,
                EVENT_DRIVEN_JOURNEY
            ];
            triggerTypes.forEach((triggerType) => {
                expect(startElementDescription(triggerType)).toEqual(TRIGGER_TYPE_LABELS[triggerType]);
            });
        });

        it('returns the process type label when no trigger type', () => {
            expect(startElementDescription(FLOW_TRIGGER_TYPE.NONE)).toEqual('test process type label');
        });

        it('returns the correct label for record-triggerred orchestration', () => {
            getProcessType.mockReturnValue(FLOW_PROCESS_TYPE.ORCHESTRATOR);
            const processType = FLOW_PROCESS_TYPE.ORCHESTRATOR;
            const triggerType = AFTER_SAVE;
            expect(startElementDescription(triggerType)).toEqual(
                PROCESS_TRIGGER_TYPE_LABELS[processType + triggerType]
            );
        });

        it('returns the correct label for autolaunched orchestration', () => {
            getProcessType.mockReturnValue(FLOW_PROCESS_TYPE.ORCHESTRATOR);
            getProcessTypes.mockReturnValue([
                {
                    name: FLOW_PROCESS_TYPE.ORCHESTRATOR
                }
            ]);
            const processType = FLOW_PROCESS_TYPE.ORCHESTRATOR;
            const triggerType = FLOW_TRIGGER_TYPE.NONE;
            expect(startElementDescription(triggerType)).toEqual(
                PROCESS_TRIGGER_TYPE_LABELS[processType + triggerType]
            );
        });
    });

    describe('setElementsMetadata / getElementsMetadata', () => {
        const screenMeta = {
            elementType: 'Screen'
        };
        const actionCallMeta = {
            elementType: 'ActionCall'
        };
        const elementsMetadata = [screenMeta, actionCallMeta];

        it('returns a map of the metadata by elementType', () => {
            setElementsMetadata(elementsMetadata);

            expect(getElementsMetadata()).toEqual({
                [screenMeta.elementType]: screenMeta,
                [actionCallMeta.elementType]: actionCallMeta
            });
        });
    });

    describe('copyAlcExtraProps', () => {
        it('copies over only the alc props', () => {
            const fromElement = {
                next: 'guidNext',
                prev: 'guidPrev',
                incomingGoTo: ['guidNext'],
                children: ['guidNext'],
                parent: 'guidParent',
                childIndex: 0,
                isTerminal: false,
                fault: 'faultGuid',
                nodeType: 'screen',
                fromExtraProp: 'fromExtraProp'
            };

            const toElement = {
                toExtraProp: 'toExtraProp'
            };

            copyAlcExtraProps(fromElement, toElement);
            const expected = { ...fromElement };
            delete expected.fromExtraProp;
            Object.assign(expected, toElement);
            expect({ ...toElement }).toEqual(expected);
        });

        it('null/undefined alc props are not copied over ', () => {
            const fromElement = {
                next: null,
                prev: undefined
            };

            const toElement = {};

            copyAlcExtraProps(fromElement, toElement);
            expect({ ...toElement }).toEqual({});
        });
    });

    describe('findStartElement', () => {
        const startElement = {
            guid: 'start',
            elementType: ELEMENT_TYPE.START_ELEMENT
        };
        const otherElement = {
            guid: 'other',
            elementType: ELEMENT_TYPE.SCREEN
        };

        const flow = {
            [startElement.guid]: startElement,
            [otherElement.guid]: otherElement
        };

        it('returns the start element', () => {
            expect(findStartElement(flow)).toBe(startElement);
        });
    });

    describe('getChildCount and supportsChildren', () => {
        const childReferences = [
            {
                childReference: 'child-reference-guid-1'
            },
            {
                childReference: 'child-reference-guid-2'
            }
        ];

        it('returns null when children are not supported', () => {
            const screenElement = {
                elementType: ELEMENT_TYPE.SCREEN,
                childReferences
            };
            expect(supportsChildren(screenElement)).toBe(false);
            expect(getChildCount(screenElement)).toBeNull();
        });

        it('returns 1 for loops', () => {
            const loopElement = { elementType: ELEMENT_TYPE.LOOP };

            expect(supportsChildren(loopElement)).toBe(true);
            expect(getChildCount(loopElement)).toBe(1);
        });

        it('returns null for start with no child references ', () => {
            const startElement = { elementType: ELEMENT_TYPE.START_ELEMENT };

            expect(supportsChildren(startElement)).toBe(false);
            expect(getChildCount(startElement)).toBe(null);
        });

        it('returns count(childReferences) + 1 for start with child references ', () => {
            const startElement = {
                elementType: ELEMENT_TYPE.START_ELEMENT,
                childReferences
            };

            expect(supportsChildren(startElement)).toBe(true);
            expect(getChildCount(startElement)).toBe(childReferences.length + 1);
        });

        it('returns count(childReferences) + 1 for decision', () => {
            const decisionElement = {
                elementType: ELEMENT_TYPE.DECISION,
                childReferences
            };

            expect(supportsChildren(decisionElement)).toBe(true);
            expect(getChildCount(decisionElement)).toBe(childReferences.length + 1);
        });

        it('returns count(childReferences) + 1 for wait', () => {
            const waitElement = {
                elementType: ELEMENT_TYPE.WAIT,
                childReferences
            };

            expect(supportsChildren(waitElement)).toBe(true);
            expect(getChildCount(waitElement)).toBe(childReferences.length + 1);
        });
    });

    describe('createPastedCanvasElement Function', () => {
        describe('When the prev and next element are also copied', () => {
            const canvasElementGuidMap = {
                screen1: 'pastedScreen1',
                screen2: 'pastedScreen2',
                decision1: 'pastedDecision1',
                screen3: 'pastedScreen3',
                screen4: 'pastedScreen4'
            };
            const topCutOrCopiedGuid = 'screen1';
            const bottomCutOrCopiedGuid = 'screen4';
            const prev = 'startElement';
            const next = 'screen1';

            const source = {
                guid: 'startElement'
            };

            it('Should have updated guid, prev and next properties', () => {
                const duplicatedElement = {
                    guid: 'pastedScreen2',
                    prev: 'screen1',
                    next: 'decision1'
                };

                const pastedCanvasElement = createPastedCanvasElement(
                    duplicatedElement,
                    canvasElementGuidMap,
                    topCutOrCopiedGuid,
                    bottomCutOrCopiedGuid,
                    source,
                    'screen1'
                );

                expect(pastedCanvasElement).toMatchObject({
                    guid: 'pastedScreen2',
                    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
                    prev: 'pastedScreen1',
                    next: 'pastedDecision1'
                });
            });

            it('Should update the children array', () => {
                const duplicatedElement = {
                    guid: 'pastedDecision1',
                    prev: 'screen2',
                    next: 'screen4',
                    children: ['screen3', 'screen5']
                };

                const pastedCanvasElement = createPastedCanvasElement(
                    duplicatedElement,
                    canvasElementGuidMap,
                    topCutOrCopiedGuid,
                    bottomCutOrCopiedGuid,
                    source
                );

                expect(pastedCanvasElement).toMatchObject({
                    guid: 'pastedDecision1',
                    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
                    prev: 'pastedScreen2',
                    next: 'pastedScreen4',
                    children: ['pastedScreen3', null]
                });
            });

            it('Should update the parent guid', () => {
                const duplicatedElement = {
                    guid: 'pastedScreen3',
                    prev: null,
                    next: null,
                    parent: 'decision1',
                    childIndex: 0
                };

                const pastedCanvasElement = createPastedCanvasElement(
                    duplicatedElement,
                    canvasElementGuidMap,
                    topCutOrCopiedGuid,
                    bottomCutOrCopiedGuid,
                    source
                );

                expect(pastedCanvasElement).toMatchObject({
                    guid: 'pastedScreen3',
                    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
                    prev: null,
                    next: null,
                    parent: 'pastedDecision1',
                    childIndex: 0
                });
            });
        });

        describe('When pasting the top or bottom selected element', () => {
            const canvasElementGuidMap = {
                decision1: 'pastedDecision1',
                screen2: 'pastedScreen2'
            };
            const topCutOrCopiedGuid = 'decision1';
            const bottomCutOrCopiedGuid = 'screen2';

            const next = 'screen1';

            const source = {
                guid: 'startElement'
            };

            it('Top-Selected: Should update the prev and next properties', () => {
                const duplicatedElement = {
                    guid: 'pastedDecision1',
                    prev: 'screen1',
                    next: 'screen2',
                    children: [null, null]
                };

                const pastedCanvasElement = createPastedCanvasElement(
                    duplicatedElement,
                    canvasElementGuidMap,
                    topCutOrCopiedGuid,
                    bottomCutOrCopiedGuid,
                    source
                );

                expect(pastedCanvasElement).toMatchObject({
                    guid: 'pastedDecision1',
                    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
                    prev: 'startElement',
                    next: 'pastedScreen2',
                    children: [null, null]
                });
            });

            it('Top-Selected: Should update the children property', () => {
                const duplicatedElement = {
                    guid: 'pastedDecision1',
                    prev: 'screen1',
                    next: 'screen2',
                    children: ['screen3', 'screen4']
                };

                const pastedCanvasElement = createPastedCanvasElement(
                    duplicatedElement,
                    canvasElementGuidMap,
                    topCutOrCopiedGuid,
                    bottomCutOrCopiedGuid,
                    source,
                    next
                );

                expect(pastedCanvasElement).toMatchObject({
                    guid: 'pastedDecision1',
                    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
                    prev: 'startElement',
                    next: 'pastedScreen2',
                    children: [null, null]
                });
            });

            it('Top-Selected: Should delete parent and childIndex properties if not pasting on the head branch', () => {
                const duplicatedElement = {
                    guid: 'pastedDecision1',
                    prev: null,
                    next: 'screen2',
                    children: [null, null],
                    parent: 'tempDecision',
                    childIndex: 0
                };

                const pastedCanvasElement = createPastedCanvasElement(
                    duplicatedElement,
                    canvasElementGuidMap,
                    topCutOrCopiedGuid,
                    bottomCutOrCopiedGuid,
                    source,
                    next
                );

                expect(pastedCanvasElement).toMatchObject({
                    guid: 'pastedDecision1',
                    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
                    prev: 'startElement',
                    next: 'pastedScreen2',
                    children: [null, null]
                });
            });

            it('Top-Selected: Should update parent and childIndex properties and remove isTerminal property when pasting on the head branch', () => {
                const duplicatedElement = {
                    guid: 'pastedDecision1',
                    prev: 'screen1',
                    next: 'screen2',
                    children: [null, null],
                    isTerminal: true
                };

                const pastedCanvasElement = createPastedCanvasElement(
                    duplicatedElement,
                    canvasElementGuidMap,
                    topCutOrCopiedGuid,
                    bottomCutOrCopiedGuid,
                    { guid: 'tempDecision', childIndex: 1 },
                    next
                );

                expect(pastedCanvasElement).toMatchObject({
                    guid: 'pastedDecision1',
                    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
                    prev: undefined,
                    next: 'pastedScreen2',
                    children: [null, null],
                    parent: 'tempDecision',
                    childIndex: 1
                });
            });

            it('Bottom-Selected: Should update prev and next properties', () => {
                const duplicatedElement = {
                    guid: 'pastedScreen2',
                    prev: 'decision1',
                    next: 'endElement'
                };

                const pastedCanvasElement = createPastedCanvasElement(
                    duplicatedElement,
                    canvasElementGuidMap,
                    topCutOrCopiedGuid,
                    bottomCutOrCopiedGuid,
                    source,
                    next
                );

                expect(pastedCanvasElement).toMatchObject({
                    guid: 'pastedScreen2',
                    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
                    prev: 'pastedDecision1',
                    next: 'screen1'
                });
            });
        });

        describe('When element has a fault branch', () => {
            const canvasElementGuidMap = {
                pause1: 'pastedPause1',
                pause2: 'pastedPause2'
            };
            const topCutOrCopiedGuid = 'pause1';
            const bottomCutOrCopiedGuid = 'pause1';
            const prev = 'pause2';
            const next = 'end2';

            const source = {
                guid: 'pause2'
            };

            it('Pasted Pause 1 should have updated guid, prev, next and fault properties', () => {
                const duplicatedElement = {
                    guid: 'pastedPause1',
                    prev: 'start1',
                    next: 'end1',
                    fault: 'pause2'
                };

                const pastedCanvasElement = createPastedCanvasElement(
                    duplicatedElement,
                    canvasElementGuidMap,
                    topCutOrCopiedGuid,
                    bottomCutOrCopiedGuid,
                    source,
                    next
                );

                expect(pastedCanvasElement).toEqual({
                    guid: 'pastedPause1',
                    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
                    prev: 'pause2',
                    next: 'end2',
                    fault: 'pastedPause2',
                    incomingGoTo: []
                });
            });

            it('Pasted Pause 2 should have updated guid, prev and next properties. Fault property should be removed', () => {
                const duplicatedElement = {
                    guid: 'pastedPause2',
                    prev: null,
                    next: 'end2',
                    parent: 'pause1',
                    childIndex: -1,
                    fault: 'assignment1'
                };

                const pastedCanvasElement = createPastedCanvasElement(
                    duplicatedElement,
                    canvasElementGuidMap,
                    topCutOrCopiedGuid,
                    bottomCutOrCopiedGuid,
                    source
                );

                expect(pastedCanvasElement).toEqual({
                    guid: 'pastedPause2',
                    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
                    prev: null,
                    next: null,
                    incomingGoTo: [],
                    parent: 'pastedPause1',
                    childIndex: -1
                });
            });
        });
    });
});
