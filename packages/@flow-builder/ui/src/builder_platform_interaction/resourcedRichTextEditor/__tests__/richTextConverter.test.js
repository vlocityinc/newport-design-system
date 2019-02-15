import {
    convertHTMLToQuillHTML
} from '../richTextConverter';

const originalText = "<TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Times New Roman\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">1</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">2</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">3</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">Bonjour</FONT></LI></TEXTFORMAT><DIV ALIGN=\"JUSTIFY\"><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\"><B>Bonjour En Gras</B></FONT></DIV><DIV ALIGN=\"JUSTIFY\"><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">Et de 2</FONT></DIV><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">A</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">B</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\"><B><I><U>C</U></I></B></FONT></LI></TEXTFORMAT>";
const convertedText = "<ul><li><span style=\"font-size: 12px; font-family: Times New Roman; color: rgb(0, 0, 0);\" letterspacing=\"0\" kerning=\"0\">1</span></li><li><span style=\"font-size: 12px; font-family: Arial; color: rgb(0, 0, 0);\" letterspacing=\"0\" kerning=\"0\">2</span></li><li><span style=\"font-size: 12px; font-family: Arial; color: rgb(0, 0, 0);\" letterspacing=\"0\" kerning=\"0\">3</span></li><li><span style=\"font-size: 12px; font-family: Arial; color: rgb(0, 0, 0);\" letterspacing=\"0\" kerning=\"0\">Bonjour</span></li></ul><div style=\"text-align: justify;\"><span style=\"font-size: 12px; font-family: Arial; color: rgb(0, 0, 0);\" letterspacing=\"0\" kerning=\"0\"><b>Bonjour En Gras</b></span></div><div style=\"text-align: justify;\"><span style=\"font-size: 12px; font-family: Arial; color: rgb(0, 0, 0);\" letterspacing=\"0\" kerning=\"0\">Et de 2</span></div><ul><li><span style=\"font-size: 12px; font-family: Arial; color: rgb(0, 0, 0);\" letterspacing=\"0\" kerning=\"0\"></span></li><li><span style=\"font-size: 12px; font-family: Arial; color: rgb(0, 0, 0);\" letterspacing=\"0\" kerning=\"0\">A</span></li><li><span style=\"font-size: 12px; font-family: Arial; color: rgb(0, 0, 0);\" letterspacing=\"0\" kerning=\"0\">B</span></li><li><span style=\"font-size: 12px; font-family: Arial; color: rgb(0, 0, 0);\" letterspacing=\"0\" kerning=\"0\"><b><i><u>C</u></i></b></span></li></ul>";


const liWithoutUL = "<TEXTFORMAT LEADING=\"2\"><li><span style=\"\">1</span></li></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><li><span style=\"\">2</span></li></TEXTFORMAT>";
const liWithULConverted  = "<ul><li><span style=\"\">1</span></li><li><span style=\"\">2</span></li></ul>";


const textWithFontTag = "<FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">1</FONT>";
const textfontTagConverted = "<span style=\"font-size: 12px; font-family: Arial; color: rgb(0, 0, 0);\" letterspacing=\"0\" kerning=\"0\">1</span>";

const divTag = "<DIV ALIGN=\"JUSTIFY\"><B>Bold Hello</B></DIV>";
const divTagConverted = "<div style=\"text-align: justify;\"><b>Bold Hello</b></div>";

const invalidHtmlTag = "<p>This is a paragraph";
const invalidHtmlTagConverted = "<p>This is a paragraph</p>";

const unknownHtmlTag = "<edfdsf style=\"text-align: justify;\"></edfdsf>";
const unknownHtmlTagConverted = "";

describe('Convert richText', () => {
    beforeAll(() => {
        window.XMLSerializer = jest.fn(() => ({
            // eslint-disable-next-line lwc/no-inner-html
            serializeToString: (xmlDoc) =>  xmlDoc.outerHTML
        }));
    });

    afterAll(() => {
        window.XMLSerializer = jest.fn();
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
    it('replace font tag by span tag', () => {
        const result = convertHTMLToQuillHTML(textWithFontTag);
        expect(result).toBe(textfontTagConverted);
    });
    it('should remove FACE attribute', () => {
        const result = convertHTMLToQuillHTML(textWithFontTag);
        expect(result).not.toContain('FACE');
    });
    it('should remove COLOR attribute', () => {
        const result = convertHTMLToQuillHTML(textWithFontTag);
        expect(result).not.toContain('COLOR');
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
});