import "@lwc/synthetic-shadow";
import { createElement } from "lwc";
import ProgressBar from "c/progressBar";

export default {
  title: "Progress Bar",
  component: ProgressBar,
  parameters: {
    componentSubtitle: "Progress Bar",
  },
};

export const Default = () => {
  const Progress = createElement("c-progress-bar", { is: ProgressBar });
  Progress.theme = "nds";
  return Progress;
};
Default.story = {
  parameters: {
    docs: {
      storyDescription: "Default ProgressBar description here.",
    },
  },
};
