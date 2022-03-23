const APEX_CALL = 'APEX_CALL';
const SLDS_ICON_PREFIX = 'slds';
const RESOURCE_ICON_PREFIX = 'resource';

/**
 * Checks for custom icon connected with the apex action and returns it if found.
 *
 * @param elementType Node element type
 * @param actionName action name of the node element
 * @param invocableApexActions - map of action names and corresponding custom icon name
 * @returns custom icon name and url. Only one will be defined.
 */
export function getCustomIconNameAndSrc(
    elementType,
    actionName,
    invocableApexActions
): { iconName: string | null; iconSrc: string | null } {
    let iconName: string | null = null,
        iconSrc: string | null = null;

    if (elementType && elementType === APEX_CALL && invocableApexActions) {
        const action = invocableApexActions.find((action) => action.actionName === actionName);
        const prefix = action?.iconResource?.split(':')[0];
        const resource = action?.iconResource?.substring(action.iconResource.indexOf(':') + 1);
        if (prefix && (prefix.includes(SLDS_ICON_PREFIX) || prefix.includes(RESOURCE_ICON_PREFIX)) && resource) {
            ({ iconName, iconSrc } =
                prefix === SLDS_ICON_PREFIX
                    ? { iconName: resource, iconSrc: null }
                    : { iconName: null, iconSrc: resource });
        }
    }
    return { iconName, iconSrc };
}
