const Either = require('data.either');

module.exports = ui => {
  const component = name =>
    Either.of(ui.get('components')).chain(cs =>
      Either.fromNullable(cs.get(name))
    );

  const components = () =>
    ui
      .get('components')
      .keySeq()
      .sort();

  const utilities = () =>
    ui
      .get('utilities')
      .keySeq()
      .sort();

  const utility = name =>
    Either.of(ui.get('utilities')).chain(u => Either.fromNullable(u.get(name)));

  // check compile/entry.js for the rest...
  return {
    ui,
    component,
    components,
    utility,
    utilities
  };
};
