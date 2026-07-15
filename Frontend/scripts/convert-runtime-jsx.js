const fs = require('fs');
const path = require('path');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generate = require('@babel/generator').default;

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

function parseFile(source) {
  return parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx']
  });
}

function createJSXIdentifier(name) {
  if (name.includes('.')) {
    const parts = name.split('.');
    let node = t.jsxIdentifier(parts[0]);
    for (let i = 1; i < parts.length; i++) {
      node = t.jsxMemberExpression(node, t.jsxIdentifier(parts[i]));
    }
    return node;
  }
  return t.jsxIdentifier(name);
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
        const property = t.isIdentifier(member.property)
          ? t.jsxIdentifier(member.property.name)
          : t.jsxIdentifier(member.property.value);
        return t.jsxMemberExpression(object, property);
      }
      return t.jsxMemberExpression(convertMember(member.object), t.jsxIdentifier(member.property.name || member.property.value));
    }
    return convertMember(typeNode);
  }
  if (t.isCallExpression(typeNode)) {
    return t.jsxExpressionContainer(typeNode);
  }
  return t.jsxExpressionContainer(typeNode);
}

function convertChildren(value) {
  if (t.isArrayExpression(value)) {
    return value.elements.flatMap(elem => {
      if (!elem) return [];
      if (t.isStringLiteral(elem) || t.isNumericLiteral(elem) || t.isBooleanLiteral(elem)) {
        return t.jsxText(String(elem.value));
      }
      if (t.isJSXElement(elem) || t.isJSXFragment(elem)) {
        return [elem];
      }
      if (t.isCallExpression(elem) || t.isConditionalExpression(elem) || t.isLogicalExpression(elem) || t.isIdentifier(elem) || t.isMemberExpression(elem) || t.isSequenceExpression(elem) || t.isArrowFunctionExpression(elem) || t.isObjectExpression(elem) || t.isBinaryExpression(elem) || t.isTemplateLiteral(elem) || t.isUnaryExpression(elem)) {
        return [t.jsxExpressionContainer(elem)];
      }
      if (t.isObjectExpression(elem)) {
        return [t.jsxExpressionContainer(elem)];
      }
      return [t.jsxExpressionContainer(elem)];
    });
  }
  if (t.isStringLiteral(value) || t.isNumericLiteral(value) || t.isBooleanLiteral(value)) {
    return [t.jsxText(String(value.value))];
  }
  if (t.isNullLiteral(value)) {
    return [];
  }
  if (t.isJSXElement(value) || t.isJSXFragment(value)) {
    return [value];
  }
  return [t.jsxExpressionContainer(value)];
}

function convertProps(propsNode) {
  if (!t.isObjectExpression(propsNode)) return [];
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

function ensureJSXAttr(attributes, key, valueNode) {
  if (attributes.some(attr => t.isJSXAttribute(attr) && attr.name.name === key)) return;
  const attrName = t.jsxIdentifier(key);
  attributes.push(t.jsxAttribute(attrName, t.jsxExpressionContainer(valueNode)));
}

function convertCallExpression(path) {
  const { node } = path;
  const callee = node.callee;
  if (!t.isIdentifier(callee)) return;
  if (callee.name !== '_jsx' && callee.name !== '_jsxs' && callee.name !== '_Fragment') return;
  const args = node.arguments;
  const typeArg = args[0];
  const propsArg = args[1] && t.isObjectExpression(args[1]) ? args[1] : null;
  const keyArg = args[2];

  let jsxNode;
  if (callee.name === '_Fragment' || (t.isIdentifier(typeArg) && typeArg.name === '_Fragment')) {
    const children = propsArg ? convertChildren(propsArg.properties.find(p => t.isObjectProperty(p) && (p.key.name||p.key.value) === 'children')?.value || t.nullLiteral()) : [];
    jsxNode = t.jsxFragment(t.jsxOpeningFragment(), t.jsxClosingFragment(), children);
  } else {
    const tag = convertTag(typeArg);
    const { attributes, childrenNode } = convertProps(propsArg || t.objectExpression([]));
    const children = childrenNode ? convertChildren(childrenNode) : [];
    if (keyArg && !attributes.some(attr => t.isJSXAttribute(attr) && attr.name.name === 'key')) {
      ensureJSXAttr(attributes, 'key', keyArg);
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
    console.error('FAILED', path.relative(ROOT, file), error.message);
  }
});
console.log('Done. Files fixed:', fixed.length);
if (fixed.length === 0) process.exit(1);
