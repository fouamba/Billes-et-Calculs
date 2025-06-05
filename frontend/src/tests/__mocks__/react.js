const React = {
  createElement: (...args) => ({
    $$typeof: Symbol.for('react.element'),
    type: args[0],
    props: Object.assign({}, args[1], {
      children: args.slice(2)
    }),
    ref: null
  })
};

module.exports = React;
