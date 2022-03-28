import { getCustomIconNameOrSrc } from '../customIconUtils';

const CUSTOM_ACTION_CALL = 'CustomActionCall';
const TEST_ACTION_CALL = 'TestActionCall';

const actionWithCustomSldsIconMap = { CustomActionCall: 'slds:custom:custom9' };

const actionWithCustomSvgIconMap = { CustomActionCall: 'resource:/resource/23425346452343536/customIcon#top' };

const noIconInformation = { iconName: null, iconSrc: null };

describe('Custom SVG icon information for actions with no custom icon information', () => {
    it('return null', () => {
        expect(getCustomIconNameOrSrc(TEST_ACTION_CALL, actionWithCustomSvgIconMap)).toStrictEqual(noIconInformation);
    });
});

describe('Custom icon information when there is no information of IA actions and corresponding icons', () => {
    it('return null', () => {
        expect(getCustomIconNameOrSrc(CUSTOM_ACTION_CALL, {})).toStrictEqual(noIconInformation);
    });
});

describe('Custom icon information when there is no action name information', () => {
    it('return null', () => {
        expect(getCustomIconNameOrSrc(null, actionWithCustomSldsIconMap)).toStrictEqual(noIconInformation);
    });
});

describe('Custom icon information for action with custom icon', () => {
    it('return custom icon name', () => {
        expect(getCustomIconNameOrSrc(CUSTOM_ACTION_CALL, actionWithCustomSldsIconMap)).toStrictEqual({
            iconName: 'custom:custom9',
            iconSrc: null
        });
    });
});

describe('Custom icon information for invocable standard action with custom icon', () => {
    it('return custom icon name', () => {
        expect(getCustomIconNameOrSrc(CUSTOM_ACTION_CALL, actionWithCustomSldsIconMap)).toStrictEqual({
            iconName: 'custom:custom9',
            iconSrc: null
        });
    });
});
