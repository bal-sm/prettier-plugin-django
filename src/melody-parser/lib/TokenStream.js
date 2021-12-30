"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _TokenTypes = require("./TokenTypes");

var _trimEnd = _interopRequireDefault(require("lodash/trimEnd"));

var _trimStart = _interopRequireDefault(require("lodash/trimStart"));

var _melodyCodeFrame = _interopRequireDefault(require("melody-code-frame"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var TOKENS = Symbol(),
    LENGTH = Symbol();

var TokenStream = /*#__PURE__*/function () {
  function TokenStream(lexer, options) {
    _classCallCheck(this, TokenStream);

    this.input = lexer;
    this.index = 0;
    var mergedOptions = Object.assign({}, {
      ignoreComments: true,
      ignoreHtmlComments: true,
      ignoreWhitespace: true,
      applyWhitespaceTrimming: true
    }, options);
    this[TOKENS] = getAllTokens(lexer, mergedOptions);
    this[LENGTH] = this[TOKENS].length;

    if (this[TOKENS].length && this[TOKENS][this[TOKENS].length - 1].type === _TokenTypes.ERROR) {
      var errorToken = this[TOKENS][this[TOKENS].length - 1];
      this.error(errorToken.message, errorToken.pos, errorToken.advice, errorToken.endPos.index - errorToken.pos.index || 1);
    }
  }

  _createClass(TokenStream, [{
    key: "la",
    value: function la(offset) {
      var index = this.index + offset;
      return index < this[LENGTH] ? this[TOKENS][index] : _TokenTypes.EOF_TOKEN;
    }
  }, {
    key: "lat",
    value: function lat(offset) {
      return this.la(offset).type;
    }
  }, {
    key: "test",
    value: function test(type, text) {
      var token = this.la(0);
      return token.type === type && (!text || token.text === text);
    }
  }, {
    key: "next",
    value: function next() {
      if (this.index === this[LENGTH]) {
        return _TokenTypes.EOF_TOKEN;
      }

      var token = this[TOKENS][this.index];
      this.index++;
      return token;
    }
  }, {
    key: "nextIf",
    value: function nextIf(type, text) {
      if (this.test(type, text)) {
        return this.next();
      }

      return false;
    }
  }, {
    key: "expect",
    value: function expect(types, text) {
      var token = this.la(0);

      if (!Array.isArray(types)) {
        types = [types];
      }

      if (types.includes(token.type) && (!text || token.text === text)) {
        return this.next();
      }

      var type = types[0];
      this.error('Invalid Token', token.pos, "Expected ".concat(_TokenTypes.ERROR_TABLE[type] || type || text, " but found ").concat(_TokenTypes.ERROR_TABLE[token.type] || token.type || token.text, " instead."), token.length);
    }
  }, {
    key: "error",
    value: function error(message, pos, advice) {
      var length = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var metadata = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      var errorMessage = "ERROR: ".concat(message, "\n");
      errorMessage += (0, _melodyCodeFrame["default"])({
        rawLines: this.input.source,
        lineNumber: pos.line,
        colNumber: pos.column,
        length: length,
        tokens: getAllTokens(this.input, {
          ignoreWhitespace: false,
          ignoreComments: false,
          ignoreHtmlComments: false
        })
      });

      if (advice) {
        errorMessage += '\n\n' + advice;
      }

      var result = new Error(errorMessage);
      Object.assign(result, metadata);
      throw result;
    }
  }]);

  return TokenStream;
}();

exports["default"] = TokenStream;

function getAllTokens(lexer, options) {
  var token,
      tokens = [],
      acceptWhitespaceControl = false,
      trimNext = false;

  while ((token = lexer.next()) !== _TokenTypes.EOF_TOKEN) {
    var shouldTrimNext = trimNext;
    trimNext = false;

    if (acceptWhitespaceControl) {
      switch (token.type) {
        case _TokenTypes.EXPRESSION_START:
        case _TokenTypes.TAG_START:
          if (token.text[token.text.length - 1] === '-') {
            tokens[tokens.length - 1].text = (0, _trimEnd["default"])(tokens[tokens.length - 1].text);
          }

          break;

        case _TokenTypes.EXPRESSION_END:
        case _TokenTypes.TAG_END:
          if (token.text[0] === '-') {
            trimNext = true;
          }

          break;

        case _TokenTypes.COMMENT:
          if (tokens[tokens.length - 1].type === _TokenTypes.TEXT) {
            tokens[tokens.length - 1].text = (0, _trimEnd["default"])(tokens.text);
          }

          trimNext = true;
          break;
      }
    }

    if (shouldTrimNext && (token.type === _TokenTypes.TEXT || token.type === _TokenTypes.STRING)) {
      token.text = (0, _trimStart["default"])(token.text);
    }

    if ((token.type !== _TokenTypes.COMMENT || !options.ignoreComments) && (token.type !== _TokenTypes.WHITESPACE || !options.ignoreWhitespace) && (token.type !== _TokenTypes.HTML_COMMENT || !options.ignoreHtmlComments)) {
      tokens[tokens.length] = token;
    }

    acceptWhitespaceControl = options.applyWhitespaceTrimming;

    if (token.type === _TokenTypes.ERROR) {
      return tokens;
    }
  }

  return tokens;
}