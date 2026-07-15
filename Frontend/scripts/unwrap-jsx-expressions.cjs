const fs = require('fs');
const path = require('path');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generate = require('@babel/generator').default;

const ROOT = path.resolve(__dirname, '..');

function parseFile(source) {
  return parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
}

function unwrapRedundantJsxContainers(ast) {
  let changed = false;

  traverse(ast, {
    JSXExpressionContainer(path) {
      if (path.parentPath.isJSXAttribute()) {
        return;
      }

      const expr = path.node.expression;
      if (t.isJSXElement(expr) || t.isJSXFragment(expr)) {
        path.replaceWith(expr);
        changed = true;
      }
    },
  });

  return changed;
}

function processFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  if (!source.includes('{<')) {
    return false;
  }

  const ast = parseFile(source);
  let modified = false;

  while (unwrapRedundantJsxContainers(ast)) {
    modified = true;
  }

  if (!modified) {
    return false;
  }

  const output = generate(ast, {
    retainLines: false,
    jsescOption: { minimal: true },
  }).code;

  fs.writeFileSync(filePath, `${output}\n`, 'utf8');
  return true;
}

const files = glob.sync('src/**/*.{js,jsx}', { cwd: ROOT, absolute: true });
const fixed = [];

files.forEach((file) => {
  try {
    if (processFile(file)) {
      fixed.push(path.relative(ROOT, file));
      console.log('Fixed', path.relative(ROOT, file));
    }
  } catch (error) {
    console.error('FAILED', path.relative(ROOT, file), error.stack || error.message);
    process.exitCode = 1;
  }
});

console.log('Done. Files fixed:', fixed.length);
