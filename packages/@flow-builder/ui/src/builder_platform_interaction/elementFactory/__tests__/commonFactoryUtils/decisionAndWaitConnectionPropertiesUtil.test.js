import { getConnectionProperties} from "../../commonFactoryUtils/decisionAndWaitConnectionPropertiesUtil";
import { CONNECTOR_TYPE } from "builder_platform_interaction/flowMetadata";

describe('New Decision Element', () => {
    const originalDecision = {
        guid: 'decision1',
        outcomeReferences: [],
        availableConnections: [{
            type: CONNECTOR_TYPE.DEFAULT
        }]
    };

    const newChildReferences = [{
        outcomeReference: 'outcome1'
    }];

    const deletedChildElementGuids = [];
    const result = getConnectionProperties(originalDecision, newChildReferences, deletedChildElementGuids, 'outcomeReferences', 'outcomeReference');

    it('check for connectorCount', () => {
        expect(result.connectorCount).toEqual(0);
    });

    it('check for availableConnections', () => {
        expect(result.availableConnections).toEqual([{
            type: CONNECTOR_TYPE.REGULAR,
            childReference: 'outcome1'
        }, {
            type: CONNECTOR_TYPE.DEFAULT
        }]);
    });

    it('check for addFaultConnectionForWaitElement', () => {
        expect(result.addFaultConnectionForWaitElement).toBeFalsy();
    });
});

describe('Existing Decision Element with Default Connection available', () => {
    let originalDecision;
    let newChildReferences;
    let deletedChildElementGuids;

    beforeEach(() => {
        originalDecision = {
            guid: 'decision1',
            outcomeReferences: [{
                outcomeReference: 'outcome1'
            }, {
                outcomeReference: 'outcome2'
            }],
            availableConnections: [{
                type: CONNECTOR_TYPE.REGULAR,
                childReference: 'outcome1'
            }, {
                type: CONNECTOR_TYPE.DEFAULT
            }]
        };

        newChildReferences = [{
            outcomeReference: 'outcome1'
        }, {
            outcomeReference: 'outcome3'
        }];

        deletedChildElementGuids = ['outcome2'];
    });

    describe('Adding an outcome and deleting an outcome with an associated connector', () => {
        it('check for connectorCount', () => {
            const result = getConnectionProperties(originalDecision, newChildReferences, deletedChildElementGuids, 'outcomeReferences', 'outcomeReference');
            // outcome2 had an associated connector, but got deleted
            expect(result.connectorCount).toEqual(0);
        });

        it('check for availableConnections', () => {
            const result = getConnectionProperties(originalDecision, newChildReferences, deletedChildElementGuids, 'outcomeReferences', 'outcomeReference');
            expect(result.availableConnections).toEqual([{
                type: CONNECTOR_TYPE.REGULAR,
                childReference: 'outcome1'
            }, {
                type: CONNECTOR_TYPE.REGULAR,
                childReference: 'outcome3'
            }, {
                type: CONNECTOR_TYPE.DEFAULT
            }]);
        });

        it('check for addFaultConnectionForWaitElement', () => {
            const result = getConnectionProperties(originalDecision, newChildReferences, deletedChildElementGuids, 'outcomeReferences', 'outcomeReference');
            expect(result.addFaultConnectionForWaitElement).toBeFalsy();
        });
    });

    describe('Adding an outcome and deleting a "free" outcome', () => {
        let result;

        beforeEach(() => {
            newChildReferences = [{
                outcomeReference: 'outcome2'
            }, {
                outcomeReference: 'outcome3'
            }];

            deletedChildElementGuids = ['outcome1'];
            result = getConnectionProperties(originalDecision, newChildReferences, deletedChildElementGuids, 'outcomeReferences', 'outcomeReference');
        });

        it('check for connectorCount', () => {
            // For outcome2 which was originally not available and still hasn't been deleted
            expect(result.connectorCount).toEqual(1);
        });

        it('check for availableConnections', () => {
            expect(result.availableConnections).toEqual([{
                type: CONNECTOR_TYPE.REGULAR,
                childReference: 'outcome3'
            }, {
                type: CONNECTOR_TYPE.DEFAULT
            }]);
        });

        it('check for addFaultConnectionForWaitElement', () => {
            expect(result.addFaultConnectionForWaitElement).toBeFalsy();
        });
    });
});

