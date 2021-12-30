"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WHITESPACE = exports.TRUE = exports.TEXT = exports.TAG_START = exports.TAG_END = exports.SYMBOL = exports.STRING_START = exports.STRING_END = exports.STRING = exports.SLASH = exports.RPAREN = exports.RBRACKET = exports.RBRACE = exports.QUESTION_MARK = exports.PIPE = exports.OPERATOR = exports.NUMBER = exports.NULL = exports.LPAREN = exports.LBRACKET = exports.LBRACE = exports.INTERPOLATION_START = exports.INTERPOLATION_END = exports.HTML_COMMENT = exports.FALSE = exports.EXPRESSION_START = exports.EXPRESSION_END = exports.ERROR_TABLE = exports.ERROR = exports.EOF_TOKEN = exports.EOF = exports.ENTITY = exports.ELEMENT_START = exports.ELEMENT_END = exports.DOT = exports.DECLARATION_START = exports.COMMENT = exports.COMMA = exports.COLON = exports.ASSIGNMENT = void 0;

var _ERROR_TABLE;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
var EXPRESSION_START = 'expressionStart';
exports.EXPRESSION_START = EXPRESSION_START;
var EXPRESSION_END = 'expressionEnd';
exports.EXPRESSION_END = EXPRESSION_END;
var TAG_START = 'tagStart';
exports.TAG_START = TAG_START;
var TAG_END = 'tagEnd';
exports.TAG_END = TAG_END;
var INTERPOLATION_START = 'interpolationStart';
exports.INTERPOLATION_START = INTERPOLATION_START;
var INTERPOLATION_END = 'interpolationEnd';
exports.INTERPOLATION_END = INTERPOLATION_END;
var STRING_START = 'stringStart';
exports.STRING_START = STRING_START;
var STRING_END = 'stringEnd';
exports.STRING_END = STRING_END;
var DECLARATION_START = 'declarationStart';
exports.DECLARATION_START = DECLARATION_START;
var COMMENT = 'comment';
exports.COMMENT = COMMENT;
var WHITESPACE = 'whitespace';
exports.WHITESPACE = WHITESPACE;
var HTML_COMMENT = 'htmlComment';
exports.HTML_COMMENT = HTML_COMMENT;
var TEXT = 'text';
exports.TEXT = TEXT;
var ENTITY = 'entity';
exports.ENTITY = ENTITY;
var SYMBOL = 'symbol';
exports.SYMBOL = SYMBOL;
var STRING = 'string';
exports.STRING = STRING;
var OPERATOR = 'operator';
exports.OPERATOR = OPERATOR;
var TRUE = 'true';
exports.TRUE = TRUE;
var FALSE = 'false';
exports.FALSE = FALSE;
var NULL = 'null';
exports.NULL = NULL;
var LBRACE = '[';
exports.LBRACE = LBRACE;
var RBRACE = ']';
exports.RBRACE = RBRACE;
var LPAREN = '(';
exports.LPAREN = LPAREN;
var RPAREN = ')';
exports.RPAREN = RPAREN;
var LBRACKET = '{';
exports.LBRACKET = LBRACKET;
var RBRACKET = '}';
exports.RBRACKET = RBRACKET;
var COLON = ':';
exports.COLON = COLON;
var COMMA = ',';
exports.COMMA = COMMA;
var DOT = '.';
exports.DOT = DOT;
var PIPE = '|';
exports.PIPE = PIPE;
var QUESTION_MARK = '?';
exports.QUESTION_MARK = QUESTION_MARK;
var ASSIGNMENT = '=';
exports.ASSIGNMENT = ASSIGNMENT;
var ELEMENT_START = '<';
exports.ELEMENT_START = ELEMENT_START;
var SLASH = '/';
exports.SLASH = SLASH;
var ELEMENT_END = '>';
exports.ELEMENT_END = ELEMENT_END;
var NUMBER = 'number';
exports.NUMBER = NUMBER;
var EOF = 'EOF';
exports.EOF = EOF;
var ERROR = 'ERROR';
exports.ERROR = ERROR;
var EOF_TOKEN = {
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
exports.EOF_TOKEN = EOF_TOKEN;
var ERROR_TABLE = (_ERROR_TABLE = {}, _defineProperty(_ERROR_TABLE, EXPRESSION_END, 'expression end "}}"'), _defineProperty(_ERROR_TABLE, EXPRESSION_START, 'expression start "{{"'), _defineProperty(_ERROR_TABLE, TAG_START, 'tag start "{%"'), _defineProperty(_ERROR_TABLE, TAG_END, 'tag end "%}"'), _defineProperty(_ERROR_TABLE, INTERPOLATION_START, 'interpolation start "#{"'), _defineProperty(_ERROR_TABLE, INTERPOLATION_END, 'interpolation end "}"'), _ERROR_TABLE);
exports.ERROR_TABLE = ERROR_TABLE;