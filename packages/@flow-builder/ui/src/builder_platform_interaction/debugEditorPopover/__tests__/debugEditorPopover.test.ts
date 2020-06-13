import { createElement } from 'lwc';
import DebugEditorPopover from '../debugEditorPopover';
import { LABELS } from '../debugEditorPopoverLabels';

const createComponentUnderTest = (props = {}) => {
    const element = createElement('builder_platform_interaction-debug-editor-popover', { is: DebugEditorPopover });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

const SELECTORS = {
    RUNLATEST: '.runLatestVersion',
    SHOWDETAILS: '.showDebugInfo',
    ENABLEROLLBACK: '.enableRollback',
    RUNAS: '.runAs',
    GOVERNORLIMITS: '.governorLimits'
};

describe('debugEditorPopover', () => {
    let cmp;
    let runLatestVersion;
    let showDebugInfo;
    let enableRollback;
    let runAs;
    let governorLimits;
    beforeEach(() => {
        cmp = createComponentUnderTest();
        runLatestVersion = cmp.shadowRoot.querySelector(SELECTORS.RUNLATEST);
        showDebugInfo = cmp.shadowRoot.querySelector(SELECTORS.SHOWDETAILS);
        enableRollback = cmp.shadowRoot.querySelector(SELECTORS.ENABLEROLLBACK);
        runAs = cmp.shadowRoot.querySelector(SELECTORS.RUNAS);
        governorLimits = cmp.shadowRoot.querySelector(SELECTORS.GOVERNORLIMITS);
    });

    describe('Default attributes of runLatestVersion option', () => {
        it('exists', () => {
            expect(runLatestVersion).not.toBeNull();
        });
        it('has default label', () => {
            expect(runLatestVersion.label).toEqual(LABELS.runLatestVersion);
        });
        it('should be checked', () => {
            expect(runLatestVersion.checked).toEqual(true);
        });
    });

    describe('Default attributes of showDebugInfo option', () => {
        it('exists', () => {
            expect(showDebugInfo).not.toBeNull();
        });
        it('has default label', () => {
            expect(showDebugInfo.label).toEqual(LABELS.showDebugInfo);
        });
        it('should be checked', () => {
            expect(showDebugInfo.checked).toEqual(true);
        });
        it('should have help text information as required', () => {
            expect(showDebugInfo.fieldLevelHelp).toEqual(LABELS.showDebugInfoHelptext);
        });
    });

    describe('Default attributes of enableRollback option', () => {
        it('exists', () => {
            expect(enableRollback).not.toBeNull();
        });
        it('has default label', () => {
            expect(enableRollback.label).toEqual(LABELS.enableRollbackMode);
        });
        it('should not be checked', () => {
            expect(enableRollback.checked).toEqual(false);
        });
    });

    describe('Default attributes of runAs option', () => {
        it('exists', () => {
            expect(runAs).not.toBeNull();
        });
        it('has default label', () => {
            expect(runAs.label).toEqual(LABELS.runAs);
        });
        it('should not be checked', () => {
            expect(runAs.checked).toEqual(false);
        });
    });

    describe('Default attributes of governorLimits option', () => {
        it('exists', () => {
            expect(governorLimits).not.toBeNull();
        });
        it('has default label', () => {
            expect(governorLimits.label).toEqual(LABELS.governorLimits);
        });
        it('should not be checked', () => {
            expect(governorLimits.checked).toEqual(false);
        });
    });
});
