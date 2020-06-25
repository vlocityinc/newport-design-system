import { LightningElement, api } from 'lwc';
import resultLabel from '@salesforce/label/DebugLogEmail.RecordElementResult';

export default class debugPanelBody extends LightningElement {
    @api rawText;
    @api title;
    textObj = [{}];

    connectedCallback() {
        this.getDebugInfoBody();
    }

    getDebugInfoBody() {
        let splitText = this.rawText.split(['\\n']);
        if (splitText[0] === '') {
            splitText = splitText.slice(1);
        }

        for (let i = 0; i < splitText.length; i++) {
            const curr = splitText[i];
            if (curr !== '' && !curr.includes('$$:') && curr !== this.title) {
                const temp = { value: splitText[i], isBold: false, isErr: false };
                if (curr === resultLabel || curr.charAt(curr.length - 1) === ':') {
                    temp.isBold = true;
                }
                this.textObj.push(temp);
            }
        }
    }
}
