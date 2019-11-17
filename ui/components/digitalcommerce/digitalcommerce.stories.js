import { storiesOf } from "@storybook/html";
import base from "paths.macro";
import notes from "./doc.md";
import {
  withExample,
  withDocs,
  commentToHTML
} from "../../../scripts/storybook";
storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .add("dcTotalBar", () => {
    return withExample(`<article>
    <div class="nds-align_absolute-center nds-is-fixed nds-p-vertical_medium nds-totalbar">
      <div class="nds-align_absolute-center nds-clearfix">
        <div class="nds-totalbar-price-container nds-color__text_gray-1 nds-float_right">
          <div class="nds-totalbar-container nds-float_right nds-text-align_right">
            <span class="nds-totabar-label nds-text-body_regular nds-text-align_left">
              Due Monthly
            </span>
            <div class="nds-totabar-value nds-text-align_left">
              90
            </div>  
          </div>
          <span class="nds-totalbar-container nds-float_right nds-text-align_right nds-totalbar-container-pipe">  
          </span>
          <div class="nds-totalbar-container nds-float_right nds-text-align_right">
            <span class="nds-totabar-label nds-text-body_regular">
              Due Today
            </span>
            <div class="nds-totabar-value">
              1200
            </div>  
          </div>
        </div>
      </div>
      <div>
        <div class="nds-float_right nds-text-align_right">
           <button class="nds-button nds-button_neutral nds-m-right_medium nds-p-horizontal_x-large">Checkout</button>
        </div> 
      </div>
    </div>
    </article>`);
  });
