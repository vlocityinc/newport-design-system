import "@lwc/synthetic-shadow";
import { createElement } from "lwc";
import Radiogroup from "c/radioGroup";

export default {
  title: "c/radioGroup",
  component: Radiogroup,
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
  const radiogroup = createElement("c-radioGroup", { is: Radiogroup });
  radiogroup.theme = "nds";
  radiogroup.options = [
    { label: "car", value: "car" },
    { label: "bike", value: "bike" },
    { label: "ship", value: "ship" },
  ];
  radiogroup.label = "Check out these boxes!";
  return radiogroup;
};

Default.story = {
  parameters: {
    docs: {
      storyDescription: "Checkbox description here.",
    },
  },
};
