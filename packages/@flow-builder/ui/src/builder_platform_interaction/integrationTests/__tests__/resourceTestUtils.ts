import { addElement, deleteElements, updateElement } from 'builder_platform_interaction/actions';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { createVariable } from 'builder_platform_interaction/elementFactory';
import { EditElementEvent, NewResourceEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';

let nextInlineResource;

const newResourceEventListener = (event) => {
    const newResource = event.detail.newResourceInfo?.newResource;
    if (newResource) {
        nextInlineResource.name = newResource.name;
        nextInlineResource.storedValueDataType = newResource.storedValueDataType;
    }
    Store.getStore().dispatch(addElement(nextInlineResource));
    nextInlineResource = undefined;
};

const editResourceEventListener = () => {
    nextInlineResource.isInlineEditingResource = true;
    Store.getStore().dispatch(updateElement(nextInlineResource));
    nextInlineResource = undefined;
};

export const addNewResourceEventListener = () =>
    document.addEventListener(NewResourceEvent.EVENT_NAME, newResourceEventListener);

export const removeNewResourceEventListener = () =>
    document.removeEventListener(NewResourceEvent.EVENT_NAME, newResourceEventListener);

export const addEditResourceEventListener = () =>
    document.addEventListener(EditElementEvent.EVENT_NAME, editResourceEventListener);

export const removeEditResourceEventListener = () =>
    document.removeEventListener(EditElementEvent.EVENT_NAME, editResourceEventListener);
/**
 * Set the resource node to add to the store when "New Resource" is selected in the combobox
 *
 * @param resourceNode
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
