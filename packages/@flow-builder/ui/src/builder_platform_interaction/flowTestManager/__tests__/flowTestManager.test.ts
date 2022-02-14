// @ts-nocheck
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { createComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { FlowTestMode } from 'builder_platform_interaction/builderUtils';
import { setFlowTests } from 'builder_platform_interaction/systemLib';

const createComponentUnderTest = async (props) => {
    return createComponent('builder_platform_interaction-flowTestManager', props);
};

const SELECTORS = {
    CREATE_BUTTON: '[data-id="create-button"]',
    DATATABLE: 'lightning-datatable'
};

const getCreateButton = (cmp) => {
    return cmp.shadowRoot.querySelector(SELECTORS.CREATE_BUTTON);
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
    }
];

describe('flowTestManager', () => {
    describe('footer buttons', () => {
        let cmp, enableButtonOneMock;

        beforeEach(async () => {
            setFlowTests(MOCK_TESTS);
            enableButtonOneMock = jest.fn();
            cmp = await createComponentUnderTest({
                footer: {
                    enableButtonOne: enableButtonOneMock
                },
                hideModal: jest.fn(),
                createNewTestCallback: jest.fn()
            });
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

    describe('create button', () => {
        let cmp, createNewTestMock, props;

        beforeEach(() => {
            createNewTestMock = jest.fn();
            props = {
                footer: {},
                hideModal: jest.fn(),
                createNewTestCallback: createNewTestMock
            };
        });

        it('exists when there is no data', async () => {
            setFlowTests([]);
            cmp = await createComponentUnderTest(props);
            await ticks(1);
            const button = getCreateButton(cmp);
            expect(button).not.toBeNull();
            expect(button).toBeDefined();
        });

        it('does not exist when there is data', async () => {
            setFlowTests(MOCK_TESTS);
            cmp = await createComponentUnderTest(props);
            await ticks(1);
            const button = getCreateButton(cmp);
            expect(button).toBeNull();
        });

        it('calls the createNewTestCallback when clicked', async () => {
            setFlowTests([]);
            cmp = await createComponentUnderTest(props);
            await ticks(1);
            const button = getCreateButton(cmp);
            button.click();
            expect(createNewTestMock).toHaveBeenCalledTimes(1);
            expect(createNewTestMock).toHaveBeenCalledWith(FlowTestMode.CREATE);
        });
    });

    describe('table data', () => {
        let cmp, props;

        beforeEach(() => {
            props = {
                footer: {},
                hideModal: jest.fn(),
                createNewTestCallback: jest.fn()
            };
        });

        it('is updated when test store is updated', async () => {
            cmp = await createComponentUnderTest(props);
            setFlowTests([MOCK_TESTS[0]]);
            cmp.copyDataFromTestStore();
            await ticks(1);
            let data = getDatatable(cmp).data;
            expect(data.length).toBe(1);
            expect(data[0]).toEqual(MOCK_TESTS[0]);

            setFlowTests(MOCK_TESTS);
            cmp.copyDataFromTestStore();
            await ticks(1);
            data = getDatatable(cmp).data;
            expect(data.length).toBe(MOCK_TESTS.length);
            for (let i = 0; i < data.length; i++) {
                expect(data[i]).toEqual(MOCK_TESTS[i]);
            }
        });
    });
});
