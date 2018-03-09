import { translateUIModelToFlow } from '../ui-to-flow-translator';
import { ELEMENT_TYPE } from 'builder_platform_interaction-constant';

const UI_MODEL = {
    elements:{
        'assignment_1': {
            "assignmentItems": [{
                "assignToReference": "var",
                "operator": "Assign",
                "processMetadataValues": [],
                "value": {
                    "elementReference": "assignment_1"
                }
            }],
            "connector": {},
            "label": "Assignment",
            "locationX": 482,
            "locationY": 130,
            "name": "Assignment",
            "processMetadataValues": [],
            'elementType':ELEMENT_TYPE.ASSIGNMENT
        }
    },
    properties:{
        fullName:'bestFlow'
    }
};


describe('UI to Flow Translator', () => {
    it('translates from ui model to backend model', () => {
        const flow = translateUIModelToFlow(UI_MODEL);

        expect(flow.metadata.assignments).toHaveLength(1);
        expect(flow.metadata.assignments[0].assignmentItems[0].value.elementReference).toEqual('Assignment');
        expect(flow.fullName).toEqual('bestFlow');
    });
});
