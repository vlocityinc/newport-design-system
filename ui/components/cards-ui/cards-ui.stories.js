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
  .add("LeftAccountInfoState", () => {
    return withExample(`<div class="nds-table-account-info">
    <table
      class="nds-table nds-table--bordered nds-max-medium-table--stacked-horizontal"
    >
      <tbody>
        <tr>
          <td
            data-label="Phone"
            class="nds-tile nds-p-bottom--medium state-field"
          >
            <div class="nds-truncate">
              <div>
                <div>
                  <span title="8281261518">8281261518</span>
                </div>
              </div>
            </div>
          </td>
          <td
            data-label="Billing Address"
            class="nds-tile nds-p-bottom--medium state-field"
          >
            <div class="nds-truncate">
              <div>
                <div>
                  <span title="BENGALURU">BENGALURU</span>
                </div>
              </div>
            </div>
          </td>
          <td
            data-label="Website"
            class="nds-tile nds-p-bottom--medium state-field"
          >
            <div class="nds-truncate">
              <div>
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
