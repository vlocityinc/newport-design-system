// @ts-nocheck
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { ALL_PROCESS_TYPE, cacheTemplates, getTemplates } from 'builder_platform_interaction/processTypeLib';
import { MOCK_ALL_TEMPLATES, MOCK_AUTO_TEMPLATE, MOCK_SCREEN_TEMPLATE_1, MOCK_SCREEN_TEMPLATE_2 } from 'mock/templates';
import { processTypes } from 'serverData/GetProcessTypes/processTypes.json';

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

describe('templatesUtils', () => {
    describe('caching the templates', () => {
        beforeEach(() => {
            cacheTemplates(processTypes, ALL_PROCESS_TYPE.name, MOCK_ALL_TEMPLATES);
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
            const checkoutTemplates = getTemplates([FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE]);
            expect(checkoutTemplates).toHaveLength(0);
        });
    });
});
