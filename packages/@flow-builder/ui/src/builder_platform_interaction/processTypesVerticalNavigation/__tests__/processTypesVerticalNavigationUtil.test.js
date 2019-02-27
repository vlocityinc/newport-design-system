import {getProcessTypesWithIcons, PROCESS_TYPE_DEFAULT_ICON, PROCESS_TYPES_ICONS} from "../processTypesVerticalNavigationUtil";
import { FLOW_PROCESS_TYPE } from "builder_platform_interaction/flowMetadata";
import { MOCK_ALL_PROCESS_TYPES } from "mock/processTypesData";

const getProcessTypesWithIconsWithProcessTypes = getProcessTypesWithIcons.bind(null, MOCK_ALL_PROCESS_TYPES);
const getFeaturedProcessTypesWithIconsWithProcessTypes = getProcessTypesWithIconsWithProcessTypes.bind(null, PROCESS_TYPES_ICONS.FEATURED);
const getOtherProcessTypesWithIconsWithProcessTypes = getProcessTypesWithIconsWithProcessTypes.bind(null, PROCESS_TYPES_ICONS.OTHERS);

describe('processTypesVerticalNavigationUtil', () => {
    test('No filtering: all process types returned', () => {
        const actualResult = getFeaturedProcessTypesWithIconsWithProcessTypes();
        expect(actualResult).toHaveLength(MOCK_ALL_PROCESS_TYPES.length);
    });
    test('Icon fetched (NO fallback)', () => {
        const actualResult = getOtherProcessTypesWithIconsWithProcessTypes();
        expect(actualResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ label: 'User Provisioning Flow', name: FLOW_PROCESS_TYPE.USER_PROVISIONING_FLOW, iconName: PROCESS_TYPES_ICONS.OTHERS.get(FLOW_PROCESS_TYPE.USER_PROVISIONING_FLOW)})]));
    });
    test('Default icon fetched (fallback)', () => {
        const actualResult = getOtherProcessTypesWithIconsWithProcessTypes();
        expect(actualResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ label: 'Well no icon yet', name: "WeDoNotKnowYou", iconName: PROCESS_TYPE_DEFAULT_ICON})]));
    });
});