import { ConnectionSource, FlowModel, Guid, HighlightInfo } from './model';
import {
    addElement,
    addFault,
    clearCanvasDecoration,
    createConnection,
    decorateElements,
    deleteElement,
    deleteFault,
    deleteGoToConnection,
    ElementService,
    initFlowModel,
    updateChildren,
    updateChildrenOnAddingOrUpdatingScheduledPaths
} from './modelUtils';
import NodeType from './NodeType';

enum ActionType {
    Init,
    AddElement,
    DeleteElement,
    AddFault,
    DeleteFault,
    UpdateChildren,
    CreateGoToConnection,
    DeleteGoToConnection,
    DecorateCanvas,
    ClearCanvasDecoration,
    UpdateChildrenOnAddingOrUpdatingScheduledPaths
}

/*
 * Auto Layout Canvas reducer, and its actions
 */

/**
 * Creates an action with a payload
 *
 * @param type - The action type
 * @param payload - The action payload
 * @returns - Action with type and payload
 */
function createPayloadAction<T, P>(type: T, payload: P) {
    return { type, payload };
}

/**
 * Creates an Init action for the auto layout canvas
 *
 * @param startElementGuid - The guid of the start element
 * @param endElementGuid = The guid of the end element
 * @returns An Init action
 */
export function initAction(startElementGuid: Guid, endElementGuid: Guid) {
    return createPayloadAction(<const>ActionType.Init, { startElementGuid, endElementGuid });
}

/**
 * Creates an AddElement action
 *
 * @param elementGuid - The guid of the element to add
 * @param nodeType  - The node type for the element
 * @param source - The connection source
 * @returns An AddElement action
 */
export function addElementAction(elementGuid: Guid, nodeType: NodeType, source: ConnectionSource) {
    return createPayloadAction(<const>ActionType.AddElement, { elementGuid, nodeType, source });
}

/**
 * Creates an DeleteElement action
 *
 * @param elementGuid - The guid of the element to delete
 * @param childIndexToKeep - The index of the child to keep, if any (used when deleting a branching element)
 * @returns A DeleteElement Action
 */
export function deleteElementAction(elementGuid: Guid, childIndexToKeep?: number) {
    return createPayloadAction(<const>ActionType.DeleteElement, { elementGuid, childIndexToKeep });
}

/**
 * Creates an DeleteFault action
 *
 * @param elementGuid - The guid of an element that has a fault
 * @returns A DeleteFault action
 */
export function deleteFaultAction(elementGuid: Guid) {
    return createPayloadAction(<const>ActionType.DeleteFault, { elementGuid });
}

/**
 * Created the CreateGoToConnection action
 *
 * @param source - The connection source
 * @param target - Guid of the target element
 * @param isReroute - Whether this is a reroute of an existing Goto connection
 * @returns CreateGoToConnection action
 */
export function createGoToConnectionAction(source: ConnectionSource, target: Guid, isReroute?: boolean) {
    return createPayloadAction(<const>ActionType.CreateGoToConnection, {
        source,
        target,
        isReroute
    });
}

/**
 * Create the DeleteGoToConnection action
 *
 * @param sourceGuid - Guid of the source element
 * @param sourceBranchIndex - Index of branch on which GoTo is being deleted
 * @returns DeleteGoToConnection action
 */
export function deleteGoToConnectionAction(sourceGuid: Guid, sourceBranchIndex: number) {
    return createPayloadAction(<const>ActionType.DeleteGoToConnection, { sourceGuid, sourceBranchIndex });
}

/**
 * Creates an AddFault action
 *
 * @param elementGuid - The guid of an element to add a fault to
 * @returns An AddFault action
 */
export function addFaultAction(elementGuid: Guid) {
    return createPayloadAction(<const>ActionType.AddFault, { elementGuid });
}

/**
 * Creates an UpdateChildren action
 *
 * @param parentElementGuid - The guid of the parent element
 * @param updatedChildReferences - Updated childReferences array
 * @returns An UpdateChildren action
 */
export function updateChildrenAction(parentElementGuid: Guid, updatedChildReferences: { childReference: string }[]) {
    return createPayloadAction(<const>ActionType.UpdateChildren, { parentElementGuid, updatedChildReferences });
}

/**
 * Create a decorateCanvas action
 *
 * @param decoratedElements - The map of element guids to highlight info
 * @returns An decorateCanvas action
 */
