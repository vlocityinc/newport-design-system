const SLDS_ICON_PREFIX = 'slds';

/**
 * Checks for custom icon associated with the given key and returns it if found.
 *
 * @param key - key of the object
 * @param customIconMap - map of keys and corresponding custom icon name
 * @returns custom icon name and url. Only one will be defined.
 */
export function getCustomIconNameOrSrc(
    key: string | undefined,
    customIconMap: { [key: string]: string }
): { iconName: string | null; iconSrc: string | null } {
    let iconName: string | null = null,
        iconSrc: string | null = null;

    if (key && key in customIconMap) {
        // The icon resource could be a custom slds icon or a custom svg saved as a static resource
        // custom slds icon resource will start with prefix "slds:" , example - "slds:standard:account"
        // custom svg icon resource will start with prefix "resource:" , example - "resource:/resource/23423423453442234/customSVG:Id"
        const iconResource = customIconMap[key];
        const prefix = iconResource.split(':')[0];
        const resource = removePrefixFromCustomIcon(iconResource);

        ({ iconName, iconSrc } =
            prefix === SLDS_ICON_PREFIX
                ? { iconName: resource, iconSrc: null }
                : { iconName: null, iconSrc: resource });
    }
    return { iconName, iconSrc };
}

/**
 * Returns the icon name without the prefix
 *
 * @param iconName the icon name with prefix
 * @returns icon name
 */
export function removePrefixFromCustomIcon(iconName: string) {
    return iconName?.substring(iconName.indexOf(':') + 1);
}
