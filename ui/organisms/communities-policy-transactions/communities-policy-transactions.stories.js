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
return withExample(`
<div class="nds-grid nds-wrap">
    <div class="nds-col nds-size_12-of-12">
        <article class="nds-m-around_small">
            <section class="nds-grid nds-grid_align-spread nds-m-bottom_medium">
                <div class="nds-col nds-text-heading_medium">Past Transactions</div>
                <div class="nds-col nds-is-relative">
                    <button type="button" label="undefined" class="nds-button nds-button_neutral">
                        <svg class="nds-button__icon nds-button__icon_left" aria-hidden="true">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/icons/utility-sprite/svg/symbols.svg#add" />
                        </svg>
                        <span>Add Transaction</span>
                    </button>
                </div>
            </section>
            <table class="nds-box nds-table_bordered nds-communities-policy-table">
                <thead>
                    <tr>
                        <th class="nds-text-title_caps nds-p-around_small">Post Date</th>
                        <th class="nds-text-title_caps nds-p-around_small">Description</th>
                        <th class="nds-text-title_caps nds-p-around_small">Type</th>
                        <th class="nds-text-title_caps nds-p-around_small">Amount</th>
                        <th class="nds-text-title_caps nds-p-around_small">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="nds-communities-policy-table-row">
                        <td class="nds-p-around_small"><div>01/06/20</div></td>
                        <td class="nds-p-around_small"><div>Payment Reversal</div></td>
                        <td class="nds-p-around_small"><div>Reversal</div></td>
                        <td class="nds-p-around_small"><div>$123</div></td>
                        <td class="nds-p-around_small"><div>Complete</div></td>
                    </tr>
                    <tr class="nds-communities-policy-table-row">
                        <td class="nds-p-around_small"><div>12/15/19</div></td>
                        <td class="nds-p-around_small"><div>Sold Policy</div></td>
                        <td class="nds-p-around_small"><div>Sold</div></td>
                        <td class="nds-p-around_small"><div>$632.30</div></td>
                        <td class="nds-p-around_small"><div>Complete</div></td>
                    </tr>
                    <tr class="nds-communities-policy-table-row">
                        <td class="nds-p-around_small"><div>10/06/19</div></td>
                        <td class="nds-p-around_small"><div>Policy Payment</div></td>
                        <td class="nds-p-around_small"><div>Payment</div></td>
                        <td class="nds-p-around_small"><div>$451.30</div></td>
                        <td class="nds-p-around_small"><div>Reversed</div></td>
                    </tr>
                </tbody>
            </table>
            <div>
                <button type="button" class="nds-button">
                    <span>Show More</span>
                </button>
            </div>
        </article>
    </div>
</div>
`);
});