export function decorateCanvasAction(decoratedElements: Map<Guid, HighlightInfo>) {
    return createPayloadAction(<const>ActionType.DecorateCanvas, { decoratedElements });
}

/**
 * Create a clearCanvasDecoration action
 *
 * @returns - A clearCanvasDecoration action
 */
export function clearCanvasDecorationAction() {
    return createPayloadAction(<const>ActionType.ClearCanvasDecoration, null);
}

/**
 * Creates the UpdateChildrenOnAddingOrUpdatingScheduledPaths action
 *
 * @param parentElementGuid - The guid of the parent element (i.e. Start Element)
 * @param updatedChildReferences - Updated childReferences array
 * @returns UpdateChildrenOnAddingOrUpdatingScheduledPaths action
 */
export function updateChildrenOnAddingOrUpdatingScheduledPathsAction(
    parentElementGuid: Guid,
    updatedChildReferences: { childReference: string }[]
) {
    return createPayloadAction(<const>ActionType.UpdateChildrenOnAddingOrUpdatingScheduledPaths, {
        parentElementGuid,
        updatedChildReferences
    });
}

type Action = ReturnType<
    | typeof addElementAction
    | typeof deleteElementAction
    | typeof deleteFaultAction
    | typeof initAction
    | typeof addFaultAction
    | typeof updateChildrenAction
    | typeof createGoToConnectionAction
    | typeof deleteGoToConnectionAction
    | typeof decorateCanvasAction
    | typeof clearCanvasDecorationAction
    | typeof updateChildrenOnAddingOrUpdatingScheduledPathsAction
>;

/**
 * @param config - The reducer config
 * @param flowModel - The state of elements in the store
 * @param action - Action to execute
 * @returns - A configured reducer
 */
function reducer(config: ElementService, flowModel: Readonly<FlowModel>, action: Action): Readonly<FlowModel> {
    const nextFlowModel = flowModel;

    switch (action.type) {
        case ActionType.Init: {
            const { startElementGuid, endElementGuid } = action.payload;
            return initFlowModel(nextFlowModel, startElementGuid, endElementGuid);
        }
        case ActionType.AddElement: {
            const { elementGuid, nodeType, source } = action.payload;
            return addElement(nextFlowModel, elementGuid, nodeType, source);
        }
        case ActionType.DeleteElement: {
            const { elementGuid, childIndexToKeep } = action.payload;
            const deleteOptions = { childIndexToKeep };

            return deleteElement(config, nextFlowModel, elementGuid, deleteOptions);
        }
        case ActionType.DeleteFault: {
            const { elementGuid } = action.payload;
            return deleteFault(config, nextFlowModel, elementGuid);
        }

        case ActionType.CreateGoToConnection: {
            const { source, target, isReroute } = action.payload;
            return createConnection(config, nextFlowModel, source, target, isReroute);
        }
        case ActionType.DeleteGoToConnection: {
            const { sourceGuid: guid, sourceBranchIndex: childIndex } = action.payload;
            return deleteGoToConnection(config, nextFlowModel, { guid, childIndex });
        }
        case ActionType.AddFault: {
            const { elementGuid } = action.payload;
            return addFault(config, nextFlowModel, elementGuid);
        }
        case ActionType.UpdateChildren: {
            const { parentElementGuid, updatedChildReferences } = action.payload;
            return updateChildren(config, nextFlowModel, parentElementGuid, updatedChildReferences);
        }
        case ActionType.DecorateCanvas: {
            const { decoratedElements } = action.payload;
            return decorateElements(clearCanvasDecoration(nextFlowModel), decoratedElements);
        }
        case ActionType.ClearCanvasDecoration: {
            return clearCanvasDecoration(nextFlowModel);
        }
        case ActionType.UpdateChildrenOnAddingOrUpdatingScheduledPaths: {
            const { parentElementGuid, updatedChildReferences } = action.payload;
            return updateChildrenOnAddingOrUpdatingScheduledPaths(
                config,
                nextFlowModel,
                parentElementGuid,
                updatedChildReferences
            );
        }
        default:
            return nextFlowModel;
    }
}

/**
 * Creates a configured Auto Layout Canvas reducer
 *
 * @param config - The reducer config
 * @returns A configured reducer
 */
export default function createReducer(config: ElementService) {
    return (flowModel: FlowModel, action: Action) => reducer(config, flowModel, action);
}
