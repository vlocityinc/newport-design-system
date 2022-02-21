// @ts-nocheck
import { FlowTestMode } from 'builder_platform_interaction/builderUtils';
import type { FlowTestAndResultDescriptor } from 'builder_platform_interaction/systemLib';
import { getFlowTests } from 'builder_platform_interaction/systemLib';
import { api, LightningElement } from 'lwc';
import { LABELS } from './flowTestManagerLabels';

enum FlowTestListRowAction {
    DELETE = 'delete',
    EDIT = 'edit',
    DETAIL = 'detail'
}

const ACTIONS = [
    { label: LABELS.flowTestListDeleteAction, name: FlowTestListRowAction.DELETE },
    { label: LABELS.flowTestListEditAction, name: FlowTestListRowAction.EDIT },
    { label: LABELS.flowTestListViewDetailAction, name: FlowTestListRowAction.DETAIL }
];

const COLUMNS = [
    { label: LABELS.flowTestListNameColumnHeader, fieldName: 'flowTestName', type: 'text' },
    { label: LABELS.flowTestListDescriptionColumnHeader, fieldName: 'description', type: 'text' },
    { label: LABELS.flowTestListCreatorColumnHeader, fieldName: 'createdBy', type: 'text' },
    {
        label: LABELS.flowTestListLastModifiedDateColumnHeader,
        fieldName: 'lastModifiedDate',
        type: 'date',
        typeAttributes: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }
    },
    {
        label: LABELS.flowTestListLastRunDateColumnHeader,
        fieldName: 'lastRunDate',
        type: 'date',
        typeAttributes: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }
    },
    { label: LABELS.flowTestListRunStatusColumnHeader, fieldName: 'lastRunStatus', type: 'text' },
    { type: 'action', typeAttributes: { rowActions: ACTIONS } }
];

export default class FlowTestManager extends LightningElement {
    @api createNewTestCallback;
    @api hideModal;
    @api footer;

    labels = LABELS;
    columns = COLUMNS;

    privateFlowTestData: FlowTestAndResultDescriptor[] = [];
    selectedTests: FlowTestAndResultDescriptor[] = [];

    constructor() {
        super();
        this.copyDataFromTestStore();
    }

    handleCreateNewTest() {
        this.hideModal();
        this.createNewTestCallback(FlowTestMode.Create);
    }

    get flowHasTests() {
        return this.privateFlowTestData.length > 0;
    }

    get flowTestData() {
        return this.privateFlowTestData;
    }

    handleRowAction(event) {
        const action: FlowTestListRowAction = event.detail.action.name;
        const row: FlowTestAndResultDescriptor = event.detail.row;

        switch (action) {
            case FlowTestListRowAction.DELETE:
                // TODO: implement delete action
                break;
            case FlowTestListRowAction.EDIT:
                // TODO: implement edit action
                break;
            case FlowTestListRowAction.DETAIL:
                // TODO: implement run and view detail action
                break;
            default:
            // noop
        }
    }

    handleRowSelection(event) {
        this.selectedTests = event.detail.selectedRows;
        const areAnySelected = this.selectedTests.length !== 0;
        this.footer.enableButtonOne(areAnySelected);
    }

    @api copyDataFromTestStore() {
        this.privateFlowTestData = getFlowTests().map((datum) => {
            return { ...datum };
        });
    }

    @api getSelectedTests(): FlowTestAndResultDescriptor[] {
        return this.selectedTests;
    }
}
