import {createElement} from 'lwc';
import RichLabel from "../richLabel";

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-rich-label', {
        is: RichLabel
    });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
};

describe('Rich label', () => {
    test('label not set', () => {
        const element = createComponentUnderTest({});
        expect(element).toMatchSnapshot();
    });
    test('label with args', () => {
        const element = createComponentUnderTest({label:'begin {0} {2} {1} end', args:['arg0', 'arg1', 'arg2']});
        expect(element).toMatchSnapshot();
    });
    test('label with strong tag', () => {
        const element = createComponentUnderTest({label:'begin {0} <strong>{2}</strong> {1} end', args:['arg0', 'arg1', 'arg2']});
        expect(element).toMatchSnapshot();
    });
    test('args are properly escaped', () => {
        const element = createComponentUnderTest({label:'the url is <strong>{0}</strong>', args:'<img src="http://foo.bar/foo.jpg" />'});
        expect(element).toMatchSnapshot();
    });
});