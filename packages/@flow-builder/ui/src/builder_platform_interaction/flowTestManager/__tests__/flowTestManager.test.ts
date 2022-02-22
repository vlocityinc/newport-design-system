/* eslint-disable @lwc/lwc/no-async-operation */
// @ts-nocheck
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { createComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { FlowTestMode } from 'builder_platform_interaction/builderUtils';
import { addFlowTests, resetFlowTestStore } from 'builder_platform_interaction/systemLib';

const createComponentUnderTest = async (props) => {
    return createComponent('builder_platform_interaction-flowTestManager', props);
};

const SELECTORS = {
    CREATE_BUTTON: '[data-id="create-button"]',
    CREATE_BUTTON_ON_TABLE: '[data-id="create-button-w-table"]',
    DATATABLE: 'lightning-datatable'
};

const getCreateButton = (cmp) => {
    return cmp.shadowRoot.querySelector(SELECTORS.CREATE_BUTTON);
};

const getCreateButtonOnTable = (cmp) => {
    return cmp.shadowRoot.querySelector(SELECTORS.CREATE_BUTTON_ON_TABLE);
};

const getDatatable = (cmp) => {
    return cmp.shadowRoot.querySelector(SELECTORS.DATATABLE);
};

const MOCK_TESTS = [
    {
        flowTestName: 'testname',
        description: 'descripto',
        createdBy: 'joe mama',
        lastModifiedDate: new Date(),
        lastRunDate: new Date(),
        lastRunStatus: 'Pass'
    },
    {
        flowTestName: 'testname2',
        description: 'descripto',
        createdBy: 'joe mama',
        lastModifiedDate: new Date(),
        lastRunDate: new Date(),
        lastRunStatus: 'Fail'
    },
    {
        flowTestName: 'testname3',
        description: 'descripto',
        createdBy: 'joe mama',
        lastModifiedDate: new Date(),
        lastRunDate: new Date(),
        lastRunStatus: 'Error'
    }
];

describe('flowTestManager', () => {
    describe('footer buttons', () => {
        let cmp, enableButtonOneMock;

        beforeEach(async () => {
            addFlowTests(MOCK_TESTS);
            enableButtonOneMock = jest.fn();
            cmp = await createComponentUnderTest({
                footer: {
                    enableButtonOne: enableButtonOneMock
                },
                hideModal: jest.fn(),
                createNewTestCallback: jest.fn(),
                handleLoadMoreTests: jest.fn()
            });
        });

        afterEach(() => {
            resetFlowTestStore();
        });

        it('enables button one (run tests) when tests are selected', () => {
            const datatable = getDatatable(cmp);
            const ev = new CustomEvent('rowselection', { detail: { selectedRows: [{ foo: 'bar' }] } });
            datatable.dispatchEvent(ev);
            expect(enableButtonOneMock).toHaveBeenCalledTimes(1);
            expect(enableButtonOneMock).toHaveBeenCalledWith(true);
        });

        it('enables button one (run tests) when no tests are selected', () => {
            const datatable = getDatatable(cmp);
            const ev = new CustomEvent('rowselection', { detail: { selectedRows: [] } });
            datatable.dispatchEvent(ev);
            expect(enableButtonOneMock).toHaveBeenCalledTimes(1);
            expect(enableButtonOneMock).toHaveBeenCalledWith(false);
        });
    });

    describe('solo create button', () => {
        let cmp, createNewTestMock, props;

        beforeEach(() => {
            createNewTestMock = jest.fn();
            props = {
                footer: {},
                hideModal: jest.fn(),
                createNewTestCallback: createNewTestMock,
                handleLoadMoreTests: jest.fn()
            };
        });

        afterEach(() => {
            resetFlowTestStore();
        });

        it('exists when there is no data', async () => {
            addFlowTests([]);
            cmp = await createComponentUnderTest(props);
            await ticks(1);
            const button = getCreateButton(cmp);
            expect(button).not.toBeNull();
            expect(button).toBeDefined();
        });

        it('does not exist when there is data', async () => {
            addFlowTests(MOCK_TESTS);
            cmp = await createComponentUnderTest(props);
            await ticks(1);
            const button = getCreateButton(cmp);
            expect(button).toBeNull();
        });

        it('calls the createNewTestCallback when clicked', async () => {
            addFlowTests([]);
            cmp = await createComponentUnderTest(props);
            await ticks(1);
            const button = getCreateButton(cmp);
            button.click();
            expect(createNewTestMock).toHaveBeenCalledTimes(1);
            expect(createNewTestMock).toHaveBeenCalledWith(FlowTestMode.Create);
        });
    });

    describe('table create button', () => {
        let cmp, createNewTestMock, props;

        beforeEach(() => {
            createNewTestMock = jest.fn();
            props = {
                footer: {},
                hideModal: jest.fn(),
                createNewTestCallback: createNewTestMock,
                handleLoadMoreTests: jest.fn()
            };
        });

        afterEach(() => {
            resetFlowTestStore();
        });

        it('does not exist when there is no data', async () => {
            addFlowTests([]);
            cmp = await createComponentUnderTest(props);
            await ticks(1);
            const button = getCreateButtonOnTable(cmp);
            expect(button).toBeNull();
        });

        it('exists when there is data', async () => {
            addFlowTests(MOCK_TESTS);
            cmp = await createComponentUnderTest(props);
            await ticks(1);
            const button = getCreateButtonOnTable(cmp);
            expect(button).not.toBeNull();
            expect(button).toBeDefined();
        });

        it('calls the createNewTestCallback when clicked', async () => {
            addFlowTests(MOCK_TESTS);
            cmp = await createComponentUnderTest(props);
            await ticks(1);
            const button = getCreateButtonOnTable(cmp);
            button.click();
            expect(createNewTestMock).toHaveBeenCalledTimes(1);
            expect(createNewTestMock).toHaveBeenCalledWith(FlowTestMode.Create);
        });
    });

    describe('table data', () => {
        let cmp, props;

        beforeEach(() => {
            props = {
                footer: {},
                hideModal: jest.fn(),
                createNewTestCallback: jest.fn(),
                handleLoadMoreTests: jest.fn()
            };
        });

        afterEach(() => {
            resetFlowTestStore();
        });

        it('is updated when test store is updated', async () => {
            cmp = await createComponentUnderTest(props);
            addFlowTests([MOCK_TESTS[0]]);
            cmp.copyDataFromTestStore();
            await ticks(1);
            let data = getDatatable(cmp).data;
            expect(data.length).toBe(1);
            expect(data[0].flowTestName).toEqual(MOCK_TESTS[0].flowTestName);
            expect(data[0].flowTestId).toEqual(MOCK_TESTS[0].flowTestId);

            resetFlowTestStore();

            addFlowTests(MOCK_TESTS);
            cmp.copyDataFromTestStore();
            await ticks(1);
            data = getDatatable(cmp).data;
            expect(data.length).toBe(MOCK_TESTS.length);
            for (let i = 0; i < data.length; i++) {
                expect(data[i].flowTestName).toEqual(MOCK_TESTS[i].flowTestName);
                expect(data[i].flowTestId).toEqual(MOCK_TESTS[i].flowTestId);
            }
        });
        it('is written with the appropriate run status icon', async () => {
            cmp = await createComponentUnderTest(props);
            addFlowTests(MOCK_TESTS);
            cmp.copyDataFromTestStore();
            await ticks(1);
            const data = getDatatable(cmp).data;
            expect(data[0].lastRunStatusIcon).toEqual('utility:check');
            expect(data[1].lastRunStatusIcon).toEqual('utility:close');
            expect(data[2].lastRunStatusIcon).toEqual('utility:close');
        });
    });

    describe('loadmore event', () => {
        let cmp, props, handleLoadMoreTestsFn;

        beforeEach(async () => {
            jest.useFakeTimers();
            handleLoadMoreTestsFn = jest.fn().mockImplementation(async () => {
                await new Promise((res) => setTimeout(res, 50));
            });
            props = {
                footer: {},
                hideModal: jest.fn(),
                createNewTestCallback: jest.fn(),
                handleLoadMoreTests: handleLoadMoreTestsFn
            };
            cmp = await createComponentUnderTest(props);
        });

        afterEach(() => {
            jest.useRealTimers();
            resetFlowTestStore();
        });

        it('invokes the load more tests callback', async () => {
            addFlowTests(MOCK_TESTS);
            cmp.copyDataFromTestStore();
            await ticks(1);
            const datatable = getDatatable(cmp);
            const ev = new CustomEvent('loadmore', {});
            datatable.dispatchEvent(ev);
            expect(handleLoadMoreTestsFn).toBeCalled();
        });

        it('does not invoke the load more tests callback if a request is already in progress', async () => {
            addFlowTests(MOCK_TESTS);
            cmp.copyDataFromTestStore();
            await ticks(1);

            const datatable = getDatatable(cmp);
            const ev = new CustomEvent('loadmore', {});
            datatable.dispatchEvent(ev);
            expect(handleLoadMoreTestsFn).toBeCalledTimes(1);

            // after 25 ms, call will still be in progress, so we won't call the fn a second time
            jest.advanceTimersByTime(25);
            await ticks(1);
            datatable.dispatchEvent(ev);
            expect(handleLoadMoreTestsFn).toBeCalledTimes(1);

            // exhausts the timer, completing the first call. we should be able to emit another event
            // that will call the function again
            jest.runAllTimers();
            await ticks(1);
            datatable.dispatchEvent(ev);
            expect(handleLoadMoreTestsFn).toBeCalledTimes(2);
        });

        it('does not invoke the load more tests callback if we hit the end of the list', async () => {
            addFlowTests(MOCK_TESTS);
            cmp.copyDataFromTestStore();
            await ticks(1);

            const datatable = getDatatable(cmp);
            const ev = new CustomEvent('loadmore', {});
            datatable.dispatchEvent(ev);
            expect(handleLoadMoreTestsFn).toBeCalledTimes(1);

            // addFlowTests being called with an empty list signals we have hit the end of the list
            jest.runAllTimers();
            addFlowTests([]);
            cmp.copyDataFromTestStore();
            await ticks(1);
            datatable.dispatchEvent(ev);
            expect(handleLoadMoreTestsFn).toBeCalledTimes(1);
        });
    });
});
