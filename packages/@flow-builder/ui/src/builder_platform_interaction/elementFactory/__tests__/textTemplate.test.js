import { createTextTemplate } from '../textTemplate';
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";

describe('textTemplate', () => {
        let textTemplate;

        beforeEach(() => {
            textTemplate = createTextTemplate();
        });

        it('creates element of type textTemplate', () => {
            expect(textTemplate.elementType).toEqual(ELEMENT_TYPE.TEXT_TEMPLATE);
        });

        it('has text', () => {
            expect(textTemplate.text).toEqual(expect.any(String));
            expect(textTemplate.text).toHaveLength(0);
        });

        it('has default data type of STRING', () => {
            expect(textTemplate.dataType).toEqual(FLOW_DATA_TYPE.STRING.value);
        });

        it('uses existing values when passed in an outcome object', () => {
            const mockText = 'fizz buzz';
            const mockTextTemplate =  {
                text: mockText,
                dataType: 'sfdc',
            };
            textTemplate = createTextTemplate(mockTextTemplate);

            expect(textTemplate.text).toEqual(mockText);
            // cannot change data type
            expect(textTemplate.dataType).toEqual(FLOW_DATA_TYPE.STRING.value);
        });
});