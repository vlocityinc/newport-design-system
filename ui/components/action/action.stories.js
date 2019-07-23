import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import {
    withExample,
    withDocs,
    commentToHTML
} from '../../../scripts/storybook';
import scss from './base/_index.scss';
import notes from './doc.md';

storiesOf(`${base}`, module)
    .addDecorator(commentToHTML(scss))
    .addDecorator(withDocs(notes))
    .add('Default', () => {
        return withExample(`<div class="nds-p-around_x-small nds-action">
    <ul>
        <li class="nds-item nds-display_inline">
            <c-navigate-action data-name="My Action">
                <slot>
                    <a role="menuitem" tabindex="0" class="nds-action_item nds-p-horizontal_small">
                        <div class="nds-action_icon nds-m-around_small">
                            <c-icon><svg aria-hidden="true" class="nds-icon nds-m-around_xxx-small slds-m-right_small nds-icon-text-default nds-icon_small" style="fill: rgb(5, 166, 223);">
                  <use
                    xlink:href="#httpsemyv93devedlightningforcecomresource1559900061000emyv93newportassetsiconsutilityspritesvgsymbolssvg_displaytext">
                  </use>
                </svg><span class="nds-assistive-text">My Action</span></c-icon>
                        </div><span class="nds-action_text">My Action</span>
                    </a>
                </slot>
            </c-navigate-action>
        </li>
    </ul>
</div>`);
    });
