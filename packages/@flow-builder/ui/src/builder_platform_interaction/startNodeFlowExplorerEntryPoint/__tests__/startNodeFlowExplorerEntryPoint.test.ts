// @ts-nocheck
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import StartNodeFlowExplorerEntryPoint from 'builder_platform_interaction/startNodeFlowExplorerEntryPoint';
import { createElement } from 'lwc';
import { startElement as recordTriggeredStartElement } from 'mock/storeDataRecordTriggered';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));
const selectors = {
    entryPointLabel: '.label',
    button: '.button'
};

const runQuerySelector = (context, selector) => {
    return context.shadowRoot.querySelector(selector);
};

const setupComponentUnderTest = (node) => {
    const element = createElement('builder_platform_interaction-start-node-flow-explorer-entry-point', {
        is: StartNodeFlowExplorerEntryPoint
    });
    element.node = node;

    setDocumentBodyChildren(element);
    return element;
};

describe('Flow Explorer Entry Point', () => {
    let startElement;
    beforeAll(() => {
        startElement = setupComponentUnderTest(recordTriggeredStartElement);
    });

    it('Checks if an window open is called when using the enter command on Flow Explorer Entry Point', () => {
        return Promise.resolve().then(() => {
            window.open = jest.fn();
            startElement.performAction();

            expect(window.open).toHaveBeenCalled();
        });
    });

    it('Checks if an window open is called when using the space command on Flow Explorer Entry Point', () => {
        return Promise.resolve().then(() => {
            window.open = jest.fn();
            startElement.performAction();

            expect(window.open).toHaveBeenCalled();
        });
    });

    it('Checks if an window open is called when click on Flow Explorer Entry Point', () => {
        return Promise.resolve().then(() => {
            window.open = jest.fn();
            startElement.performAction();
            expect(window.open).toHaveBeenCalled();
        });
    });

    it('Check if the entryPointLabel contains the sObject api name', () => {
        expect(runQuerySelector(startElement, selectors.entryPointLabel).textContent).toBe(
            'FlowBuilderCanvasElement.startNodeExplorerWithObjectLabel(Account)'
        );
    });
});

describe('Flow Explorer without object set', () => {
    let startElement;
    beforeAll(() => {
        startElement = setupComponentUnderTest({});
    });

    it('Check if the entryPointLabel contains the sObject api name', () => {
        expect(runQuerySelector(startElement, selectors.entryPointLabel).textContent).toBe(
            'FlowBuilderCanvasElement.startNodeExplorerWithoutObjectLabel'
        );
    });
});
