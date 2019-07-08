import { LightningElement, api } from "lwc";

export default class ConditionListItem extends LightningElement {
  @api
  itemIndex;

  @api
  condition = {};

  @api
  deleteable;
}
