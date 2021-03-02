import { NewResourceEvent } from 'builder_platform_interaction/events';
import { Store } from 'builder_platform_interaction/storeLib';
import { addElement, deleteElements } from 'builder_platform_interaction/actions';
import { createVariable } from 'builder_platform_interaction/elementFactory';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';

let nextInlineResource;

const newResourceEventListener = () => {
    Store.getStore().dispatch(addElement(nextInlineResource));
    nextInlineResource = undefined;
};

export const addNewResourceEventListener = () =>
    document.addEventListener(NewResourceEvent.EVENT_NAME, newResourceEventListener);

export const removeNewResourceEventListener = () =>
    document.removeEventListener(NewResourceEvent.EVENT_NAME, newResourceEventListener);

/**
 * Set the resource node to add to the store when "New Resource" is selected in the combobox
 */
export const setNextInlineResource = (resourceNode) => {
    nextInlineResource = resourceNode;
};

export const addRecordVariable = (name, subtype, isCollection = false) =>
    Store.getStore().dispatch(
        addElement(createVariable({ name, dataType: FLOW_DATA_TYPE.SOBJECT.value, subtype, isCollection }))
    );

export const deleteVariableWithName = (name) =>
    Store.getStore().dispatch(
        deleteElements({
            elementType: ELEMENT_TYPE.VARIABLE,
            selectedElements: [getElementByDevName(name)]
        })
    );
