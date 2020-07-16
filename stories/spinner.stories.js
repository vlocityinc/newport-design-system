import "@lwc/synthetic-shadow";
import { createElement } from "lwc";
import Spinner from "c/spinner";

export default {
  title: "Spinner",
  component: Spinner,
  parameters: {
    componentSubtitle:
      "Spinners are CSS loading indicators that should be shown when retrieving data or performing slow computations. In some cases, the first time a parent component loads, a stencil is preferred to indicate network activity.",
  },
};

export const Base = () => {
  const spinner = createElement("c-Spinner", { is: Spinner });
  spinner.theme = "nds";
  spinner.variant = "base";
  return spinner;
};

export const Brand = () => {
  const spinner = createElement("c-Spinner", { is: Spinner });
  spinner.theme = "nds";
  spinner.variant = "brand";
  return spinner;
};

Brand.story = {
  parameters: {
    docs: {
      storyDescription: "Brand spinner description here.",
    },
  },
};

export const Inverse = () => {
  const spinner = createElement("c-Spinner", { is: Spinner });
  spinner.theme = "nds";
  spinner.variant = "inverse";
  return spinner;
};

Inverse.story = {
  parameters: {
    docs: {
      storyDescription: "Inverse spinner description here.",
    },
  },
};