describe('Existing Decision Element with Default Connection unavailable', () => {
    let originalDecision;
    let newChildReferences;
    let deletedChildElementGuids;

    beforeEach(() => {
        originalDecision = {
            guid: 'decision1',
            outcomeReferences: [{
                outcomeReference: 'outcome1'
            }, {
                outcomeReference: 'outcome2'
            }],
            availableConnections: [{
                type: CONNECTOR_TYPE.REGULAR,
                childReference: 'outcome1'
            }]
        };

        newChildReferences = [{
            outcomeReference: 'outcome1'
        }, {
            outcomeReference: 'outcome3'
        }];

        deletedChildElementGuids = ['outcome2'];
    });

    describe('Adding an outcome and deleting an outcome with an associated connector', () => {
        it('check for connectorCount', () => {
            const result = getConnectionProperties(originalDecision, newChildReferences, deletedChildElementGuids, 'outcomeReferences', 'outcomeReference');
            // For the Default Connection
            expect(result.connectorCount).toEqual(1);
        });

        it('check for availableConnections', () => {
            const result = getConnectionProperties(originalDecision, newChildReferences, deletedChildElementGuids, 'outcomeReferences', 'outcomeReference');
            expect(result.availableConnections).toEqual([{
                type: CONNECTOR_TYPE.REGULAR,
                childReference: 'outcome1'
            }, {
                type: CONNECTOR_TYPE.REGULAR,
                childReference: 'outcome3'
            }]);
        });

        it('check for addFaultConnectionForWaitElement', () => {
            const result = getConnectionProperties(originalDecision, newChildReferences, deletedChildElementGuids, 'outcomeReferences', 'outcomeReference');
            expect(result.addFaultConnectionForWaitElement).toBeFalsy();
        });
    });

    describe('Adding an outcome and deleting a "free" outcome', () => {
        let result;

        beforeEach(() => {
            newChildReferences = [{
                outcomeReference: 'outcome2'
            }, {
                outcomeReference: 'outcome3'
            }];

            deletedChildElementGuids = ['outcome1'];
            result = getConnectionProperties(originalDecision, newChildReferences, deletedChildElementGuids, 'outcomeReferences', 'outcomeReference');
        });

        it('check for connectorCount', () => {
            // Each for outcome2 and Default Connection
            expect(result.connectorCount).toEqual(2);
        });

        it('check for availableConnections', () => {
            expect(result.availableConnections).toEqual([{
                type: CONNECTOR_TYPE.REGULAR,
                childReference: 'outcome3'
            }]);
        });

        it('check for addFaultConnectionForWaitElement', () => {
            expect(result.addFaultConnectionForWaitElement).toBeFalsy();
        });
    });
});

describe('New Wait Element', () => {
    const originalWait = {
        guid: 'wait1',
        waitEventReferences: [],
        availableConnections: [{
            type: CONNECTOR_TYPE.DEFAULT
        }, {
            type: CONNECTOR_TYPE.FAULT
        }]
    };

    const newChildReferences = [{
        waitEventReference: 'waitEvent1'
    }];

    const deletedChildElementGuids = [];
    const result = getConnectionProperties(originalWait, newChildReferences, deletedChildElementGuids, 'waitEventReferences', 'waitEventReference');

    it('check for connectorCount', () => {
        expect(result.connectorCount).toEqual(0);
    });

    it('check for availableConnections', () => {
        // Fault Connection isn't present in the availableConnections because that gets added in the wait factory
        expect(result.availableConnections).toEqual([{
            type: CONNECTOR_TYPE.REGULAR,
            childReference: 'waitEvent1'
        }, {
            type: CONNECTOR_TYPE.DEFAULT
        }]);
    });

    it('check for addFaultConnectionForWaitElement', () => {
        // Since Fault Connection was originally available
        expect(result.addFaultConnectionForWaitElement).toBeTruthy();
    });
});

