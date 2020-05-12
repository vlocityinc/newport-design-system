// @ts-nocheck
import { getProcessTypesWithIcons } from '../processTypeUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { MOCK_ALL_PROCESS_TYPES } from 'mock/processTypesData';

const getProcessTypesWithIconsWithProcessTypes = getProcessTypesWithIcons.bind(null, MOCK_ALL_PROCESS_TYPES);

describe('processTypesUtils', () => {
    test('No filtering: all process types returned', () => {
        const actualResult = getProcessTypesWithIconsWithProcessTypes();
        expect(actualResult).toHaveLength(MOCK_ALL_PROCESS_TYPES.length);
    });
    test('Icon fetched (NO fallback)', () => {
        const actualResult = getProcessTypesWithIconsWithProcessTypes();
        expect(actualResult).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    label: 'User Provisioning Flow',
                    name: FLOW_PROCESS_TYPE.USER_PROVISIONING_FLOW,
                    iconName: 'utility:user'
                })
            ])
        );
    });
    test('Default icon fetched (fallback)', () => {
        const actualResult = getProcessTypesWithIconsWithProcessTypes();
        expect(actualResult).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    label: 'Well no icon yet',
                    name: 'WeDoNotKnowYou',
                    iconName: 'utility:flow'
                })
            ])
        );
    });
});
