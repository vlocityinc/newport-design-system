import "@lwc/synthetic-shadow";
import { createElement } from "lwc";
import Icon from "c/icon";

export default {
  title: "c/icon",
  component: Icon,
  parameters: {
    componentSubtitle:
      "Icons provide visual context and enhance usability. Looking for the icons? Go to",
    // Using storyDescription here applies one description to all stories--is overridden by story parameter storyDescription
    // docs: {
    //   storyDescription: "Buttons are clickable items used to perform an action."
    // },
  },
};

export const Default = () => {
  const icon = createElement("c-icon", { is: Icon });
  icon.iconName = "utility:add";
  icon.theme = "nds";
  return icon;
};

Default.story = {
  parameters: {
    docs: {
      storyDescription: "Neutral button description here.",
    },
  },
};
