import {
    convertHTMLToQuillHTML
} from '../richTextConverter';

const originalText = '<TEXTFORMAT LEADING="2"><LI><FONT FACE="Times New Roman" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0">1</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING="2"><LI><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0">2</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING="2"><LI><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0">3</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING="2"><LI><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0">Bonjour</FONT></LI></TEXTFORMAT><DIV ALIGN="JUSTIFY"><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0"><B>Bonjour En Gras</B></FONT></DIV><DIV ALIGN="JUSTIFY"><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0">Et de 2</FONT></DIV><TEXTFORMAT LEADING="2"><LI><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0"></FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING="2"><LI><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0">A</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING="2"><LI><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0">B</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING="2"><LI><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0"><B><I><U>C</U></I></B></FONT></LI></TEXTFORMAT>';
const convertedText = '<div><ul><li><span style="font-size: 12px; font-family: serif; color: rgb(0, 0, 0);" letterspacing="0" kerning="0">1</span></li><li><span style="font-size: 12px; font-family: sans-serif; color: rgb(0, 0, 0);" letterspacing="0" kerning="0">2</span></li><li><span style="font-size: 12px; font-family: sans-serif; color: rgb(0, 0, 0);" letterspacing="0" kerning="0">3</span></li><li><span style="font-size: 12px; font-family: sans-serif; color: rgb(0, 0, 0);" letterspacing="0" kerning="0">Bonjour</span></li></ul><div style="text-align: justify;"><span style="font-size: 12px; font-family: sans-serif; color: rgb(0, 0, 0);" letterspacing="0" kerning="0"><b>Bonjour En Gras</b></span></div><div style="text-align: justify;"><span style="font-size: 12px; font-family: sans-serif; color: rgb(0, 0, 0);" letterspacing="0" kerning="0">Et de 2</span></div><ul><li><span style="font-size: 12px; font-family: sans-serif; color: rgb(0, 0, 0);" letterspacing="0" kerning="0"></span></li><li><span style="font-size: 12px; font-family: sans-serif; color: rgb(0, 0, 0);" letterspacing="0" kerning="0">A</span></li><li><span style="font-size: 12px; font-family: sans-serif; color: rgb(0, 0, 0);" letterspacing="0" kerning="0">B</span></li><li><span style="font-size: 12px; font-family: sans-serif; color: rgb(0, 0, 0);" letterspacing="0" kerning="0"><b><i><u>C</u></i></b></span></li></ul></div>';

const liWithoutUL = '<TEXTFORMAT LEADING="2"><li><span style="">1</span></li></TEXTFORMAT><TEXTFORMAT LEADING="2"><li><span style="">2</span></li></TEXTFORMAT>';
const liWithULConverted  = '<ul><li><span style="">1</span></li><li><span style="">2</span></li></ul>';

const textWithFontTag = '<FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0">1</FONT>';
const textfontTagConverted = '<span style="font-size: 12px; font-family: sans-serif; color: rgb(0, 0, 0);" letterspacing="0" kerning="0">1</span>';

const divTag = '<DIV ALIGN="JUSTIFY"><B>Bold Hello</B></DIV>';
const divTagConverted = '<div style="text-align: justify;"><b>Bold Hello</b></div>';

const invalidHtmlTag = '<p>This is a paragraph';
const invalidHtmlTagConverted = '<p>This is a paragraph</p>';

const unknownHtmlTag = '<edfdsf style="text-align: justify;"></edfdsf>';
const unknownHtmlTagConverted = "";

const htmlWithTextWithNewLines = 'line 1\r\nline 2\r\nline 3\r\nLine 4\r\nEnd';
const htmlWithTextWithNewLinesConverted = '<div style="white-space: pre;">line 1\nline 2\nline 3\nLine 4\nEnd</div>';

const htmlWithTextWithNewLinesWithExistingP = '<p>line 1\r\nline 2\r\nline 3\r\nLine 4\r\nEnd</p>';
const htmlWithTextWithNewLinesWithExistingPConverted = '<p style="white-space: pre;">line 1\nline 2\nline 3\nLine 4\nEnd</p>';

