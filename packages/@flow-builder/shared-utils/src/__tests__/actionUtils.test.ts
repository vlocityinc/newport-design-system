import { getCustomIconNameAndSrc } from '../actionUtils';

const STANDARD_ACTION = 'ActionCall';
const INVOCABLE_APEX_ACTION = 'APEX_CALL';
const CUSTOM_ACTION_CALL = 'CustomActionCall';

const invocableApexActionsWithWrongIconPrefix = [
    {
        actionName: 'CustomActionCall',
        iconResource: 'custom:custom9'
    }
];

const invocableApexActions = [
    {
        actionName: 'CustomActionCall',
        iconResource: 'slds:custom:custom9'
    }
];

const noIconInformation = { iconName: null, iconSrc: null };

describe('Custom icon information for standard actions', () => {
    it('return null', () => {
        expect(getCustomIconNameAndSrc(STANDARD_ACTION, CUSTOM_ACTION_CALL, invocableApexActions)).toStrictEqual(
            noIconInformation
        );
    });
});

describe('Custom icon information when there is no information of IA actions and corresponding icons', () => {
    it('return null', () => {
        expect(getCustomIconNameAndSrc(INVOCABLE_APEX_ACTION, CUSTOM_ACTION_CALL, [])).toStrictEqual(noIconInformation);
    });
});

describe('Custom icon information when there is no action name information', () => {
    it('return null', () => {
        expect(getCustomIconNameAndSrc(INVOCABLE_APEX_ACTION, null, invocableApexActions)).toStrictEqual(
            noIconInformation
        );
    });
});

describe('Custom icon information when icon resource has unexpected prefix', () => {
    it('return null', () => {
        expect(
            getCustomIconNameAndSrc(INVOCABLE_APEX_ACTION, CUSTOM_ACTION_CALL, invocableApexActionsWithWrongIconPrefix)
        ).toStrictEqual(noIconInformation);
    });
});

describe('Custom icon information for invocable apex action with custom icon', () => {
    it('return custom icon name', () => {
        expect(getCustomIconNameAndSrc(INVOCABLE_APEX_ACTION, CUSTOM_ACTION_CALL, invocableApexActions)).toStrictEqual({
            iconName: 'custom:custom9',
            iconSrc: null
        });
    });
});
