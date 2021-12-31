"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
const EXPRESSION_START = exports.EXPRESSION_START = 'expressionStart';
const EXPRESSION_END = exports.EXPRESSION_END = 'expressionEnd';
const TAG_START = exports.TAG_START = 'tagStart';
const TAG_END = exports.TAG_END = 'tagEnd';
const INTERPOLATION_START = exports.INTERPOLATION_START = 'interpolationStart';
const INTERPOLATION_END = exports.INTERPOLATION_END = 'interpolationEnd';
const STRING_START = exports.STRING_START = 'stringStart';
const STRING_END = exports.STRING_END = 'stringEnd';
const DECLARATION_START = exports.DECLARATION_START = 'declarationStart';
const COMMENT = exports.COMMENT = 'comment';
const WHITESPACE = exports.WHITESPACE = 'whitespace';
const HTML_COMMENT = exports.HTML_COMMENT = 'htmlComment';
const TEXT = exports.TEXT = 'text';
const ENTITY = exports.ENTITY = 'entity';
const SYMBOL = exports.SYMBOL = 'symbol';
const STRING = exports.STRING = 'string';
const OPERATOR = exports.OPERATOR = 'operator';
const TRUE = exports.TRUE = 'true';
const FALSE = exports.FALSE = 'false';
const NULL = exports.NULL = 'null';
const LBRACE = exports.LBRACE = '[';
const RBRACE = exports.RBRACE = ']';
const LPAREN = exports.LPAREN = '(';
const RPAREN = exports.RPAREN = ')';
const LBRACKET = exports.LBRACKET = '{';
const RBRACKET = exports.RBRACKET = '}';
const COLON = exports.COLON = ':';
const COMMA = exports.COMMA = ',';
const DOT = exports.DOT = '.';
const PIPE = exports.PIPE = '|';
const QUESTION_MARK = exports.QUESTION_MARK = '?';
const ASSIGNMENT = exports.ASSIGNMENT = '=';
const ELEMENT_START = exports.ELEMENT_START = '<';
const SLASH = exports.SLASH = '/';
const ELEMENT_END = exports.ELEMENT_END = '>';
const NUMBER = exports.NUMBER = 'number';
const EOF = exports.EOF = 'EOF';
const ERROR = exports.ERROR = 'ERROR';
const EOF_TOKEN = exports.EOF_TOKEN = {
  type: EOF,
  pos: {
    index: -1,
    line: -1,
    pos: -1
  },
  end: -1,
  length: 0,
  source: null,
  text: ''
};
const ERROR_TABLE = exports.ERROR_TABLE = {
  [EXPRESSION_END]: 'expression end "}}"',
  [EXPRESSION_START]: 'expression start "{{"',
  [TAG_START]: 'tag start "{%"',
  [TAG_END]: 'tag end "%}"',
  [INTERPOLATION_START]: 'interpolation start "#{"',
  [INTERPOLATION_END]: 'interpolation end "}"'
};