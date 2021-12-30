"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CharStream", {
  enumerable: true,
  get: function get() {
    return _CharStream.CharStream;
  }
});
Object.defineProperty(exports, "EOF", {
  enumerable: true,
  get: function get() {
    return _CharStream.EOF;
  }
});
Object.defineProperty(exports, "LEFT", {
  enumerable: true,
  get: function get() {
    return _Associativity.LEFT;
  }
});
Object.defineProperty(exports, "Lexer", {
  enumerable: true,
  get: function get() {
    return _Lexer["default"];
  }
});
Object.defineProperty(exports, "Parser", {
  enumerable: true,
  get: function get() {
    return _Parser["default"];
  }
});
Object.defineProperty(exports, "RIGHT", {
  enumerable: true,
  get: function get() {
    return _Associativity.RIGHT;
  }
});
Object.defineProperty(exports, "TokenStream", {
  enumerable: true,
  get: function get() {
    return _TokenStream["default"];
  }
});
exports.Types = void 0;
Object.defineProperty(exports, "copyEnd", {
  enumerable: true,
  get: function get() {
    return _util.copyEnd;
  }
});
Object.defineProperty(exports, "copyLoc", {
  enumerable: true,
  get: function get() {
    return _util.copyLoc;
  }
});
Object.defineProperty(exports, "copyStart", {
  enumerable: true,
  get: function get() {
    return _util.copyStart;
  }
});
exports.createExtendedLexer = createExtendedLexer;
exports.createExtendedParser = createExtendedParser;
Object.defineProperty(exports, "createNode", {
  enumerable: true,
  get: function get() {
    return _util.createNode;
  }
});
Object.defineProperty(exports, "getNodeSource", {
  enumerable: true,
  get: function get() {
    return _util.getNodeSource;
  }
});
Object.defineProperty(exports, "hasTagEndTokenTrimRight", {
  enumerable: true,
  get: function get() {
    return _util.hasTagEndTokenTrimRight;
  }
});
Object.defineProperty(exports, "hasTagStartTokenTrimLeft", {
  enumerable: true,
  get: function get() {
    return _util.hasTagStartTokenTrimLeft;
  }
});
exports.parse = parse;
Object.defineProperty(exports, "setEndFromToken", {
  enumerable: true,
  get: function get() {
    return _util.setEndFromToken;
  }
});
Object.defineProperty(exports, "setStartFromToken", {
  enumerable: true,
  get: function get() {
    return _util.setStartFromToken;
  }
});

var _Parser = _interopRequireDefault(require("./Parser"));

var _TokenStream = _interopRequireDefault(require("./TokenStream"));

var Types = _interopRequireWildcard(require("./TokenTypes"));

exports.Types = Types;

var _Lexer = _interopRequireDefault(require("./Lexer"));

var _CharStream = require("./CharStream");

var _Associativity = require("./Associativity.js");

var _util = require("./util");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
function parse(code, options) {
  for (var _len = arguments.length, extensions = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    extensions[_key - 2] = arguments[_key];
  }

  return createExtendedParser.apply(void 0, [code, options].concat(extensions)).parse();
}

function createExtendedParser(code, options) {
  var passedOptions = options;

  for (var _len2 = arguments.length, extensions = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    extensions[_key2 - 2] = arguments[_key2];
  }

  var passedExtensions = extensions;

  if ((0, _util.isMelodyExtension)(options)) {
    // Variant without options parameter: createExtendedParser(code, ...extensions)
    passedOptions = undefined;
    passedExtensions.unshift(options);
  }

  var lexer = createExtendedLexer.apply(void 0, [code, options].concat(passedExtensions));
  var parser = new _Parser["default"](new _TokenStream["default"](lexer, passedOptions), passedOptions);

  for (var _i = 0, _passedExtensions = passedExtensions; _i < _passedExtensions.length; _i++) {
    var ext = _passedExtensions[_i];
    parser.applyExtension(ext);
  }

  return parser;
}

function createExtendedLexer(code, options) {
  var passedOptions = options;

  for (var _len3 = arguments.length, extensions = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    extensions[_key3 - 2] = arguments[_key3];
  }

  var passedExtensions = extensions;

  if ((0, _util.isMelodyExtension)(options)) {
    // Variant without options parameter: createExtendedLexer(code, ...extensions)
    passedOptions = undefined;
    passedExtensions.unshift(options);
  }

  var lexer = new _Lexer["default"](new _CharStream.CharStream(code), passedOptions);

  for (var _i2 = 0, _passedExtensions2 = passedExtensions; _i2 < _passedExtensions2.length; _i2++) {
    var ext = _passedExtensions2[_i2];
    lexer.applyExtension(ext);
  }

  return lexer;
}