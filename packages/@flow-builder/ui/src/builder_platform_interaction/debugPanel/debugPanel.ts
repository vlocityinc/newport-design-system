// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from './debugPanelLabels';
import { format } from 'builder_platform_interaction/commonUtils';
import { copyAndUpdateDebugTraceObject } from 'builder_platform_interaction/debugUtils';

/**
 * This is the debug panel that shows the debug run info on builder canvas (debugMode)
 *
 * - Mutate debug trace so that there's a title & body per debug accordion
 * - Add time (start time, finish time, duration)
 * - Show error if debug run fails
 */

export default class DebugPanel extends LightningElement {
    _debugData;
    debugTraces = [];

    /* this is the error message for a failed debug run, not per flow element errors */
    errorMessage = '';

    headerTitle = LABELS.debugInspector;

    get hasErrors() {
        return this.debugData && this.debugData.error && !!this.debugData.error[0];
    }

    get allTitles() {
        if (this.debugTraces) {
            return this.debugTraces.map(e => e.title);
        }
        return [];
    }

    @api
    get debugData() {
        return this._debugData;
    }

    set debugData(value) {
        this._debugData = value;
        this.updateProperties(this._debugData);
    }

    updateProperties(data) {
        this.debugTraces = [];
        if (!this.hasErrors && data && data.debugTrace) {
            this.debugTraces = copyAndUpdateDebugTraceObject(data);
        } else if (this.hasErrors) {
            this.errorMessage = format(LABELS.faultMessage, data.error);
        }
    }
}
