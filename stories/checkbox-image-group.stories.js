import "@lwc/synthetic-shadow";
import { createElement } from "lwc";
import CheckboxImageGroup from "c/checkboxImageGroup";

// import PropTypes from 'prop-types';

export default {
  title: "c/checkboxImageGroup",
  component: "checkboxInageGroup",
  attribute: "variant",
  parameters: {
    componentSubtitle: "Checkbox Image Group description here.",
    // Using storyDescription here applies one description to all stories--is overridden by story parameter storyDescription
  },
};

export const CheckboxImageGoup = () => {
  const checkboximagegroup = createElement("c-checkbox-image-group", {
    is: CheckboxImageGroup,
  });
  checkboximagegroup.theme = "nds";
  checkboximagegroup.isDisplayCheckbox = true;
  return checkboximagegroup;
};

CheckboxImageGoup.story = {
  parameters: {
    docs: {
      storyDescription: "Checkbox Image Group description here.",
    },
  },
};
