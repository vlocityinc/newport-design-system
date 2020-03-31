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
  .add("b2bCategoriesList", () => {
    return withExample(`
    <div class="nds-b2b-categories-list">
      <!-- nav-toggler for mobile version only -->
      <div class="nds-b2b-nav-toggler">
        <c-icon theme="nds" icon-name="utility:rows" size="small" extraclass="nds-icon-text-default">
          <img src="/assets/icons/utility/rows_60.png" alt="utility:rows"/>
        </c-icon>
      </div>
      

      <nav class="nds-b2b-categories-list_nav" role="navigation">
        <ul class="nds-b2b-categories-list_nav-list">
          <c-b2b-category-item>
            <li>
              <input id="group-1" type="checkbox" hidden />
              <label for="group-1" class="nds-b2b-category-name nds-b2b-category-name_label">
                <c-icon theme="nds" icon-name="utility:rows" size="small" extraclass="nds-icon-text-default" class="nds-b2b-category-icon">
                  <span class="nds-icon_container nds-icon-utility-phone_portrait">
                    <svg class="nds-icon nds-icon-text-default nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#phone_portrait"></use>
                    </svg>
                  </span>
                </c-icon>
                Ethernet
              </label>
              <ul class="nds-b2b-category_group-list">
                <li class="nds-b2b-category-name">E-LAN</li>
                <li class="nds-b2b-category-name">Cloud</li>
                <li class="nds-b2b-category-name">Point to Point</li>
                <c-b2b-category-item>
                  <li>
                    <input id="sub-group-1" type="checkbox" hidden />
                    <label for="sub-group-1" class="nds-b2b-category-name"> Second level</label>
                    <ul class="nds-b2b-category_group-list">
                      <li class="nds-b2b-category-name">one</li>
                      <li class="nds-b2b-category-name">two</li>
                      <li class="nds-b2b-category-name">three</li>
                    </ul>
                  </li>
                </c-b2b-category-item>
              </ul>
            </li>
            <li>
              <input id="group-2" type="checkbox" hidden />
              <label for="group-2" class="nds-b2b-category-name nds-b2b-category-name_label">
                <c-icon theme="nds" icon-name="utility:rows" size="small" extraclass="nds-icon-text-default" class="nds-b2b-category-icon">
                  <span class="nds-icon_container nds-icon-utility-phone_portrait">
                    <svg class="nds-icon nds-icon-text-default nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#phone_portrait"></use>
                    </svg>
                  </span>
                </c-icon>
                Accessories
              </label>
              <ul class="nds-b2b-category_group-list">
                <li class="nds-b2b-category-name">E-LAN</li>
                <li class="nds-b2b-category-name">Cloud</li>
                <li class="nds-b2b-category-name">Point to Point</li>
              </ul>
            </li>
            <li>
              <input id="group-3" type="checkbox" hidden />
              <label for="group-3" class="nds-b2b-category-name nds-b2b-category-name_label">
                <c-icon theme="nds" icon-name="utility:rows" size="small" extraclass="nds-icon-text-default" class="nds-b2b-category-icon">
                  <span class="nds-icon_container nds-icon-utility-phone_portrait">
                    <svg class="nds-icon nds-icon-text-default nds-icon_x-small" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#phone_portrait"></use>
                    </svg>
                  </span>
                </c-icon>
                Plans & Services
              </label>
              <ul class="nds-b2b-category_group-list">
                <li class="nds-b2b-category-name">E-LAN</li>
                <li class="nds-b2b-category-name">Cloud</li>
                <li class="nds-b2b-category-name">Point to Point</li>
              </ul>
            </li>
          </c-b2b-category-item>
        </ul>
      </nav>
    </div>`);
  });
