import "@lwc/synthetic-shadow";
import { createElement } from "lwc";
import Input from "c/input";
import { html } from "lit-html";

export default {
  title: "Input",
  component: Input,
  parameters: {
    componentSubtitle: "Text inputs are used for freeform data entry",
  },
};

export const Default = (args) => {
  const input = createElement("c-input", { is: Input });
  input.theme = "nds";
  input.label = { label };
  input.placeholder = "Placeholder Text";
  return input;
};
Default.story = {
  argTypes: {
    label: { type: ArgTypes.string, defaultValue: "initial" },
  },
  parameters: {
    docs: {
      storyDescription: "Default Input description here.",
    },
  },
  properties: {
    label: "hello text!",
  },
};

export const Required = () => {
  const input = createElement("c-input", { is: Input });
  input.theme = "nds";
  input.required = true;
  input.label = "Input required";
  input.placeholder = "Placeholder Text";
  return input;
};
Required.story = {
  parameters: {
    docs: {
      storyDescription: "Required Input description here.",
    },
  },
};

export const Disabled = () => {
  const input = createElement("c-input", { is: Input });
  input.theme = "nds";
  input.disabled = true;
  input.label = "Disabled Input";
  input.placeholder = "Placeholder Text";
  return input;
};
Disabled.story = {
  parameters: {
    docs: {
      storyDescription: "Disabled Input description here.",
    },
  },
};

export const Error = () => {
  const input = createElement("c-input", { is: Input });
  input.theme = "nds";
  input.label = "Default Input";
  input.placeholder = "Placeholder Text";
  return input;
};
Error.story = {
  parameters: {
    docs: {
      storyDescription: "Error Input description here.",
    },
  },
};

export const errorIcon = () => {
  const input = createElement("c-input", { is: Input });
  input.theme = "nds";
  input.label = "Default Input";
  input.placeholder = "Placeholder Text";
  return input;
};
errorIcon.story = {
  parameters: {
    docs: {
      storyDescription: "Error Icon Input description here.",
    },
  },
};
