import { INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { createScreenElementDeselectedEvent, createScreenElementMovedEvent } from 'builder_platform_interaction/events';
import { FlowScreenFieldType, FOOTER_LABEL_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import {
    CANVAS_SCREEN_GUIDS,
    isRegionContainerField,
    ScreenCanvasKeyboardInteractions
} from 'builder_platform_interaction/screenEditorUtils';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';
const { format } = commonUtils;

type ScreenComponentInfo = {
    sourceIndex: number;
    columnIndex: number | undefined;
    sectionIndex: number | undefined;
    isColumnField: boolean;
};

type AriaInfo = {
    numColumns?: number;
    numItems: number;
    label: string;
    screenField: UI.ScreenFieldType;
};

/*
 * The screen editor canvas, support for adding, deleting, editing and rearranging fields (incomplete)
 */
export default class ScreenEditorCanvas extends LightningElement {
    @api flowLabel;
    @api screen;
    @api selectedItemGuid;
    movedItemGuid; // guid of the item being moved with keyboard
    destinationIndexForAriaText; // destination index, in case we're moving a component
    destinationColumnIndexForAriaText; // index of destination column, in case we're moving a component
    destinationSectionIndexForAriaText; // index of destination section, in case we're moving a component
    ariaDescription = ''; // currently only read out when focus lands on a component inside canvas
    initialMovedItemIndex; // initial index of the item being moved
    initialMovedItemParentGuid; // guid of the initial parent of the item being moved
    setAriaTextOnMove = false; // whether we have to set the aria text after moving
    setAriaTextOnCancel = false; // whether we have to set the aria text after cancelling
    ariaLiveInstruction = ''; // information to be relayed to users as they interact with components

    labels = LABELS;

    renderedCallback() {
        if (this.setAriaTextOnCancel) {
            this.setAriaLiveInstruction(true);
            this.setAriaTextOnCancel = false;
            this.movedItemGuid = null;
        }
        if (this.setAriaTextOnMove) {
            this.setAriaLiveInstruction(false);
            this.setAriaTextOnMove = false;
        }
    }

    @api focusHighlight() {
        const indexArray = this.screen.getFieldIndexesByGUID(this.selectedItemGuid);
        if (indexArray === -1) {
            const highlights = this.template.querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.SCREEN_EDITOR_HIGHLIGHT);
            for (let x = 0; x < highlights.length; x++) {
                highlights[x].focusIfSelected();
            }
        } else {
            const canvas = this.template.querySelector(INTERACTION_COMPONENTS_SELECTORS.SCREEN_CANVAS);
            canvas?.focusElement(indexArray);
        }
    }

    get screenConfigurationHasErrors() {
        for (const property in this.screen) {
            if (this.screen.hasOwnProperty(property)) {
                const val = this.screen[property];
                if (val && !Array.isArray(val) && val.error) {
                    return true;
                }
            }
        }

        return false;
    }

    get screenTitle() {
        return this.flowLabel || `[${LABELS.screenTitlePlaceHolder}]`;
    }

    get hasHelpText() {
        return this.screen.helpText && this.screen.helpText.value;
    }

    get headerSelected() {
        return this.selectedItemGuid === CANVAS_SCREEN_GUIDS.HEADER_GUID;
    }

    get footerSelected() {
        return this.selectedItemGuid === CANVAS_SCREEN_GUIDS.FOOTER_GUID;
    }

    get showNextOrFinish() {
        return (
            getValueFromHydratedItem(this.screen.nextOrFinishLabelType) === FOOTER_LABEL_TYPE.STANDARD ||
            (getValueFromHydratedItem(this.screen.nextOrFinishLabelType) === FOOTER_LABEL_TYPE.CUSTOM &&
                getValueFromHydratedItem(this.screen.nextOrFinishLabel))
        );
    }

    get nextOrFinishButtonText() {
        return (
            (getValueFromHydratedItem(this.screen.nextOrFinishLabelType) !== FOOTER_LABEL_TYPE.CUSTOM &&
                this.labels.finish) ||
            getValueFromHydratedItem(this.screen.nextOrFinishLabel)
        );
    }

    get showBack() {
        return (
            getValueFromHydratedItem(this.screen.backLabelType) === FOOTER_LABEL_TYPE.STANDARD ||
            (getValueFromHydratedItem(this.screen.backLabelType) === FOOTER_LABEL_TYPE.CUSTOM &&
                getValueFromHydratedItem(this.screen.backLabel))
        );
    }

    get backButtonText() {
        return (
            (getValueFromHydratedItem(this.screen.backLabelType) !== FOOTER_LABEL_TYPE.CUSTOM &&
                this.labels.previous) ||
            getValueFromHydratedItem(this.screen.backLabel)
        );
    }

    get showPause() {
        return (
            getValueFromHydratedItem(this.screen.pauseLabelType) === FOOTER_LABEL_TYPE.STANDARD ||
            (getValueFromHydratedItem(this.screen.pauseLabelType) === FOOTER_LABEL_TYPE.CUSTOM &&
                getValueFromHydratedItem(this.screen.pauseLabel))
        );
    }

    get pauseButtonText() {
        return (
            (getValueFromHydratedItem(this.screen.pauseLabelType) !== FOOTER_LABEL_TYPE.CUSTOM && this.labels.pause) ||
            getValueFromHydratedItem(this.screen.pauseLabel)
        );
    }

    clearDraggingState() {
        delete this.ranges; // Force recalculate bounding client rects for the new scroll position
        delete this.top;
    }

    getSelectedElement() {
        for (const highlight of this.template.querySelectorAll(
            'builder_platform_interaction-screen-editor-highlight'
        )) {
            if (highlight.selected) {
                return highlight;
            }
        }

        return null;
    }

    /**
     * Get all the info needed to construct the aria text
     *
     * @param sourceIndex - The current position of the component in its parent whether column or canvas
     * @param columnIndex - The position of the source column within its parent section, if applicable
     * @param sectionIndex - The position of the source section within its parent canvas, if applicable
     * @returns info
     */
    getAriaLiveInfo(sourceIndex: number, columnIndex: number | undefined, sectionIndex: number | undefined): AriaInfo {
        const info: AriaInfo = {
            numItems: 0,
            label: '',
            screenField: {
                fieldType: '',
                label: '',
                name: ''
            }
        };
        if ((columnIndex || columnIndex === 0) && (sectionIndex || sectionIndex === 0)) {
            // since columnIndex and sectionIndex is defined, this component must be in a section with columns
            const allColumns = this.screen?.fields[sectionIndex]?.fields;
            info.numColumns = allColumns?.length;
            const allItems = allColumns[columnIndex]?.fields;
            info.numItems = allItems?.length;
            info.label = allItems[sourceIndex]?.name?.value;
            info.screenField = allItems[sourceIndex]?.type;
        } else {
            info.numItems = this.screen?.fields?.length;
            info.label = this.screen?.fields[sourceIndex]?.name?.value;
            info.screenField = this.screen?.fields[sourceIndex]?.type;
        }
        return info;
    }

    isLabelNeeded(fieldType: string, elementLabel: string) {
        return !!elementLabel && fieldType !== FlowScreenFieldType.RegionContainer;
    }

    /**
     * Construct the content of the aria-live region
     *
     * @param itemIndex - index of item
     * @param numItems - number of items
     * @param columnIndex - The position of the source column within its parent section, if applicable
     * @param numColumns - number of columns
     * @param screenField - object from this.screen?.fields[ind]?.type that should include [ name, fieldType, label, icon, category ]
     * @param elementLabel - element label
     * @param afterStarting - whether this function is called after the user hits Space to activate the move mode of a component
     * @param afterStopping - whether this function is called after the user hits Space to deactivate the move mode of a component
     * @param afterMoving - whether this function is called after the user uses arrow keys to move a component
     * @returns newText - aria live text
     */
    constructNewAriaLiveText(
        itemIndex: number,
        numItems: number,
        columnIndex: number | undefined,
        numColumns: number | undefined,
        screenField: UI.ScreenFieldType,
        elementLabel: string,
        afterStarting: boolean,
        afterStopping: boolean,
        afterMoving: boolean
    ): string {
        const { label: elementType, fieldType } = screenField;
        let newText;
        const isLabelNeeded = this.isLabelNeeded(fieldType, elementLabel);

        if (afterMoving || afterStarting) {
            const formattedComponentGrabbedMessage = isLabelNeeded
                ? format(this.labels.componentGrabbedMessage, elementType, elementLabel)
                : format(this.labels.componentGrabbedMessageTypeOnly, elementType);

            const formattedComponentAriaLabel = isLabelNeeded
                ? format(this.labels.componentAriaLabel, elementType, elementLabel)
                : format(this.labels.componentAriaLabelTypeOnly, elementType);

            newText = afterStarting ? formattedComponentGrabbedMessage : formattedComponentAriaLabel;
            if ((columnIndex || columnIndex === 0) && (numColumns || numColumns === 0)) {
                newText += format(this.labels.columnPosition, columnIndex + 1, numColumns);
            }
            newText += format(this.labels.componentCurrentPosition, itemIndex + 1, numItems);
            newText = afterStarting ? newText + this.labels.componentStartMovingInstruction : newText;
        } else if (afterStopping) {
            newText = isLabelNeeded
                ? format(this.labels.componentDroppedMessage, elementType, elementLabel)
                : format(this.labels.componentDroppedMessageTypeOnly, elementType);

            if ((columnIndex || columnIndex === 0) && (numColumns || numColumns === 0)) {
                newText += format(this.labels.columnPosition, columnIndex + 1, numColumns);
            }
            newText += format(this.labels.componentFinalPosition, itemIndex + 1, numItems);
        }
        return newText;
    }

    /**
     * Construct the aria description for the component that receives focus
     *
     * @param itemIndex - index of item
     * @param numItems - number of items
     * @param columnIndex - The position of the source column within its parent section, if applicable
     * @param  numColumns - number of columns
     * @returns newText - aria text for component in focus
     */
    constructNewAriaDescription(
        itemIndex: number,
        numItems: number,
        columnIndex: number | undefined,
        numColumns: number | undefined
    ): string {
        let newText = '';
        if (numColumns) {
            newText += format(this.labels.columnPosition, columnIndex! + 1, numColumns);
        }
        newText += format(this.labels.componentCurrentPosition, itemIndex + 1, numItems);
        newText += this.labels.componentKeyboardInstruction;
        return newText;
    }

    /**
     * Update the content of the aria-live region
     *
     * @param cancel - whether aria text is being set after a move cancellation
     */
    setAriaLiveInstruction(cancel: boolean) {
        if (cancel) {
            const parentIndexes = this.screen.getFieldIndexesByGUID(this.initialMovedItemParentGuid);
            this.destinationIndexForAriaText = this.initialMovedItemIndex;
            if (parentIndexes && parentIndexes.length === 2) {
                // the parent must be a column inside a section
                this.destinationSectionIndexForAriaText = parentIndexes[1];
                this.destinationColumnIndexForAriaText = parentIndexes[0];
            } else {
                this.destinationSectionIndexForAriaText = null;
                this.destinationColumnIndexForAriaText = null;
            }
        }
        const info = this.getAriaLiveInfo(
            this.destinationIndexForAriaText,
            this.destinationColumnIndexForAriaText,
            this.destinationSectionIndexForAriaText
        );
        const newText = this.constructNewAriaLiveText(
            this.destinationIndexForAriaText,
            info.numItems,
            this.destinationColumnIndexForAriaText,
            info.numColumns,
            info.screenField,
            info.label,
            false,
            this.setAriaTextOnCancel,
            this.setAriaTextOnMove
        );
        this.ariaLiveInstruction = newText;
        this.destinationIndexForAriaText =
            this.destinationColumnIndexForAriaText =
            this.destinationSectionIndexForAriaText =
                undefined;
    }

    /**
     *  Fires event to move a screen component vertically
     *
     * @param fields - all fields in a screen
     * @param sourceGuid - source guid of a screen component
     * @param sourceIndex - The current position of the component in its parent whether column or canvas
     * @param columnIndex - The position of the source column within its parent section, if applicable
     * @param sectionIndex - The position of the source section within its parent canvas, if applicable
     * @param start - whether the screen component is starting / stopping move
     */
    startOrStopMovingScreenElementWithKeyboard = (
        fields: UI.ScreenField[],
        sourceGuid: string,
        sourceIndex: number,
        columnIndex: number | undefined,
        sectionIndex: number | undefined,
        start: boolean
    ) => {
        const info = this.getAriaLiveInfo(sourceIndex, columnIndex, sectionIndex);
        const newText = this.constructNewAriaLiveText(
            sourceIndex,
            info.numItems,
            columnIndex,
            info.numColumns,
            info.screenField,
            info.label,
            start,
            !start,
            false
        );
        this.ariaLiveInstruction = newText;
        if (start) {
            this.movedItemGuid = sourceGuid;
            this.initialMovedItemIndex = sourceIndex;
            this.initialMovedItemParentGuid =
                sectionIndex || sectionIndex === 0 ? fields[sectionIndex].fields[columnIndex!].guid : this.screen.guid;
        } else {
            this.movedItemGuid = null;
        }
    };

    /**
     *  Fires event to cancel move and return screen component to original position
     *
     * @param fields - all fields in a screen
     * @param sourceGuid - source guid of a screen component
     * @param sourceIndex - The current position of the component in its parent whether column or canvas
     * @param columnIndex - The position of the source column within its parent section, if applicable
     * @param sectionIndex - The position of the source section within its parent canvas, if applicable
     */
    cancelMovingScreenElementWithKeyboard = (
        fields: UI.ScreenField[],
        sourceGuid: string,
        sourceIndex: number,
        columnIndex: number | undefined,
        sectionIndex: number | undefined
    ) => {
        const sourceParentGuid =
            sectionIndex || sectionIndex === 0 ? fields[sectionIndex].fields[columnIndex!].guid : this.screen.guid;
        const destinationIndex =
            sourceParentGuid === this.initialMovedItemParentGuid && sourceIndex <= this.initialMovedItemIndex
                ? this.initialMovedItemIndex + 1 // + 1 because it'll be decremented by 1 in screenReducer's moveScreenField
                : this.initialMovedItemIndex;
        this.fireMoveEvent(sourceGuid, this.initialMovedItemParentGuid, destinationIndex);
        this.setAriaTextOnCancel = true;
    };

    /**
     *  Sets aria text for component in focus
     *
     * @param sourceIndex - The current position of the component in its parent whether column or canvas
     * @param columnIndex - The position of the source column within its parent section, if applicable
     * @param sectionIndex - The position of the source section within its parent canvas, if applicable
     */
    setAriaTextForComponentInFocus = (
        sourceIndex: number,
        columnIndex: number | undefined,
        sectionIndex: number | undefined
    ) => {
        const info = this.getAriaLiveInfo(sourceIndex, columnIndex, sectionIndex);
        const newText = this.constructNewAriaDescription(sourceIndex, info.numItems, columnIndex, info.numColumns);
        this.ariaDescription = newText;
    };

    /**
     *  Fires event to move a screen component vertically
     *
     * @param fields - all fields in a screen
     * @param sourceGuid - source guid of a screen component
     * @param sourceIndex - The current position of the component in its parent whether column or canvas
     * @param columnIndex - The position of the source column within its parent section, if applicable
     * @param sectionIndex - The position of the source section within its parent canvas, if applicable
     * @param isColumnField - whether the source component is a column field or not
     * @param direction - direction in which source component is moving
     */
    moveComponentVerticallyWithKeyboard = (
        fields: UI.ScreenField[],
        sourceGuid: string,
        sourceIndex: number,
        columnIndex: number | undefined,
        sectionIndex: number | undefined,
        isColumnField: boolean,
        direction: string
    ) => {
        const isSection = isRegionContainerField(fields[sourceIndex]);

        if (isColumnField) {
            if (
                (direction === ScreenCanvasKeyboardInteractions.Up && sourceIndex === 0) ||
                (direction === ScreenCanvasKeyboardInteractions.Down &&
                    sourceIndex === fields[sectionIndex!].fields[columnIndex!].fields.length - 1)
            ) {
                // component is at the top/bottom of a section column, need to be moved out of section
                const destinationIndex =
                    direction === ScreenCanvasKeyboardInteractions.Up ? sectionIndex : sectionIndex! + 1;
                this.destinationIndexForAriaText = destinationIndex;
                this.moveComponentOutOfSection(sourceGuid, destinationIndex!);
            } else if (
                (direction === ScreenCanvasKeyboardInteractions.Up && sourceIndex > 0) ||
                (direction === ScreenCanvasKeyboardInteractions.Down &&
                    sourceIndex < fields[sectionIndex!].fields[columnIndex!].fields.length - 1)
            ) {
                // component is moving up / down within a column of a section
                this.destinationColumnIndexForAriaText = columnIndex;
                this.destinationIndexForAriaText =
                    direction === ScreenCanvasKeyboardInteractions.Up ? sourceIndex - 1 : sourceIndex + 1;
                this.destinationSectionIndexForAriaText = sectionIndex;
                this.swapWithAdjacentComponent(
                    sourceIndex,
                    sourceGuid,
                    fields[sectionIndex!].fields[columnIndex!].guid,
                    direction
                );
            }
        } else if (direction === ScreenCanvasKeyboardInteractions.Up && sourceIndex > 0) {
            // if the preceding component is a section, move this element to the end of that section
            if (!isSection && isRegionContainerField(fields[sourceIndex - 1])) {
                this.destinationSectionIndexForAriaText = sourceIndex - 1;
                this.moveComponentIntoSection(sourceGuid, sourceIndex - 1, direction);
            } else {
                // otherwise, switch their places
                this.destinationIndexForAriaText = sourceIndex - 1;
                this.swapWithAdjacentComponent(sourceIndex, sourceGuid, this.screen.guid, direction);
            }
        } else if (direction === ScreenCanvasKeyboardInteractions.Down && sourceIndex < fields.length - 1) {
            // if the succeeding component is a section, move this element to the top of that section
            if (!isSection && isRegionContainerField(fields[sourceIndex + 1])) {
                this.destinationSectionIndexForAriaText = sourceIndex;
                this.moveComponentIntoSection(sourceGuid, sourceIndex + 1, direction);
            } else {
                // otherwise, switch their places
                this.destinationIndexForAriaText = sourceIndex + 1;
                this.swapWithAdjacentComponent(sourceIndex, sourceGuid, this.screen.guid, direction);
            }
        } else {
            // in case we want to move up/down when we're at the top/bottom of the outermost canvas
            return;
        }
        this.setAriaTextOnMove = true;
    };

    /**
     *  Fires event to move a screen component horizontally
     *
     * @param fields - all fields in a screen
     * @param sourceGuid - source guid of a screen component
     * @param columnIndex - The position of the source column within its parent section, if applicable
     * @param sectionIndex - The position of the source section within its parent canvas, if applicable
     * @param isColumnField - whether the source component is a column field or not
     * @param direction - direction in which source component is moving
     */
    moveComponentHorizontallyWithKeyboard(
        fields: UI.ScreenField[],
        sourceGuid: string,
        columnIndex: number | undefined,
        sectionIndex: number | undefined,
        isColumnField: boolean,
        direction: string
    ) {
        let destinationIndex, destinationColumnIndex;
        if (isColumnField) {
            // Horizontal move is only possible for a column field
            if (direction === ScreenCanvasKeyboardInteractions.Left && columnIndex! > 0) {
                // if it's not in the leftmost column, move it to the bottom of the column to its left
                destinationIndex = fields[sectionIndex!].fields[columnIndex! - 1].fields.length;
                destinationColumnIndex = columnIndex! - 1;
            } else if (
                direction === ScreenCanvasKeyboardInteractions.Right &&
                columnIndex! < fields[sectionIndex!].fields.length - 1
            ) {
                // if it's not in the rightmost column, move it to the top of the column to its right
                destinationIndex = 0;
                destinationColumnIndex = columnIndex! + 1;
            } else {
                // in case we want to move left/right when we're at the leftmost/rightmost column
                return;
            }
        } else {
            // In case a normal component which is not a column field
            return;
        }
        this.destinationIndexForAriaText = destinationIndex;
        this.destinationColumnIndexForAriaText = destinationColumnIndex;
        this.destinationSectionIndexForAriaText = sectionIndex;
        this.fireMoveEvent(sourceGuid, fields[sectionIndex!].fields[destinationColumnIndex].guid, destinationIndex);
        this.setAriaTextOnMove = true;
    }

    /**
     *  Fires event to move a screen component into section
     *
     * @param sourceGuid - source guid of a screen component
     * @param sectionIndex - The position of the source section within its parent canvas, if applicable
     * @param direction - direction in which source component is moving
     */
    moveComponentIntoSection(sourceGuid: string, sectionIndex: number, direction: string) {
        const { fields } = this.screen;
        const numColumns = fields[sectionIndex]?.fields?.length;
        if (numColumns > 0) {
            const destinationColumnIndex = direction === ScreenCanvasKeyboardInteractions.Up ? numColumns - 1 : 0;
            const destinationColumn = fields[sectionIndex].fields[destinationColumnIndex];
            const destinationColumnGuid = destinationColumn.guid;
            const destinationIndex =
                direction === ScreenCanvasKeyboardInteractions.Up ? destinationColumn.fields.length : 0;
            this.destinationIndexForAriaText = destinationIndex;
            this.destinationColumnIndexForAriaText = destinationColumnIndex;
            this.fireMoveEvent(sourceGuid, destinationColumnGuid, destinationIndex);
        }
    }

    /**
     * Sets aria text message to be read when component is selected which moves focus to properties editor
     *
     * @param event
     */
    handleScreenElementSelected(event) {
        if (event.detail.fromKeyboard) {
            this.ariaDescription = this.labels.rightPanelInstructions;
        }
    }

    /**
     *  Fires event to swap a screen component with adjacent component
     *
     * @param sourceIndex - The current position of the component in its parent whether column or canvas
     * @param sourceGuid - source guid of a screen component
     * @param destinationParentGuid - guid of destination parent
     * @param direction - direction in which source component is moving
     */
    swapWithAdjacentComponent(
        sourceIndex: number,
        sourceGuid: string,
        destinationParentGuid: string,
        direction: string
    ) {
        // +2 since we decrement destinationIndex by 1 in ScreenReducer's moveScreenField
        const destinationIndex = direction === ScreenCanvasKeyboardInteractions.Up ? sourceIndex - 1 : sourceIndex + 2;
        this.fireMoveEvent(sourceGuid, destinationParentGuid, destinationIndex);
    }

    /**
     *  Fires event to move component out of section
     *
     * @param {string} sourceGuid - source guid of a screen component
     * @param {number} destinationIndex - index of destination
     */
    moveComponentOutOfSection(sourceGuid: string, destinationIndex: number) {
        this.fireMoveEvent(sourceGuid, this.screen.guid, destinationIndex);
    }

    /**
     *  Fires screen element moved event
     *
     * @param sourceGuid - source guid of a screen component
     * @param destinationParentGuid - guid of destination parent
     * @param destinationIndex - index of destination
     */
    fireMoveEvent(sourceGuid: string, destinationParentGuid: string, destinationIndex: number) {
        const moveFieldEvent = createScreenElementMovedEvent(sourceGuid, destinationParentGuid, destinationIndex);
        this.dispatchEvent(moveFieldEvent);
    }

    /**
     *  Computes positional info of a screen component
     *
     * @param guid - guid of a screen component
     * @returns {ScreenComponentInfo} - with positional info
     */
    computeScreenComponentInfo = (guid: string): ScreenComponentInfo => {
        let sourceIndex, columnIndex, sectionIndex;
        let isColumnField = false;

        const indexes = this.screen.getFieldIndexesByGUID(guid);

        if (indexes.length === 3) {
            sourceIndex = indexes[0];
            columnIndex = indexes[1];
            sectionIndex = indexes[2];
            isColumnField = true;
        } else {
            sourceIndex = indexes[0];
        }

        return {
            sourceIndex,
            columnIndex,
            sectionIndex,
            isColumnField
        };
    };

    /**
     *  Handles on click event to de-select
     *
     * @param event - ScreenElementDeselected Event
     */
    handleOnClick = (event: CustomEvent) => {
        const selected = this.getSelectedElement();
        this.dispatchEvent(createScreenElementDeselectedEvent(selected));
        event.stopPropagation();
    };

    /**
     *  Handles scroll to clear dragging state
     *
     */
    handleScroll() {
        this.clearDraggingState();
    }

    /**
     *  Handles keyboard interactions for screen component
     *
     * @param event - ScreenElementKeyboardInteraction Event
     */
    handleScreenElementKeyboardInteraction = (event: CustomEvent) => {
        event.stopPropagation();
        const { fields } = this.screen;
        const { sourceGuid, interaction } = event.detail;
        const { sourceIndex, columnIndex, sectionIndex, isColumnField } = this.computeScreenComponentInfo(sourceGuid);
        switch (interaction) {
            case ScreenCanvasKeyboardInteractions.Focus:
                this.setAriaTextForComponentInFocus(sourceIndex, columnIndex, sectionIndex);
                break;
            case ScreenCanvasKeyboardInteractions.Start:
                this.startOrStopMovingScreenElementWithKeyboard(
                    fields,
                    sourceGuid,
                    sourceIndex,
                    columnIndex,
                    sectionIndex,
                    true
                );
                break;
            case ScreenCanvasKeyboardInteractions.Stop:
                this.startOrStopMovingScreenElementWithKeyboard(
                    fields,
                    sourceGuid,
                    sourceIndex,
                    columnIndex,
                    sectionIndex,
                    false
                );
                break;
            case ScreenCanvasKeyboardInteractions.Cancel:
                this.cancelMovingScreenElementWithKeyboard(fields, sourceGuid, sourceIndex, columnIndex, sectionIndex);
                break;
            case ScreenCanvasKeyboardInteractions.Up:
            case ScreenCanvasKeyboardInteractions.Down:
                this.moveComponentVerticallyWithKeyboard(
                    fields,
                    sourceGuid,
                    sourceIndex,
                    columnIndex,
                    sectionIndex,
                    isColumnField,
                    interaction
                );
                break;
            case ScreenCanvasKeyboardInteractions.Left:
            case ScreenCanvasKeyboardInteractions.Right:
                this.moveComponentHorizontallyWithKeyboard(
                    fields,
                    sourceGuid,
                    columnIndex,
                    sectionIndex,
                    isColumnField,
                    interaction
                );
                break;
            default:
        }
    };
}