const textWithHorizontalWhitespaces = 'first column    second column  ';
const textWithHorizontalWhitespacesConverted = '<div style="white-space: pre;">first column    second column  </div>';

const textWithSpacesAtBothEnds = '       there are some spaces before and after     ';
const textWithSpacesAtBothEndsConverted = '<div style="white-space: pre;">       there are some spaces before and after     </div>';

describe('Convert richText', () => {
    let previousXMLSerializer;
    beforeAll(() => {
        previousXMLSerializer = window.XMLSerializer;
        window.XMLSerializer = jest.fn(() => ({
            // eslint-disable-next-line @lwc/lwc/no-inner-html
            serializeToString: (xmlDoc) =>  xmlDoc.outerHTML
        }));
    });

    afterAll(() => {
        window.XMLSerializer = previousXMLSerializer;
    });
    it('Returns correctly convert richText', () => {
        const result = convertHTMLToQuillHTML(originalText);
        expect(result).toBe(convertedText);
    });
    it('Should not modify the html if is is converted twice', () => {
        const result = convertHTMLToQuillHTML(convertedText);
        expect(result).toBe(convertedText);
    });
    it('Add UL tag around LI', () => {
        const result = convertHTMLToQuillHTML(liWithoutUL);
        expect(result).toBe(liWithULConverted);
    });
    describe('font tag', () => {
        it('should replace font tag by span tag', () => {
            const result = convertHTMLToQuillHTML(textWithFontTag);
            expect(result).toBe(textfontTagConverted);
        });
        it('should convert font name to a font name supported by lightning-input-rich-text when possible', () => {
            expect(convertHTMLToQuillHTML('<FONT FACE="Arial">hello</FONT>')).toBe('<span style="font-family: sans-serif;">hello</span>');
        });
        it('should keep the font name when there is no corresponding font name supported by lightning-input-rich-text', () => {
            expect(convertHTMLToQuillHTML('<FONT FACE="Courier New">hello</FONT>')).toBe('<span style="font-family: Courier New;">hello</span>');
        });
        it('should not set a font-family when font is the default one', () => {
            expect(convertHTMLToQuillHTML('<FONT FACE="Salesforce Sans">hello</FONT>')).toBe('<span>hello</span>');
        });
        it('should remove FACE attribute', () => {
            const result = convertHTMLToQuillHTML(textWithFontTag);
            expect(result.toUpperCase()).not.toContain('FACE=');
        });
        it('should remove COLOR attribute', () => {
            const result = convertHTMLToQuillHTML(textWithFontTag);
            expect(result.toUpperCase()).not.toContain('COLOR=');
        });
    });
    it('should convert ALIGN attribute to style in a DIV', () => {
        const result = convertHTMLToQuillHTML(divTag);
        expect(result).toBe(divTagConverted);
    });
    it('should remove unknown html tag', () => {
        const result = convertHTMLToQuillHTML(unknownHtmlTag);
        expect(result).toBe(unknownHtmlTagConverted);
    });
    it('should remove invalid html tag', () => {
        const result = convertHTMLToQuillHTML(invalidHtmlTag);
        expect(result).toBe(invalidHtmlTagConverted);
    });
    describe('white spaces', () => {
        it('should add "white-space: pre" to style when there are line breaks', () => {
            const result = convertHTMLToQuillHTML(htmlWithTextWithNewLines);
            expect(result).toBe(htmlWithTextWithNewLinesConverted);
        });
        it('should add "white-space: pre" to style if the parent node is p', () => {
            const result = convertHTMLToQuillHTML(htmlWithTextWithNewLinesWithExistingP);
            expect(result).toBe(htmlWithTextWithNewLinesWithExistingPConverted);
        });
        it('should add "white-space: pre" to style when there are consecutive horizontal whitespaces', () => {
            const result = convertHTMLToQuillHTML(textWithHorizontalWhitespaces);
            expect(result).toBe(textWithHorizontalWhitespacesConverted);
        });
        it('should preserve spaces at both ends of the string', () => {
            const result = convertHTMLToQuillHTML(textWithSpacesAtBothEnds);
            expect(result).toBe(textWithSpacesAtBothEndsConverted);
        });
    });
});