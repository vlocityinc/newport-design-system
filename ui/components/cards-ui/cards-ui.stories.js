import { storiesOf } from "@storybook/html";
import base from "paths.macro";
import notes from "./doc.md";
import scss from "./base/_index.scss";
import {
  withExample,
  withDocs,
  commentToHTML,
} from "../../../scripts/storybook";

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add("SldsHeader", () => {
    return withExample(
      `
        <div class="nds-page-header nds-page-header_record-home">
        <div class="nds-page-header__row">
            <div class="nds-page-header__col-title">
            <div class="nds-media">
                <div class="nds-media__figure">
                <svg
                    aria-hidden="true"
                    class="nds-icon nds-icon-text-default nds-icon_large"
                    style="
                    fill: rgb(252, 185, 91);
                    background-color: rgb(255, 255, 255);
                    "
                >
                    <use
                    xlink:href="#httpsmcarddevedlightningforcecomresource1596625800000vlocitymcardnewportassetsiconsstandardspritesvgsymbolssvg_opportunity"
                    ></use></svg
                ><span class="nds-assistive-text"></span>
                </div>
                <div class="nds-media__body">
                <div class="nds-page-header__name">
                    <div class="nds-page-header__name-title">
                    <h1>
                        <span>Sample Header</span
                        ><span
                        title="Slds header with no fields"
                        class="nds-page-header__title nds-truncate"
                        >Slds header with no fields</span
                        >
                    </h1>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <div class="nds-page-header__col-actions">
            <div class="nds-page-header__controls">
                <div class="nds-page-header__control">
                <slot name="sldsheaderbutton"
                    ><div slot="sldsheaderbutton">
                    <ul class="nds-button-group-list">
                        <li>
                        <button class="nds-button nds-button_neutral">
                            Custom Button 1
                        </button>
                        </li>
                        <li>
                        <button class="nds-button nds-button_neutral">
                            Custom Button 2
                        </button>
                        </li>
                        <li>
                        <button class="nds-button nds-button_neutral">
                            Custom Button 3
                        </button>
                        </li>
                        <li>
                        <div
                            class="nds-dropdown-trigger nds-dropdown-trigger_click"
                        >
                            <button
                            aria-haspopup="true"
                            title="More Actions"
                            class="nds-button nds-button_icon nds-button_icon-border-filled"
                            >
                            <svg
                                aria-hidden="true"
                                class="nds-button__icon nds-icon-text-default nds-icon_xx-small nds-button__icon_left"
                            >
                                <use
                                xlink:href="#httpsmcarddevedlightningforcecomresource1596625800000vlocitymcardnewportassetsiconsutilityspritesvgsymbolssvg_down"
                                ></use></svg
                            ><span class="nds-assistive-text"></span
                            ><span class="nds-assistive-text">More Actions</span>
                            </button>
                        </div>
                        </li>
                    </ul>
                    </div></slot
                >
                </div>
            </div>
            </div>
        </div>
        <div class="nds-page-header__row">
            <div class="nds-page-header__col-meta">
            <p class="nds-page-header__meta-text">
                <slot name="sldsheadermeta"></slot>
            </p>
            </div>
        </div>
        <div class="nds-page-header__row nds-page-header__row_gutters">
            <div class="nds-page-header__col-details"></div>
        </div>
        </div>

        `
    );
  })
  .add("LeftAccountInfoState", () => {
    return withExample(`<div class="slds-table-cont">
    <table
      class="via-card--left-acount-info-slds slds-table slds-table--bordered slds-max-medium-table--stacked-horizontal"
    >
      <tbody>
        <tr>
          <td
            data-label="Phone"
            class="via-field slds-tile slds-p-bottom--medium state-field"
          >
            <div class="slds-truncate">
              <div class="vloc-min-height">
                <div>
                  <span title="8281261518">8281261518</span>
                </div>
              </div>
            </div>
          </td>
          <td
            data-label="Billing Address"
            class="via-field slds-tile slds-p-bottom--medium state-field"
          >
            <div class="slds-truncate">
              <div class="vloc-min-height">
                <div>
                  <span title="BENGALURU">BENGALURU</span>
                </div>
              </div>
            </div>
          </td>
          <td
            data-label="Website"
            class="via-field slds-tile slds-p-bottom--medium state-field"
          >
            <div class="slds-truncate">
              <div class="vloc-min-height">
                <div>
                  <span title="['Website']">['Website']</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `);
  });
