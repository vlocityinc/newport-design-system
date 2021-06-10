import { isDevNameInStore, getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

export const MAP_COMPATIBLE_TYPES = [FLOW_DATA_TYPE.SOBJECT.value];

export interface MapElement {
    collectionReference: { value: string | null; error: string | null };
    assignmentItems: any[];
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
