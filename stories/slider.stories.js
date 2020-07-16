import "@lwc/synthetic-shadow";
import { createElement } from "lwc";
import Slider from "c/slider";

export default {
  title: "Slider",
  component: Slider,
  parameters: {
    componentSubtitle:
      "An input range slider lets the user specify a numeric value which must be between two specified values.",
  },
};

export const Base = () => {
  const slider = createElement("c-Slider", { is: Slider });
  slider.theme = "nds";
  return slider;
};

export const Disabled = () => {
  const slider = createElement("c-Slider", { is: Slider });
  slider.theme = "nds";
  slider.disabled = "true";
  return slider;
};

Disabled.story = {
  parameters: {
    docs: {
      storyDescription: "Disabled slider description here.",
    },
  },
};

export const Medium = () => {
  const slider = createElement("c-Slider", { is: Slider });
  slider.theme = "nds";
  slider.size = "medium";
  return slider;
};

Medium.story = {
  parameters: {
    docs: {
      storyDescription: "Medium slider description here.",
    },
  },
};

export const Small = () => {
  const slider = createElement("c-Slider", { is: Slider });
  slider.theme = "nds";
  slider.size = "small";
  return slider;
};

Small.story = {
  parameters: {
    docs: {
      storyDescription: "Small slider description here.",
    },
  },
};

export const ExtraSmall = () => {
  const slider = createElement("c-Slider", { is: Slider });
  slider.theme = "nds";
  slider.size = "xx-small";
  return slider;
};

ExtraSmall.story = {
  parameters: {
    docs: {
      storyDescription: "Extra small slider description here.",
    },
  },
};

export const WithRange = () => {
  const slider = createElement("c-Slider", { is: Slider });
  slider.theme = "nds";
  slider.min = "50";
  slider.max = "100";
  return slider;
};

WithRange.story = {
  parameters: {
    docs: {
      storyDescription: "With range slider description here.",
    },
  },
};

export const WithStep = () => {
  const slider = createElement("c-Slider", { is: Slider });
  slider.theme = "nds";
  slider.step = 10;
  return slider;
};

WithStep.story = {
  parameters: {
    docs: {
      storyDescription: "With step slider description here.",
    },
  },
};
