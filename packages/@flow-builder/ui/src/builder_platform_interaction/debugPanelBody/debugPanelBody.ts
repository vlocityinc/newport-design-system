import { LightningElement, api } from 'lwc';
import resultLabel from '@salesforce/label/DebugLogEmail.RecordElementResult';

export default class debugPanelBody extends LightningElement {
    @api rawText;

    splitText = [''];
    textObj = [{}];
    title;

    connectedCallback() {
        this.splitText = this.rawText.split(['\\n']);

        // random empty string
        this.splitText.shift();

        // details
        this.title = this.splitText[0];
        this.splitText.shift();

        for (let i = 0; i < this.splitText.length; i++) {
            const curr = this.splitText[i];
            if (curr !== '' && !curr.includes('$$:')) {
                const temp = { value: this.splitText[i], isBold: false, isErr: false };
                if (curr === resultLabel || curr.charAt(curr.length - 1) === ':') {
                    temp.isBold = true;
                }
                this.textObj.push(temp);
            }
        }
    }
}
