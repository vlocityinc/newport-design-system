import "@lwc/synthetic-shadow";
import { createElement } from "lwc";
import Button from "c/button";

// import PropTypes from 'prop-types';

export default {
  title: "c/button",
  component: "c-button",
  attribute: "variant",
  parameters: {
    componentSubtitle: "Buttons are clickable items used to perform an action.",
    // Using storyDescription here applies one description to all stories--is overridden by story parameter storyDescription
    docs: {
      storyDescription:
        "Buttons are clickable items used to perform an action.",
    },
  },
};

export const Neutral = () => {
  const button = createElement("c-button", { is: Button });
  button.label = "Neutral Button";
  button.theme = "nds";
  button.variant = "neutral";
  return button;
};

Neutral.story = {
  parameters: {
    docs: {
      storyDescription: "Neutral button description here.",
    },
  },
};

export const Brand = () => {
  const button = createElement("c-button", { is: Button });
  button.label = "Brand Button";
  button.theme = "nds";
  button.variant = "brand";
  return button;
};

Brand.story = {
  parameters: {
    docs: {
      storyDescription: "Brand button description here.",
    },
  },
};

export const OutlineBrand = () => {
  const button = createElement("c-button", { is: Button });
  button.label = "Outline Brand Button";
  button.theme = "nds";
  button.variant = "outline-brand";
  return button;
};

OutlineBrand.story = {
  parameters: {
    docs: {
      storyDescription: "Outline Brand button description here.",
    },
  },
};

export const Destructive = () => {
  const button = createElement("c-button", { is: Button });
  button.label = "Destructive Button";
  button.theme = "nds";
  button.variant = "destructive";
  return button;
};

Destructive.story = {
  parameters: {
    docs: {
      storyDescription: "Destructive button description here.",
    },
  },
};

export const TextDestructive = () => {
  const button = createElement("c-button", { is: Button });
  button.label = "Text Destructive Button";
  button.theme = "nds";
  button.variant = "text-destructive";
  return button;
};

TextDestructive.story = {
  parameters: {
    docs: {
      storyDescription: "Text Destructive button description here.",
    },
  },
};

export const Success = () => {
  const button = createElement("c-button", { is: Button });
  button.label = "Success button";
  button.theme = "nds";
  button.variant = "success";
  return button;
};

Success.story = {
  parameters: {
    docs: {
      storyDescription: "Success button description here.",
    },
  },
};

export const Disabled = () => {
  const button = createElement("c-button", { is: Button });
  button.label = "Disabled button";
  button.theme = "nds";
  button.disabled = 1;
  return button;
};

Disabled.story = {
  parameters: {
    docs: {
      storyDescription: "Success button description here.",
    },
  },
};

export const Reset = () => {
  const button = createElement("c-button", { is: Button });
  button.label = "Reset button";
  button.theme = "nds";
  button.type = "reset";
  return button;
};

Reset.story = {
  parameters: {
    docs: {
      storyDescription: "Reset button description here.",
    },
  },
};

export const Submit = () => {
  const button = createElement("c-button", { is: Button });
  button.label = "Submit button";
  button.theme = "nds";
  button.type = "submit";
  return button;
};

Submit.story = {
  parameters: {
    docs: {
      storyDescription: "Submit button description here.",
    },
  },
};

export const Icon = () => {
  const button = createElement("c-button", { is: Button });
  button.label = "Icon button";
  button.theme = "nds";
  button.iconName = "utility:close";
  return button;
};

Icon.story = {
  parameters: {
    docs: {
      storyDescription: "Icon button description here.",
    },
  },
};

export const RightAlligned = () => {
  const button = createElement("c-button", { is: Button });
  button.label = "Right button";
  button.theme = "nds";
  button.iconPosition = "right";
  return button;
};

RightAlligned.story = {
  parameters: {
    docs: {
      storyDescription: "Right alligned button description here.",
    },
  },
};

// Button.propTypes = {
//   status: PropTypes.oneOf(['neutral', 'brand', 'outline brand', 'destructive', 'text destructive', 'success']),
// };

// Button.defaultProps = {
//   status: 'neutral',
// };
