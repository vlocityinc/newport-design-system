import "@lwc/synthetic-shadow";
import { createElement } from "lwc";
import Combobox from "c/combobox";

export default {
  title: "c/combobox",
  component: Combobox,
  parameters: {
    componentSubtitle:
      "A widget that provides a user with an input field that is either an autocomplete or readonly, accompanied by a listbox of options.",
    // Using storyDescription here applies one description to all stories--is overridden by story parameter storyDescription
    // docs: {
    //   storyDescription: "Buttons are clickable items used to perform an action."
    // },
  },
};

export const Default = () => {
  const combobox = createElement("c-combobox", { is: Combobox });
  combobox.theme = "nds";
  combobox.label = "My Combobox";
  combobox.name = "name";
  combobox.placeholder = "Type here";
  combobox.options =
    '[{"label":"Apple","value":"apple"},{"label":"Orange","value":"orange"},{"label":"Mango","value":"mango"}]';
  combobox.value = "value 1";
  return combobox;
};

Default.story = {
  parameters: {
    docs: {
      storyDescription: "Combobox description here.",
    },
  },
};

export const Required = () => {
  const combobox = createElement("c-combobox", { is: Combobox });
  combobox.theme = "nds";
  combobox.label = "My Combobox";
  combobox.name = "name";
  combobox.placeholder = "Type here";
  combobox.options =
    '[{"label":"Apple","value":"apple"},{"label":"Orange","value":"orange"},{"label":"Mango","value":"mango"}]';
  combobox.value = "value 1";
  combobox.required = "true";
  return combobox;
};

Required.story = {
  parameters: {
    docs: {
      storyDescription: "Required combobox description here.",
    },
  },
};
