import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    ALL_PROCESS_TYPE,
    createProcessTypeTile,
    createFlowEntryTilesForProcessTypes,
    cacheTemplates,
    getTemplates
} from 'builder_platform_interaction/processTypeLib';
import { orgHasBeforeSaveEnabled } from 'builder_platform_interaction/contextLib';
import { MOCK_ALL_TEMPLATES, MOCK_AUTO_TEMPLATE, MOCK_SCREEN_TEMPLATE_1, MOCK_SCREEN_TEMPLATE_2 } from 'mock/templates';
import { MOCK_ALL_PROCESS_TYPES } from 'mock/processTypesData';

jest.mock('builder_platform_interaction/systemLib', () => {
    return {
        getProcessTypes: jest.fn().mockImplementation(() => {
            return require('mock/processTypesData').MOCK_ALL_PROCESS_TYPES;
        })
    };
});

jest.mock('builder_platform_interaction/contextLib', () => {
    return Object.assign({}, require('builder_platform_interaction_mocks/contextLib'), {
        orgHasBeforeSaveEnabled: jest.fn().mockReturnValue(true)
    });
});

const commonUtils = jest.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest
    .fn()
    .mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

const getProcessType = processTypeName =>
    MOCK_ALL_PROCESS_TYPES.find(processType => processType.name === processTypeName);

describe('templatesUtils', () => {
    describe('getting the process types tiles', () => {
        it('should return the new screen flow tile with title and description in label file', () => {
            const screenProcessType = getProcessType(FLOW_PROCESS_TYPE.FLOW);
            expect(screenProcessType).not.toBeUndefined();
            const screenProcessTypeTiles = createFlowEntryTilesForProcessTypes([screenProcessType]);
            expect(screenProcessTypeTiles).toEqual([
                {
                    itemId: FLOW_PROCESS_TYPE.FLOW,
                    label: screenProcessType.label,
                    iconName: 'utility:desktop',
                    description: 'FlowBuilderProcessTypeTemplates.newFlowDescription',
                    processType: FLOW_PROCESS_TYPE.FLOW
                }
            ]);
        });
        it('should return multiple tiles for autolauched flow', () => {
            const autolaunchedProcessType = getProcessType(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
            expect(autolaunchedProcessType).not.toBeUndefined();
            const autolaunchedProcessTypeTiles = createFlowEntryTilesForProcessTypes([autolaunchedProcessType]);
            expect(orgHasBeforeSaveEnabled).toHaveBeenCalled();
            expect(autolaunchedProcessTypeTiles).toEqual([
                {
                    description: 'FlowBuilderProcessTypeTemplates.newBeforeSaveFlowDescription',
                    iconName: 'utility:record_update',
                    itemId: 'AutoLaunchedFlow-RecordBeforeSave',
                    label: 'FlowBuilderProcessTypeTemplates.newBeforeSaveFlowLabel',
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                    triggerType: 'RecordBeforeSave'
                },
                {
                    description: 'FlowBuilderProcessTypeTemplates.newScheduledFlowDescription',
                    iconName: 'utility:clock',
                    itemId: 'AutoLaunchedFlow-Scheduled',
                    label: 'FlowBuilderProcessTypeTemplates.newScheduledFlowLabel',
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                    triggerType: 'Scheduled'
                },
                {
                    description: 'FlowBuilderProcessTypeTemplates.newAutolaunchedFlowDescription',
                    iconName: 'utility:magicwand',
                    itemId: 'AutoLaunchedFlow',
                    label: 'Autolaunched Flow',
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW
                }
            ]);
        });
        it('should return the new checkout flow tile with default title and description in label file', () => {
            const checkoutProcessType = getProcessType(FLOW_PROCESS_TYPE.CHECKOUT_FLOW);
            expect(checkoutProcessType).not.toBeUndefined();
            const checkoutProcessTypeTile = createFlowEntryTilesForProcessTypes([checkoutProcessType]);
            expect(checkoutProcessTypeTile).toEqual([
                {
                    itemId: FLOW_PROCESS_TYPE.CHECKOUT_FLOW,
                    label: checkoutProcessType.label,
                    iconName: 'utility:cart',
                    description: 'FlowBuilderProcessTypeTemplates.newProcessTypeDescription(Checkout Flow)',
                    processType: 'CheckoutFlow'
                }
            ]);
        });
        it('thows an error when given an invalid process type name', () => {
            expect(() => createProcessTypeTile('invalidProcessType', true)).toThrow();
        });
    });
    describe('caching the templates', () => {
        beforeEach(() => {
            cacheTemplates(MOCK_ALL_PROCESS_TYPES, ALL_PROCESS_TYPE.name, MOCK_ALL_TEMPLATES);
        });
        it('should cache all the templates', () => {
            expect(getTemplates([ALL_PROCESS_TYPE.name])).toEqual(MOCK_ALL_TEMPLATES);
        });
        it('should cache the screen templates by screen process type', () => {
            const screenTemplates = getTemplates([FLOW_PROCESS_TYPE.FLOW]);
            expect(screenTemplates).toHaveLength(2);
            expect(screenTemplates).toEqual(expect.arrayContaining([MOCK_SCREEN_TEMPLATE_1]));
            expect(screenTemplates).toEqual(expect.arrayContaining([MOCK_SCREEN_TEMPLATE_2]));
        });
        it('should cache the autolaunched templates by autolaunched process type', () => {
            const autoTemplates = getTemplates([FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW]);
            expect(autoTemplates).toHaveLength(1);
            expect(autoTemplates).toEqual(expect.arrayContaining([MOCK_AUTO_TEMPLATE]));
        });
        it('should cache empty list by other process type', () => {
            const checkoutTemplates = getTemplates([FLOW_PROCESS_TYPE.CHECKOUT_FLOW]);
            expect(checkoutTemplates).toHaveLength(0);
        });
    });
});
