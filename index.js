module.exports = function ({ types: t }) {
  return {
    name: 'symbolize-identification-string-variable',
    visitor: {
      StringLiteral(path, state) {
        const { prefix } = state.opts || {};
        let prefixCollection = [];
        if (Array.isArray(prefix)) {
          prefixCollection = prefix;
        } else if (typeof prefix === 'string') {
          prefixCollection = [prefix];
        } else {
          throw path.buildCodeFrameError(
            'prefix is required as string or Array',
          );
        }

        const value = path.node.value;
        if (
          path.parent.type === 'VariableDeclarator' &&
          `'${value}'`.length > `Symbol()`.length &&
          prefixCollection.some((p) => value.startsWith(p))
        ) {
          // define no arguments Symbol()
          const symbolCallExpression = t.callExpression(
            t.identifier('Symbol'),
            [],
          );
          path.replaceWith(symbolCallExpression);
        }
      },
    },
  };
};
