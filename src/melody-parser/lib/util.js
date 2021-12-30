"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyEnd = copyEnd;
exports.copyLoc = copyLoc;
exports.copyStart = copyStart;
exports.createNode = createNode;
exports.getNodeSource = getNodeSource;
exports.hasTagEndTokenTrimRight = hasTagEndTokenTrimRight;
exports.hasTagStartTokenTrimLeft = hasTagStartTokenTrimLeft;
exports.isMelodyExtension = isMelodyExtension;
exports.setEndFromToken = setEndFromToken;
exports.setMarkFromToken = setMarkFromToken;
exports.setStartFromToken = setStartFromToken;
exports.startNode = startNode;

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function setStartFromToken(node, _ref) {
  var _ref$pos = _ref.pos,
      index = _ref$pos.index,
      line = _ref$pos.line,
      column = _ref$pos.column;
  node.loc.start = {
    line: line,
    column: column,
    index: index
  };
  return node;
}

function setEndFromToken(node, _ref2) {
  var _ref2$pos = _ref2.pos,
      line = _ref2$pos.line,
      column = _ref2$pos.column,
      end = _ref2.end;
  node.loc.end = {
    line: line,
    column: column,
    index: end
  };
  return node;
}

function setMarkFromToken(node, propertyName, _ref3) {
  var _ref3$pos = _ref3.pos,
      index = _ref3$pos.index,
      line = _ref3$pos.line,
      column = _ref3$pos.column;
  node[propertyName] = {
    line: line,
    column: column,
    index: index
  };
  return node;
}

function copyStart(node, _ref4) {
  var _ref4$loc$start = _ref4.loc.start,
      line = _ref4$loc$start.line,
      column = _ref4$loc$start.column,
      index = _ref4$loc$start.index;
  node.loc.start.line = line;
  node.loc.start.column = column;
  node.loc.start.index = index;
  return node;
}

function copyEnd(node, end) {
  node.loc.end.line = end.loc.end.line;
  node.loc.end.column = end.loc.end.column;
  node.loc.end.index = end.loc.end.index;
  return node;
}

function getNodeSource(node, entireSource) {
  if (entireSource && node.loc.start && node.loc.end) {
    return entireSource.substring(node.loc.start.index, node.loc.end.index);
  }

  return '';
}

function copyLoc(node, _ref5) {
  var _ref5$loc = _ref5.loc,
      start = _ref5$loc.start,
      end = _ref5$loc.end;
  node.loc.start.line = start.line;
  node.loc.start.column = start.column;
  node.loc.start.index = start.index;
  node.loc.end.line = end.line;
  node.loc.end.column = end.column;
  node.loc.end.index = end.index;
  return node;
}

function createNode(Type, token) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return setEndFromToken(setStartFromToken(_construct(Type, args), token), token);
}

function startNode(Type, token) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  return setStartFromToken(_construct(Type, args), token);
}

function hasTagStartTokenTrimLeft(token) {
  return token.text.endsWith('-');
}

function hasTagEndTokenTrimRight(token) {
  return token.text.startsWith('-');
}

function isMelodyExtension(obj) {
  return obj && (Array.isArray(obj.binaryOperators) || _typeof(obj.filterMap) === 'object' || _typeof(obj.functionMap) === 'object' || Array.isArray(obj.tags) || Array.isArray(obj.tests) || Array.isArray(obj.unaryOperators) || Array.isArray(obj.visitors));
}