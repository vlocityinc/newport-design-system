// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

import { FLOW_TRIGGER_TYPE, FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { TRIGGER_TYPE_LABELS, PROCESS_TRIGGER_TYPE_LABELS } from 'builder_platform_interaction/processTypeLib';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import { getProcessTypes } from 'builder_platform_interaction/systemLib';

import {
    copyAlcExtraProps,
    findStartElement,
    getChildCount,
    supportsChildren,
    getElementsMetadata,
    setElementsMetadata,
    startElementDescription
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

const { AFTER_SAVE, BEFORE_DELETE, BEFORE_SAVE, SCHEDULED, PLATFORM_EVENT } = FLOW_TRIGGER_TYPE;

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
        it('returns the trigger type label for record change, scheduled and platform event trigger types', () => {
            const triggerTypes = [AFTER_SAVE, BEFORE_DELETE, BEFORE_SAVE, SCHEDULED, PLATFORM_EVENT];
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
});
