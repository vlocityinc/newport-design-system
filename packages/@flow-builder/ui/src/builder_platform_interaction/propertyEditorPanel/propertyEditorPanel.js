import { LightningElement, track, api } from 'lwc';

import {
    AddElementEvent,
    EditElementEvent,
    AddNodeEvent,
    UpdateNodeEvent,
    ClosePropertyEditorEvent
} from 'builder_platform_interaction/events';

import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';

import { LABELS } from './propertyEditorPanelLabels';

import ScreenEditor from 'builder_platform_interaction/screenEditor';
import AssignmentEditor from 'builder_platform_interaction/assignmentEditor';
import CalloutEditor from 'builder_platform_interaction/calloutEditor';
import SubflowEditor from 'builder_platform_interaction/subflowEditor';
import InvocableActionEditor from 'builder_platform_interaction/invocableActionEditor';
import DecisionEditor from 'builder_platform_interaction/decisionEditor';
import LoopEditor from 'builder_platform_interaction/loopEditor';
import RecordCreateEditor from 'builder_platform_interaction/recordCreateEditor';
import RecordUpdateEditor from 'builder_platform_interaction/recordUpdateEditor';
import RecordLookupEditor from 'builder_platform_interaction/recordLookupEditor';
import RecordDeleteEditor from 'builder_platform_interaction/recordDeleteEditor';

const PROPERTY_EDITOR_CLASS = '.inline-property-editor';

/**
 * LWC version of the property editor, for use in lwc (as opposed to aura modal version)
 * @ScrumTeam Automation UI
 * @since 228
 */
export default class PropertyEditorPanel extends LightningElement {
    editorParams;
    labels = LABELS;

    @api
    get params() {
        return this.editorParams;
    }

    set params(params) {
        this.editorParams = params;
        this.title = params.panelConfig.titleForModal;
        this.loadCtor(params.attr.bodyComponent.desc);
    }

    @track
    title;

    @track
    ctor;

    @track messages = {}

    loadCtor(descriptor) {
        // TODO: Once dynamic import is supported in core (W-6985280)
        // const module = await import(this.params.attr.bodyComponent.className);

        let module;

        // TODO: get rid of this once the dynamic import from a string variable is working
        switch (descriptor) {
            case elementTypeToConfigMap[ELEMENT_TYPE.SCREEN].descriptor:
                module = ScreenEditor;
                break;
            case elementTypeToConfigMap[ELEMENT_TYPE.ASSIGNMENT].descriptor:
                module = AssignmentEditor;
                break;
            case elementTypeToConfigMap[ELEMENT_TYPE.DECISION].descriptor:
                module = DecisionEditor;
                break;
            case elementTypeToConfigMap[ELEMENT_TYPE.LOOP].descriptor:
                module = LoopEditor;
                break;
            case elementTypeToConfigMap[ELEMENT_TYPE.RECORD_CREATE].descriptor:
                module = RecordCreateEditor;
                break;
            case elementTypeToConfigMap[ELEMENT_TYPE.RECORD_UPDATE].descriptor:
                module = RecordUpdateEditor;
                break;
            case elementTypeToConfigMap[ELEMENT_TYPE.RECORD_LOOKUP].descriptor:
                module = RecordLookupEditor;
                break;
            case elementTypeToConfigMap[ELEMENT_TYPE.RECORD_DELETE].descriptor:
                module = RecordDeleteEditor;
                break;

            case elementTypeToConfigMap[ELEMENT_TYPE.ACTION_CALL].descriptor[AddElementEvent.EVENT_NAME]:
                 module = CalloutEditor;
                 break;
            case elementTypeToConfigMap[ELEMENT_TYPE.ACTION_CALL].descriptor[EditElementEvent.EVENT_NAME]:
                module = InvocableActionEditor;
                break;
            case elementTypeToConfigMap[ELEMENT_TYPE.SUBFLOW].descriptor[AddElementEvent.EVENT_NAME]:
                module = CalloutEditor;
                break;
            case elementTypeToConfigMap[ELEMENT_TYPE.SUBFLOW].descriptor[EditElementEvent.EVENT_NAME]:
                module = SubflowEditor;
                break;
            default:
                module = null;
                break;
        }

        this.ctor = module;
    }

    setPropertyEditorTitle(event) {
        this.title = event.detail.title;
    }

    handleOk() {
        const propertyEditorComponent = this.template.querySelector(PROPERTY_EDITOR_CLASS);
        const validationErrors = propertyEditorComponent.validate();

        if (validationErrors.length === 0) {
            const mode = this.params.attr.bodyComponent.attr.mode;

            if (mode === AddElementEvent.EVENT_NAME) {
                const addNodeEvent = new AddNodeEvent(propertyEditorComponent.getNode());
                this.dispatchEvent(addNodeEvent);
            } else if (mode === EditElementEvent.EVENT_NAME) {
                const updateNodeEvent = new UpdateNodeEvent(propertyEditorComponent.getNode());
                this.dispatchEvent(updateNodeEvent);
            } else {
                throw Error('Unsupported mode: ' + mode);
            }

            const closePropertyEditorEvent = new ClosePropertyEditorEvent();
            this.dispatchEvent(closePropertyEditorEvent);
        }
    }

    handleCancel() {
        const closePropertyEditorEvent = new ClosePropertyEditorEvent();
        this.dispatchEvent(closePropertyEditorEvent);
    }
}
