import "@lwc/synthetic-shadow";
import { createElement } from "lwc";
import Checkbox from "c/checkboxGroup";

export default {
  title: "c/checkboxGroup",
  component: Checkbox,
  parameters: {
    componentSubtitle:
      "A checkable input that communicates if an option is true, false or indeterminate.",
    // Using storyDescription here applies one description to all stories--is overridden by story parameter storyDescription
    // docs: {
    //   storyDescription: "Buttons are clickable items used to perform an action."
    // },
  },
};

export const Default = () => {
  const checkbox = createElement("c-checkbox", { is: Checkbox });
  checkbox.theme = "nds";
  checkbox.options = [
    { label: "car", value: "car" },
    { label: "bike", value: "bike" },
    { label: "ship", value: "ship" },
  ];
  checkbox.label = "Check out these boxes!";
  return checkbox;
};

Default.story = {
  parameters: {
    docs: {
      storyDescription: "Checkbox description here.",
    },
  },
};
