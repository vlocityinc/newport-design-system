import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from '../doc.md';
import scss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<div class="demo-only nds-grid" style="height: 845px; max-width: 420px; background: rgb(244, 246, 249) none repeat scroll 0% 0%; padding: 1rem;">
  <div class="nds-panel nds-grid nds-grid_vertical nds-nowrap">
    <div class="nds-form nds-form_stacked nds-grow nds-scrollable_y">
      <div class="nds-panel__section nds-border_bottom">
        <div class="nds-media">
          <div class="nds-media__figure">
            <label class="nds-checkbox">
              <input type="checkbox" name="options" id="checkbox-119" value="on">
              <span class="nds-checkbox_faux"></span>
              <label class="nds-checkbox__label">
                <span class="nds-form-element__label nds-assistive-text">Complete Task</span>
              </label>
            </label>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate nds-text-heading_small" title="Follow up on '15 contact">
              <a href="javascript:void(0);">Follow up on '15 contact</a>
            </h2>
            <p class="nds-truncate nds-text-body_small" title="Jun 18">Jun 18</p>
            <div class="nds-button-group nds-m-top_small" role="group">
              <button class="nds-button nds-button_neutral nds-grow">Edit</button>
              <button class="nds-button nds-button_neutral nds-grow">Follow Up</button>
              <button class="nds-button nds-button_neutral nds-grow">Delete</button>
              <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="More Actions">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                </svg>
                <span class="nds-assistive-text">More Actions</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="nds-panel__section">
        <h3 class="nds-text-heading_small nds-m-bottom_medium">Task Information</h3>
        <ul>
          <li class="nds-form-element nds-hint-parent nds-border_bottom">
            <span class="nds-form-element__label">Subject</span>
            <div class="nds-form-element__control">
              <span class="nds-form-element__static">Follow up on '15 Contract</span>
            </div>
          </li>
          <li class="nds-form-element nds-hint-parent nds-border_bottom">
            <span class="nds-form-element__label">Due Date</span>
            <div class="nds-form-element__control">
              <span class="nds-form-element__static">6/18/16</span>
            </div>
          </li>
          <li class="nds-form-element nds-hint-parent nds-border_bottom">
            <span class="nds-form-element__label">Assigned TO</span>
            <div class="nds-form-element__control">
              <span class="nds-form-element__static">Jason Dewar</span>
            </div>
          </li>
          <li class="nds-form-element nds-hint-parent nds-border_bottom">
            <span class="nds-form-element__label">Name</span>
            <div class="nds-form-element__control">
              <span class="nds-form-element__static">Adam Choi</span>
            </div>
          </li>
          <li class="nds-form-element nds-hint-parent nds-border_bottom">
            <span class="nds-form-element__label">Related To</span>
            <div class="nds-form-element__control">
              <span class="nds-form-element__static">Tesla Cloudhub + Anypoint Connectors</span>
            </div>
          </li>
          <li class="nds-form-element nds-hint-parent nds-border_bottom">
            <span class="nds-form-element__label">Comments</span>
            <div class="nds-form-element__control">
              <span class="nds-form-element__static nds-text-longform">Adam was open to doing more business in the 4th quarter. Follow up with marketing demo and email templates.</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="nds-panel__section">
        <h3 class="nds-text-heading_small nds-m-bottom_medium">Additional Information</h3>
        <ul>
          <li class="nds-form-element nds-hint-parent nds-border_bottom">
            <span class="nds-form-element__label">Status</span>
            <div class="nds-form-element__control">
              <span class="nds-form-element__static">Not Started</span>
            </div>
          </li>
          <li class="nds-form-element nds-hint-parent nds-border_bottom">
            <span class="nds-form-element__label">Priority</span>
            <div class="nds-form-element__control">
              <span class="nds-form-element__static">Normal</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Panel Form Edit Mode (states)', () => {
    return withExample(`<div class="demo-only nds-grid" style="height: 845px; max-width: 420px; background: rgb(244, 246, 249) none repeat scroll 0% 0%; padding: 1rem;">
  <div class="nds-panel nds-grid nds-grid_vertical nds-nowrap">
    <div class="nds-form nds-form_stacked nds-grow nds-scrollable_y">
      <div class="nds-panel__section nds-border_bottom">
        <div class="nds-media">
          <div class="nds-media__figure">
            <label class="nds-checkbox">
              <input type="checkbox" name="options" id="checkbox-120" value="on">
              <span class="nds-checkbox_faux"></span>
              <label class="nds-checkbox__label">
                <span class="nds-form-element__label nds-assistive-text">Complete Task</span>
              </label>
            </label>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate nds-text-heading_small" title="Follow up on '15 contact">
              <a href="javascript:void(0);">Follow up on '15 contact</a>
            </h2>
            <p class="nds-truncate nds-text-body_small" title="Jun 18">Jun 18</p>
            <div class="nds-button-group nds-m-top_small" role="group">
              <button class="nds-button nds-button_neutral nds-grow">Edit</button>
              <button class="nds-button nds-button_neutral nds-grow">Follow Up</button>
              <button class="nds-button nds-button_neutral nds-grow">Delete</button>
              <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="More Actions">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                </svg>
                <span class="nds-assistive-text">More Actions</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="nds-panel__section">
        <h3 class="nds-text-heading_small nds-m-bottom_medium">Task Information</h3>
        <ul>
          <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
            <span class="nds-form-element__label">Subject</span>
            <div class="nds-form-element__control">
              <span class="nds-form-element__static">Follow up on '15 Contract</span>
              <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                </svg>
                <span class="nds-assistive-text">Edit this Field</span>
              </button>
            </div>
          </li>
          <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
            <span class="nds-form-element__label">Due Date</span>
            <div class="nds-form-element__control">
              <span class="nds-form-element__static">6/18/16</span>
              <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                </svg>
                <span class="nds-assistive-text">Edit this Field</span>
              </button>
            </div>
          </li>
          <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
            <span class="nds-form-element__label">Assigned TO</span>
            <div class="nds-form-element__control">
              <span class="nds-form-element__static">Jason Dewar</span>
              <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                </svg>
                <span class="nds-assistive-text">Edit this Field</span>
              </button>
            </div>
          </li>
          <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
            <span class="nds-form-element__label">Name</span>
            <div class="nds-form-element__control">
              <span class="nds-form-element__static">Adam Choi</span>
              <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                </svg>
                <span class="nds-assistive-text">Edit this Field</span>
              </button>
            </div>
          </li>
          <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
            <span class="nds-form-element__label">Related To</span>
            <div class="nds-form-element__control">
              <span class="nds-form-element__static">Tesla Cloudhub + Anypoint Connectors</span>
              <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                </svg>
                <span class="nds-assistive-text">Edit this Field</span>
              </button>
            </div>
          </li>
          <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
            <span class="nds-form-element__label">Comments</span>
            <div class="nds-form-element__control">
              <span class="nds-form-element__static nds-text-longform">Adam was open to doing more business in the 4th quarter. Follow up with marketing demo and email templates.</span>
              <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                </svg>
                <span class="nds-assistive-text">Edit this Field</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div class="nds-panel__section">
        <h3 class="nds-text-heading_small nds-m-bottom_medium">Additional Information</h3>
        <ul>
          <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
            <span class="nds-form-element__label">Status</span>
            <div class="nds-form-element__control">
              <span class="nds-form-element__static">Not Started</span>
              <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                </svg>
                <span class="nds-assistive-text">Edit this Field</span>
              </button>
            </div>
          </li>
          <li class="nds-form-element nds-hint-parent nds-border_bottom nds-form-element_edit">
            <span class="nds-form-element__label">Priority</span>
            <div class="nds-form-element__control">
              <span class="nds-form-element__static">Normal</span>
              <button class="nds-button nds-button_icon nds-float_right nds-button_icon nds-button_icon-small" title="Edit this Field">
                <svg class="nds-button__icon nds-button__icon_hint" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                </svg>
                <span class="nds-assistive-text">Edit this Field</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Panel Form Edit Mode Active (states)', () => {
    return withExample(`<div class="demo-only nds-grid" style="height: 845px; max-width: 420px; background: rgb(244, 246, 249) none repeat scroll 0% 0%; padding: 1rem;">
  <div class="nds-panel nds-grid nds-grid_vertical nds-nowrap nds-is-editing">
    <div class="nds-form nds-form_stacked nds-grow nds-scrollable_y">
      <div class="nds-panel__section nds-border_bottom">
        <div class="nds-media">
          <div class="nds-media__figure">
            <label class="nds-checkbox">
              <input type="checkbox" name="options" id="checkbox-121" value="on">
              <span class="nds-checkbox_faux"></span>
              <label class="nds-checkbox__label">
                <span class="nds-form-element__label nds-assistive-text">Complete Task</span>
              </label>
            </label>
          </div>
          <div class="nds-media__body">
            <h2 class="nds-truncate nds-text-heading_small" title="Follow up on '15 contact">
              <a href="javascript:void(0);">Follow up on '15 contact</a>
            </h2>
            <p class="nds-truncate nds-text-body_small" title="Jun 18">Jun 18</p>
            <div class="nds-button-group nds-m-top_small" role="group">
              <button class="nds-button nds-button_neutral nds-grow">Edit</button>
              <button class="nds-button nds-button_neutral nds-grow">Follow Up</button>
              <button class="nds-button nds-button_neutral nds-grow">Delete</button>
              <button class="nds-button nds-button_icon nds-button_icon-border-filled" aria-haspopup="true" title="More Actions">
                <svg class="nds-button__icon" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                </svg>
                <span class="nds-assistive-text">More Actions</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="nds-panel__section">
        <h3 class="nds-text-heading_small nds-m-bottom_medium">Task Information</h3>
        <ul>
          <div class="nds-form-element">
            <label class="nds-form-element__label" for="text-input-01">Subject</label>
            <div class="nds-form-element__control">
              <input class="nds-input" id="text-input-01" value="Follow up on '15 Contract">
            </div>
          </div>
          <div class="nds-form-element">
            <label class="nds-form-element__label" for="date-input-01">Due Date</label>
            <div class="nds-form-element__control">
              <input class="nds-input" id="date-input-01" value="6/18/16">
            </div>
          </div>
          <div class="nds-form-element nds-lookup nds-has-selection">
            <span class="nds-form-element__label" for="text-input-02">Assigned To</span>
            <div class="nds-form-element__control">
              <div class="nds-pill_container">
                <span class="nds-pill nds-pill_link">
                  <span class="nds-icon_container nds-icon-standard-avatar nds-pill__icon_container">
                    <svg class="nds-icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#avatar"></use>
                    </svg>
                    <span class="nds-assistive-text">Person</span>
                  </span>
                  <a href="javascript:void(0);" class="nds-pill__action" title="Jason Dewar">
                    <span class="nds-pill__label">Jason Dewar</span>
                  </a>
                  <button class="nds-button nds-button_icon nds-button_icon nds-pill__remove" title="Remove">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                    </svg>
                    <span class="nds-assistive-text">Remove</span>
                  </button>
                </span>
              </div>
            </div>
          </div>
          <div class="nds-form-element nds-lookup nds-has-selection">
            <span class="nds-form-element__label" for="text-input-03">Name</span>
            <div class="nds-form-element__control">
              <div class="nds-pill_container">
                <span class="nds-pill nds-pill_link">
                  <span class="nds-icon_container nds-icon-standard-avatar nds-pill__icon_container">
                    <svg class="nds-icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#avatar"></use>
                    </svg>
                    <span class="nds-assistive-text">Person</span>
                  </span>
                  <a href="javascript:void(0);" class="nds-pill__action" title="Adam Choi">
                    <span class="nds-pill__label">Adam Choi</span>
                  </a>
                  <button class="nds-button nds-button_icon nds-button_icon nds-pill__remove" title="Remove">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                    </svg>
                    <span class="nds-assistive-text">Remove</span>
                  </button>
                </span>
              </div>
            </div>
          </div>
          <div class="nds-form-element nds-lookup nds-has-selection">
            <span class="nds-form-element__label" for="text-input-04">Related To</span>
            <div class="nds-form-element__control">
              <div class="nds-pill_container">
                <span class="nds-pill nds-pill_link">
                  <span class="nds-icon_container nds-icon-standard-account nds-pill__icon_container">
                    <svg class="nds-icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                    </svg>
                    <span class="nds-assistive-text">Account</span>
                  </span>
                  <a href="javascript:void(0);" class="nds-pill__action" title="Tesla Cloudhub + Anypoint Connectors">
                    <span class="nds-pill__label">Tesla Cloudhub + Anypoint Connectors</span>
                  </a>
                  <button class="nds-button nds-button_icon nds-button_icon nds-pill__remove" title="Remove">
                    <svg class="nds-button__icon" aria-hidden="true">
                      <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                    </svg>
                    <span class="nds-assistive-text">Remove</span>
                  </button>
                </span>
              </div>
            </div>
          </div>
          <div class="nds-form-element">
            <label class="nds-form-element__label" for="text-input-05">Comments</label>
            <div class="nds-form-element__control">
              <textarea class="nds-textarea" id="text-input-05">Adam was open to doing more business in the 4th quarter. Follow up with marketing demo and email templates.</textarea>
            </div>
          </div>
        </ul>
      </div>
      <div class="nds-panel__section">
        <h3 class="nds-text-heading_small nds-m-bottom_medium">Additional Information</h3>
        <ul>
          <div class="nds-form-element">
            <label class="nds-form-element__label" for="non-text-input-01">Status</label>
            <div class="nds-form-element__control">
              <div class="nds-select_container">
                <select class="nds-select" id="non-text-input-01">
                  <option>Not Started</option>
                  <option>Prospecting</option>
                </select>
              </div>
            </div>
          </div>
          <div class="nds-form-element">
            <label class="nds-form-element__label" for="non-text-input-02">Priority</label>
            <div class="nds-form-element__control">
              <div class="nds-select_container">
                <select class="nds-select" id="non-text-input-02">
                  <option>Normal</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </div>
    <div class="nds-panel__actions nds-border_top">
      <div class="nds-grid nds-grid_align-center">
        <button type="button" class="nds-button nds-button_neutral">Cancel</button>
        <button type="button" class="nds-button nds-button_brand">Save</button>
      </div>
    </div>
  </div>
</div>`);
  });
