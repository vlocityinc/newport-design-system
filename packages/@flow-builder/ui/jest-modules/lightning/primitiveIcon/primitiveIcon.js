import { LightningElement, api } from "lwc";

export default class LightningPrimitiveIcon extends LightningElement {
  @api
  href = null;
  @api
  name;
}
