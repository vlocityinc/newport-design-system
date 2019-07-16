import { LightningElement, api } from "lwc";

export default class ButtonMenu extends LightningElement {
  @api alternativeText;
  @api disabled;
  @api draftAlternativeText;
  @api iconName;
  @api iconSize;
  @api isDraft;
  @api isLoading;
  @api label;
  @api loadingStateAlternativeText;
  @api menuAlignment;
  @api nubbin;
  @api value;
  @api variant;
  @api focus() {}
}
