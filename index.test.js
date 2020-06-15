import plugin from './index';
import pluginTester from 'babel-plugin-tester';

pluginTester({
  plugin,
  pluginName: plugin.name,
  tests: [
    {
      title: 'should throw error if options.prefix is undefined',
      code: `const ID = '@prefix/ID';`,
      error: true,
    },
    {
      title: 'should transform to Symbol()',
      pluginOptions: {
        prefix: '@prefix/',
      },
      code: `const ID = '@prefix/ID';`,
      output: `const ID = Symbol();`,
    },
    {
      title: 'should not transform to Symbol()',
      pluginOptions: {
        prefix: '@prefix/',
      },
      code: `const ID = '@prefixID';`,
      output: `const ID = '@prefixID';`,
    },
    {
      title:
        'should not transform to Symbol() because input length is less than Symbol()',
      pluginOptions: {
        prefix: '@ex/',
      },
      code: `const ID = '@ex/d';`,
      output: `const ID = '@ex/d';`,
    },
    {
      title: 'should transform to Symbol() expected only',
      pluginOptions: {
        prefix: ['@prefix/', '@prefix-2/'],
      },
      code: `
      const ID0 = '@prefix/ID';
      const ID1 = '@prefix-2/ID';
      const ID2 = Symbol('@prefix/ID');
      const ID3 = Symbol('@prefix-2/ID');
      `,
      output: `
      const ID0 = Symbol();
      const ID1 = Symbol();
      const ID2 = Symbol('@prefix/ID');
      const ID3 = Symbol('@prefix-2/ID');
      `,
    },
  ],
});
