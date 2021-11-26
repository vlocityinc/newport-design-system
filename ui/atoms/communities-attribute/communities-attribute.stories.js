import { storiesOf } from "@storybook/html";
import base from "paths.macro";
import { withKnobs, radios } from "@storybook/addon-knobs";
import {
withExample,
withDocs,
commentToHTML,
} from "../../../scripts/storybook";
import scss from "./base/_index.scss";
import notes from "./doc.md";

const label = "Open Sections";
const options = {
None: "",
One: "One",
Two: "Two",
Three: "Three",
};
const defaultValue = "";

storiesOf(`${base}`.replace(/(^\/)|(\/$)/g, ''), module)
.addDecorator(withKnobs)
.addDecorator(commentToHTML(scss))
.addDecorator(withDocs(notes))
.add("Default", () => {
const value = radios(label, options, defaultValue);
return withExample(`<div class="nds-p-bottom_xx-small">
    <div class="nds-grid nds-grid_align-spread nds-communities-attr">
        <div class="nds-communities-attr-label nds-size_1-of-2">
            <div>Year</div>
        </div>
        <div class="nds-size_1-of-2 nds-text-align_left">
            <div class="nds-communities-attr-label nds-communities-attr-value">2015</div>
        </div>
    </div>
</div>`);
}).add("Coverage Attribute", () => {
const value = radios(label, options, defaultValue);
return withExample(`<div class="nds-p-bottom_xx-small">
    <div
        class="nds-grid nds-grid_align-spread nds-communities-attr nds-communities-attr_coverage nds-p-bottom_small nds-m-horizontal_medium nds-p-left_xx-small">
        <div class="nds-communities-attr-label nds-size_1-of-2 nds-p-left_xxx-small">
            <div>Collision</div>
        </div>
        <div class="nds-size_1-of-2 nds-text-align_left">
            <div class="nds-communities-attr-label nds-communities-attr-value">$500 deductible</div>
        </div>
    </div>
</div>`);
});
