import { escapeHtml } from '../common-utils';

describe('escapeHtml', () => {
    const validationTestData = [
        {value: '<script type=\'\' src=""></script>', result: '&lt;script type=&#x27;&#x27; src=&quot;&quot;&gt;&lt;&#x2F;script&gt;'},
        {value: '<a href="https://www.foo.com/html?param1=1&param2=2">Visit our site</a>', result: '&lt;a href=&quot;https:&#x2F;&#x2F;www.foo.com&#x2F;html?param1=1&amp;param2=2&quot;&gt;Visit our site&lt;&#x2F;a&gt;'}
    ];

    validationTestData.forEach(testData => {
        it(`returns '${testData.result}' for '${testData.value}'`, () => {
            expect(escapeHtml(testData.value)).toEqual(testData.result);
        });
    });
});