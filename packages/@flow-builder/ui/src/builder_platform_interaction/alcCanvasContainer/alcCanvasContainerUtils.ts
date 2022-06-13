import {
    getAlcElementType,
    hasContext,
    hasTrigger,
    startElementDescription
} from 'builder_platform_interaction/alcCanvasUtils';
import { ElementMetadata } from 'builder_platform_interaction/autoLayoutCanvas';
import {
    getChildElementTypesWithOverridenProperties,
    getConfigForElementType
} from 'builder_platform_interaction/elementConfig';
import { ELEMENT_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { isRecordTriggeredFlow } from 'builder_platform_interaction/processTypeLib';

/**
 * Checks if an element can have a fault connector
 *
 * @param startElement - the start element
 * @param metadata - the element metadata
 * @returns true if the element can hava a fault connector, false otherwise
 */
function canHaveFaultConnector(startElement: UI.Start, metadata: UI.ElementConfig) {
    // W-8985288: clean this up to make canHaveFaultConnector more dynamic than a static attribute in elementConfig
    if (
        metadata.elementType === ELEMENT_TYPE.RECORD_UPDATE &&
        startElement.triggerType === FLOW_TRIGGER_TYPE.BEFORE_SAVE
    ) {
        return false;
    }

    return metadata.canHaveFaultConnector;
}

/**
 * Augments the elements metadata with auto layout specific elements and properties
 *
 * @param elementsMetadata - The elements metadata
 * @param startElement - The start element
 * @returns the augmented elements metadata for the auto layout canvas
 */
export function augmentElementsMetadata(elementsMetadata: UI.ElementConfig[], startElement: UI.Start) {
    const { ROOT_ELEMENT, START_ELEMENT, END_ELEMENT } = ELEMENT_TYPE;

    // @ts-ignore
    const alcElementsMetadata: ElementMetadata[] = elementsMetadata.map((metadata) => ({
        ...metadata,
        canHaveFaultConnector: canHaveFaultConnector(startElement, metadata),
        type: getAlcElementType(metadata)
    }));

    getChildElementTypesWithOverridenProperties().forEach((elementType) => {
        const elementConfig = getConfigForElementType(elementType);
        const nodeConfig = elementConfig.nodeConfig!;

        const { iconName, iconBackgroundColor } = nodeConfig;
        const labels = elementConfig.labels!;

        alcElementsMetadata.push({
            icon: iconName,
            iconBackgroundColor: iconBackgroundColor!,
            label: labels.singular,
            elementType,
            type: getAlcElementType({ elementType }),
            // @ts-ignore  TODO: do we need this in the metadata?
            canHaveFaultConnector: elementConfig.canHaveFaultConnector,
            menuComponent: 'builder_platform_interaction/alcNodeMenu'
        });
    });

    const endElement: UI.ElementConfig = getConfigForElementType(END_ELEMENT);
    let nodeConfig = endElement.nodeConfig!;

    const endElementConfig = {
        section: nodeConfig.section,
        icon: nodeConfig.iconName,
        iconBackgroundColor: nodeConfig.iconBackgroundColor,
        iconShape: nodeConfig.iconShape,
        iconSize: nodeConfig.iconSize,
        description: nodeConfig.description,
        label: endElement.labels!.singular,
        value: END_ELEMENT,
        elementType: END_ELEMENT,
        type: getAlcElementType({ elementType: END_ELEMENT }),
        canHaveFaultConnector: false
    };

    let startElementConfig: any = getConfigForElementType(START_ELEMENT);
    nodeConfig = startElementConfig.nodeConfig!;

    startElementConfig = {
        description: startElementDescription(startElement.triggerType!),
        icon: nodeConfig.iconName,
        iconBackgroundColor: nodeConfig.iconBackgroundColor,
        iconShape: nodeConfig.iconShape,
        iconSize: nodeConfig.iconSize,
        label: startElementConfig.labels!.singular,
        value: START_ELEMENT,
        elementType: START_ELEMENT,
        type: getAlcElementType(startElement),
        canHaveFaultConnector: false,
        hasTrigger: hasTrigger(startElement.triggerType),
        hasContext: hasContext(startElement.triggerType),
        isRecordTriggeredFlow: isRecordTriggeredFlow(startElement.triggerType),
        menuComponent: 'builder_platform_interaction/alcStartMenu'
    };

    return [
        ...alcElementsMetadata,
        {
            section: null,
            icon: '',
            label: '',
            elementType: ROOT_ELEMENT,
            value: ROOT_ELEMENT,
            type: getAlcElementType({ elementType: ROOT_ELEMENT }),
            canHaveFaultConnector: false
        },
        startElementConfig,
        endElementConfig
    ];
}
