import { isDevNameInStore, getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

export const MAP_COMPATIBLE_TYPES = [FLOW_DATA_TYPE.SOBJECT.value];

export interface MapElement {
    collectionReference: { value: string | null; error: string | null };
    currentValueFromCollection: { value: string | null; error: string | null };
    outputTable: { value: string | null; error: string | null };
    mapItems: [];
    storeOutputAutomatically: true;
}

export const getUniqueElementName = (name): string => {
    if (isDevNameInStore(name)) {
        return getUniqueElementName(name + '_0');
    }
    return name;
};

export const devNameToGuid = (devName): string | undefined => {
    // not case-sensitive
    const elementUi = getElementByDevName(devName);
    if (elementUi) {
        return elementUi.guid;
    }
    return undefined;
};

export const DEFAULT_CURRENT_ITEM_VARIABLE = 'currentItemFromCollection';
export const DEFAULT_CURRENT_ITEM_VARIABLE_PREFIX = 'currentItem_';
export const DEFAULT_OUTPUT_TYPE = 'Recommendation';
