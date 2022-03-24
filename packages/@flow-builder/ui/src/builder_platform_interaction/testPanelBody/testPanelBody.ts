import { api, LightningElement } from 'lwc';
import { TEST_BODY_LABELS } from './testPanelBodyLabels';

export const TEST_ASSERTION_STATUS = {
    ERROR: 'ERROR',
    PASS: 'PASS',
    FAIL: 'FAIL',
    NOT_EXECUTED: 'NOT EXECUTED'
};

export default class TestPanelBody extends LightningElement {
    _testAssertionTrace;
    condition;
    outcomeCond;
    failureMessage;
    errorMessage;
    status;
    testLabels = TEST_BODY_LABELS;

    @api
    get testAssertionTrace() {
        return this._testAssertionTrace;
    }

    set testAssertionTrace(value) {
        this._testAssertionTrace = value;
        this.condition = value.condition;
        this.outcomeCond = value.outcomeCond;
        this.failureMessage = value.failureMessage;
        this.errorMessage = value.errorMessage;
        this.status = value.status;
    }

    get isError() {
        return this.status === TEST_ASSERTION_STATUS.ERROR;
    }

    get showCustomErrorMessage() {
        return this.isFailure && this.failureMessage?.length > 0;
    }

    get isFailure() {
        return this.status === TEST_ASSERTION_STATUS.FAIL;
    }

    get isPass() {
        return this.status === TEST_ASSERTION_STATUS.PASS;
    }

    get isNotExecuted() {
        return this.status === TEST_ASSERTION_STATUS.NOT_EXECUTED;
    }

    get showOutcomeCondition() {
        return this.isFailure || this.isPass;
    }
}
