import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { ElementType } from 'builder_platform_interaction/flowUtils';

export default [
    {
        section: 'Logic',
        type: ElementType.DECISION,
        icon: 'standard:decision',
        label: "decisionLogicLabel",
        value: ELEMENT_TYPE.DECISION,
        elementType: ELEMENT_TYPE.DECISION,
        description: "decisionLogicDescription"
    },
    {
        section: 'Logic',
        type: ElementType.DECISION,
        icon: 'standard:waits',
        label: "waitLogicLabel",
        value: ELEMENT_TYPE.WAIT,
        elementType: ELEMENT_TYPE.WAIT,
        description: "waitLogicDescription"
    },
    {
        section: 'Interaction',
        type: ElementType.DEFAULT,
        icon: 'standard:screen',
        label: "screenComponentLabel",
        value: ELEMENT_TYPE.SCREEN,
        elementType: ELEMENT_TYPE.SCREEN,
        description: "screenComponentDescription"
    },
    {
        section: null,
        type: ElementType.START,
        icon: 'standard:default',
        label: 'Start',
        value: ELEMENT_TYPE.START_ELEMENT,
        elementType: ELEMENT_TYPE.START_ELEMENT,
        description: null
    },
    {
        section: null,
        type: ElementType.ROOT,
        icon: 'standard:default',
        label: null,
        value: ELEMENT_TYPE.ROOT_ELEMENT,
        elementType: ELEMENT_TYPE.ROOT_ELEMENT,
        description: null
    },
    {
        section: null,
        type: ElementType.END,
        icon: 'standard:first_non_empty',
        label: 'End',
        value: ELEMENT_TYPE.END_ELEMENT,
        elementType: ELEMENT_TYPE.END_ELEMENT,
        description: null
    }
];
