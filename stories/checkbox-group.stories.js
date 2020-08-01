import "@lwc/synthetic-shadow";
import { createElement } from "lwc";
import CheckboxGroup from "c/checkboxGroup";

// import PropTypes from 'prop-types';

export default {
  title: "c/checkboxGroup",
  component: "checkboxGroup",
  attribute: "variant",
  parameters: {
    componentSubtitle: "Checkbox Group description.",
    // Using storyDescription here applies one description to all stories--is overridden by story parameter storyDescription
    docs: {
      storyDescription: "Checkbox Group description.",
    },
  },
};

export const Base = () => {
  const checkboxGroup = createElement("c-checkbox-group", {
    is: CheckboxGroup,
  });
  checkboxGroup.label = "My Checkbox Group";
  checkboxGroup.theme = "nds";
  checkboxGroup.options = [
    { label: "car", value: "car" },
    { label: "bike", value: "bike" },
    { label: "ship", value: "ship" },
  ];
  return checkboxGroup;
};

Base.story = {
  parameters: {
    docs: {
      storyDescription: "Checkbox Group description.",
    },
  },
};
