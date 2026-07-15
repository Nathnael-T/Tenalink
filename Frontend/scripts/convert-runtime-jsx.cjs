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
    plugins: ['jsx']
  });
}

function convertTag(typeNode) {
  if (t.isStringLiteral(typeNode)) {
    return t.jsxIdentifier(typeNode.value);
  }
  if (t.isIdentifier(typeNode)) {
    return t.jsxIdentifier(typeNode.name);
  }
  if (t.isMemberExpression(typeNode)) {
    function convertMember(member) {
      if (t.isIdentifier(member.object)) {
        const object = t.jsxIdentifier(member.object.name);
        const property = t.isIdentifier(member.property) ? t.jsxIdentifier(member.property.name) : t.jsxIdentifier(member.property.value);
        return t.jsxMemberExpression(object, property);
      }
      return t.jsxMemberExpression(convertMember(member.object), t.jsxIdentifier(member.property.name || member.property.value));
    }
    return convertMember(typeNode);
  }
  return t.jsxExpressionContainer(typeNode);
}

function convertChildren(node) {
  if (!node) return [];
  if (t.isArrayExpression(node)) {
    return node.elements.flatMap(elem => {
      if (!elem) return [];
      if (t.isStringLiteral(elem) || t.isNumericLiteral(elem) || t.isBooleanLiteral(elem)) {
        return [t.jsxText(String(elem.value))];
      }
      if (t.isJSXElement(elem) || t.isJSXFragment(elem)) {
        return [elem];
      }
      return [t.jsxExpressionContainer(elem)];
    });
  }
  if (t.isStringLiteral(node) || t.isNumericLiteral(node) || t.isBooleanLiteral(node)) {
    return [t.jsxText(String(node.value))];
  }
  if (t.isJSXElement(node) || t.isJSXFragment(node)) {
    return [node];
  }
  return [t.jsxExpressionContainer(node)];
}

function convertProps(propsNode) {
  if (!t.isObjectExpression(propsNode)) {
    return { attributes: [], childrenNode: null };
  }
  const attributes = [];
  let childrenNode = null;
  propsNode.properties.forEach(prop => {
    if (t.isSpreadElement(prop)) {
      attributes.push(t.jsxSpreadAttribute(prop.argument));
      return;
    }
    const keyName = prop.key.name || prop.key.value;
    if (keyName === 'children') {
      childrenNode = prop.value;
      return;
    }
    const attrName = t.jsxIdentifier(keyName);
    if (t.isBooleanLiteral(prop.value)) {
      if (prop.value.value) {
        attributes.push(t.jsxAttribute(attrName, null));
      } else {
        attributes.push(t.jsxAttribute(attrName, t.jsxExpressionContainer(prop.value)));
      }
      return;
    }
    if (t.isStringLiteral(prop.value)) {
      attributes.push(t.jsxAttribute(attrName, t.stringLiteral(prop.value.value)));
      return;
    }
    attributes.push(t.jsxAttribute(attrName, t.jsxExpressionContainer(prop.value)));
  });
  return { attributes, childrenNode };
}

function convertCallExpression(path) {
  const { node } = path;
  const callee = node.callee;
  const args = node.arguments;
  if (!t.isIdentifier(callee)) return;
  if (!['_jsx', '_jsxs', '_Fragment'].includes(callee.name)) return;

  const typeArg = args[0];
  const propsArg = args[1] && t.isObjectExpression(args[1]) ? args[1] : null;
  const keyArg = args[2] || null;

  let jsxNode;
  if (callee.name === '_Fragment' || (t.isIdentifier(typeArg) && typeArg.name === '_Fragment')) {
    const { childrenNode } = convertProps(propsArg || t.objectExpression([]));
    const children = convertChildren(childrenNode);
    jsxNode = t.jsxFragment(t.jsxOpeningFragment(), t.jsxClosingFragment(), children);
  } else {
    const tag = convertTag(typeArg);
    const { attributes, childrenNode } = convertProps(propsArg || t.objectExpression([]));
    const children = convertChildren(childrenNode);
    if (keyArg && !attributes.some(attr => t.isJSXAttribute(attr) && attr.name.name === 'key')) {
      attributes.push(t.jsxAttribute(t.jsxIdentifier('key'), t.jsxExpressionContainer(keyArg)));
    }
    const opening = t.jsxOpeningElement(tag, attributes, children.length === 0);
    const closing = children.length === 0 ? null : t.jsxClosingElement(tag);
    jsxNode = t.jsxElement(opening, closing, children, opening.selfClosing);
  }
  path.replaceWith(jsxNode);
}

function processFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  if (!source.includes('jsx-runtime')) return false;
  const ast = parseFile(source);
  let modified = false;

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;
      if (t.isIdentifier(callee) && ['_jsx', '_jsxs', '_Fragment'].includes(callee.name)) {
        convertCallExpression(path);
        modified = true;
      }
    }
  });

  if (!modified) return false;

  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === 'react/jsx-runtime') {
        path.remove();
      }
    }
  });

  const output = generate(ast, { concise: false, jsescOption: { minimal: true } }).code;
  fs.writeFileSync(filePath, output, 'utf8');
  return true;
}

const files = glob.sync('src/**/*.{jsx,js}', { cwd: ROOT, absolute: true });
const fixed = [];
files.forEach(file => {
  try {
    if (processFile(file)) {
      fixed.push(path.relative(ROOT, file));
      console.log('Fixed', path.relative(ROOT, file));
    }
  } catch (error) {
    console.error('FAILED', path.relative(ROOT, file), error.stack || error.message);
  }
});
console.log('Done. Files fixed:', fixed.length);
if (fixed.length === 0) process.exit(1);