describe('Existing Wait Element with Fault Connection available', () => {
    let originalWait;
    let newChildReferences;
    let deletedChildElementGuids;

    beforeEach(() => {
        originalWait = {
            guid: 'wait1',
            waitEventReferences: [{
                waitEventReference: 'waitEvent1'
            }, {
                waitEventReference: 'waitEvent2'
            }],
            availableConnections: [{
                type: CONNECTOR_TYPE.REGULAR,
                childReference: 'waitEvent1'
            }, {
                type: CONNECTOR_TYPE.FAULT
            }]
        };

        newChildReferences = [{
            waitEventReference: 'waitEvent1'
        }, {
            waitEventReference: 'waitEvent3'
        }];

        deletedChildElementGuids = ['waitEvent2'];
    });

    describe('Adding a waitEvent and deleting a waitEvent with an associated connector', () => {
        it('check for connectorCount', () => {
            const result = getConnectionProperties(originalWait, newChildReferences, deletedChildElementGuids, 'waitEventReferences', 'waitEventReference');
            // For the Default Connection
            expect(result.connectorCount).toEqual(1);
        });

        it('check for availableConnections', () => {
            const result = getConnectionProperties(originalWait, newChildReferences, deletedChildElementGuids, 'waitEventReferences', 'waitEventReference');
            // Fault Connection isn't present in the availableConnections because that gets added in the wait factory
            expect(result.availableConnections).toEqual([{
                type: CONNECTOR_TYPE.REGULAR,
                childReference: 'waitEvent1'
            }, {
                type: CONNECTOR_TYPE.REGULAR,
                childReference: 'waitEvent3'
            }]);
        });

        it('check for addFaultConnectionForWaitElement', () => {
            const result = getConnectionProperties(originalWait, newChildReferences, deletedChildElementGuids, 'waitEventReferences', 'waitEventReference');
            // Since Fault Connection was originally available
            expect(result.addFaultConnectionForWaitElement).toBeTruthy();
        });
    });

    describe('Adding an outcome and deleting a "free" outcome', () => {
        let result;

        beforeEach(() => {
            newChildReferences = [{
                waitEventReference: 'waitEvent2'
            }, {
                waitEventReference: 'waitEvent3'
            }];

            deletedChildElementGuids = ['waitEvent1'];
            result = getConnectionProperties(originalWait, newChildReferences, deletedChildElementGuids, 'waitEventReferences', 'waitEventReference');
        });

        it('check for connectorCount', () => {
            // Each for waitEvent2 and Default Connection
            expect(result.connectorCount).toEqual(2);
        });

        it('check for availableConnections', () => {
            // Fault Connection isn't present in the availableConnections because that gets added in the wait factory
            expect(result.availableConnections).toEqual([{
                type: CONNECTOR_TYPE.REGULAR,
                childReference: 'waitEvent3'
            }]);
        });

        it('check for addFaultConnectionForWaitElement', () => {
            // Since Fault Connection was originally available
            expect(result.addFaultConnectionForWaitElement).toBeTruthy();
        });
    });
});

describe('Existing Wait Element with Fault Connection unavailable', () => {
    let originalWait;
    let newChildReferences;
    let deletedChildElementGuids;

    beforeEach(() => {
        originalWait = {
            guid: 'wait1',
            waitEventReferences: [{
                waitEventReference: 'waitEvent1'
            }, {
                waitEventReference: 'waitEvent2'
            }],
            availableConnections: [{
                type: CONNECTOR_TYPE.REGULAR,
                childReference: 'waitEvent1'
            }]
        };

        newChildReferences = [{
            waitEventReference: 'waitEvent1'
        }, {
            waitEventReference: 'waitEvent3'
        }];

        deletedChildElementGuids = ['waitEvent2'];
    });

    describe('Adding a waitEvent and deleting a waitEvent with an associated connector', () => {
        it('check for connectorCount', () => {
            const result = getConnectionProperties(originalWait, newChildReferences, deletedChildElementGuids, 'waitEventReferences', 'waitEventReference');
            // For Default Connection. The additional connectorCount for the Fault Connection gets added in the wait factory
            expect(result.connectorCount).toEqual(1);
        });

        it('check for availableConnections', () => {
            const result = getConnectionProperties(originalWait, newChildReferences, deletedChildElementGuids, 'waitEventReferences', 'waitEventReference');
            expect(result.availableConnections).toEqual([{
                type: CONNECTOR_TYPE.REGULAR,
                childReference: 'waitEvent1'
            }, {
                type: CONNECTOR_TYPE.REGULAR,
                childReference: 'waitEvent3'
            }]);
        });

        it('check for addFaultConnectionForWaitElement', () => {
            const result = getConnectionProperties(originalWait, newChildReferences, deletedChildElementGuids, 'waitEventReferences', 'waitEventReference');
            // Since Fault Connection was originally unavailable
            expect(result.addFaultConnectionForWaitElement).toBeFalsy();
        });
    });

    describe('Adding an outcome and deleting a "free" outcome', () => {
        let result;

        beforeEach(() => {
            newChildReferences = [{
                waitEventReference: 'waitEvent2'
            }, {
                waitEventReference: 'waitEvent3'
            }];

            deletedChildElementGuids = ['waitEvent1'];
            result = getConnectionProperties(originalWait, newChildReferences, deletedChildElementGuids, 'waitEventReferences', 'waitEventReference');
        });

        it('check for connectorCount', () => {
            // For waitEvent2 and Default Connection. The additional connectorCount for the Fault Connection gets added in the wait factory
            expect(result.connectorCount).toEqual(2);
        });

        it('check for availableConnections', () => {
            expect(result.availableConnections).toEqual([{
                type: CONNECTOR_TYPE.REGULAR,
                childReference: 'waitEvent3'
            }]);
        });

        it('check for addFaultConnectionForWaitElement', () => {
            // Since Fault Connection was originally unavailable
            expect(result.addFaultConnectionForWaitElement).toBeFalsy();
        });
    });
});