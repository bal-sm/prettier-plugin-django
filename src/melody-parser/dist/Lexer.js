"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var TokenTypes = _interopRequireWildcard(require("./TokenTypes"));

var _CharStream = require("./CharStream");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var State = {
  TEXT: 'TEXT',
  EXPRESSION: 'EXPRESSION',
  TAG: 'TAG',
  INTERPOLATION: 'INTERPOLATION',
  STRING_SINGLE: 'STRING_SINGLE',
  STRING_DOUBLE: 'STRING_DOUBLE',
  ELEMENT: 'ELEMENT',
  ATTRIBUTE_VALUE: 'ATTRIBUTE_VALUE',
  DECLARATION: 'DECLARATION'
};
var STATE = Symbol(),
    OPERATORS = Symbol(),
    STRING_START = Symbol();
var CHAR_TO_TOKEN = {
  '[': TokenTypes.LBRACE,
  ']': TokenTypes.RBRACE,
  '(': TokenTypes.LPAREN,
  ')': TokenTypes.RPAREN,
  '{': TokenTypes.LBRACKET,
  '}': TokenTypes.RBRACKET,
  ':': TokenTypes.COLON,
  '.': TokenTypes.DOT,
  '|': TokenTypes.PIPE,
  ',': TokenTypes.COMMA,
  '?': TokenTypes.QUESTION_MARK,
  '=': TokenTypes.ASSIGNMENT,
  //'<': TokenTypes.ELEMENT_START,
  //'>': TokenTypes.ELEMENT_END,
  '/': TokenTypes.SLASH
};

var Lexer = /*#__PURE__*/function () {
  function Lexer(input) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$preserveSourceLi = _ref.preserveSourceLiterally,
        preserveSourceLiterally = _ref$preserveSourceLi === void 0 ? false : _ref$preserveSourceLi;

    _classCallCheck(this, Lexer);

    this.input = input;
    this[STATE] = [State.TEXT];
    this[OPERATORS] = [];
    this[STRING_START] = null;
    this.options = {
      preserveSourceLiterally: preserveSourceLiterally === true ? true : false
    };
  }

  _createClass(Lexer, [{
    key: "applyExtension",
    value: function applyExtension(ext) {
      if (ext.unaryOperators) {
        this.addOperators.apply(this, _toConsumableArray(ext.unaryOperators.map(function (op) {
          return op.text;
        })));
      }

      if (ext.binaryOperators) {
        this.addOperators.apply(this, _toConsumableArray(ext.binaryOperators.map(function (op) {
          return op.text;
        })));
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      this.input.reset();
      this[STATE] = [State.TEXT];
    }
  }, {
    key: "source",
    get: function get() {
      return this.input.source;
    }
  }, {
    key: "addOperators",
    value: function addOperators() {
      var _this$OPERATORS;

      (_this$OPERATORS = this[OPERATORS]).push.apply(_this$OPERATORS, arguments);

      this[OPERATORS].sort(function (a, b) {
        return a.length > b.length ? -1 : 1;
      });
    }
  }, {
    key: "state",
    get: function get() {
      return this[STATE][this[STATE].length - 1];
    }
  }, {
    key: "pushState",
    value: function pushState(state) {
      this[STATE].push(state);
    }
  }, {
    key: "popState",
    value: function popState() {
      this[STATE].length--;
    }
  }, {
    key: "createToken",
    value: function createToken(type, pos) {
      var input = this.input,
          endPos = input.mark(),
          end = endPos.index;
      return {
        type: type,
        pos: pos,
        endPos: endPos,
        end: end,
        length: end - pos.index,
        source: input.input,
        text: input.input.substr(pos.index, end - pos.index),
        toString: function toString() {
          return this.text;
        }
      };
    }
  }, {
    key: "next",
    value: function next() {
      var input = this.input,
          pos,
          c;

      while ((c = input.la(0)) !== _CharStream.EOF) {
        pos = input.mark();

        if (this.state !== State.TEXT && this.state !== State.STRING_DOUBLE && this.state !== State.STRING_SINGLE && this.state !== State.ATTRIBUTE_VALUE && isWhitespace(c)) {
          input.next();

          while ((c = input.la(0)) !== _CharStream.EOF && isWhitespace(c)) {
            input.next();
          }

          return this.createToken(TokenTypes.WHITESPACE, pos);
        }

        if (c === '{' && input.la(1) === '#') {
          input.next();
          input.next();

          if (input.la(0) === '-') {
            input.next();
          }

          while ((c = input.la(0)) !== _CharStream.EOF) {
            if (c === '#' && input.la(1) === '}' || c === '-' && input.la(1) === '#' && input.la(2) === '}') {
              if (c === '-') {
                input.next();
              }

              input.next();
              input.next();
              return this.createToken(TokenTypes.COMMENT, pos);
            }

            input.next();
          }
        }

        if (this.state === State.TEXT) {
          var entityToken = void 0;

          if (c === '<') {
            if (input.la(1) === '{' || isAlpha(input.lac(1)) || input.la(1) === '/') {
              input.next();
              this.pushState(State.ELEMENT);
              return this.createToken(TokenTypes.ELEMENT_START, pos);
            } else if (input.la(1) === '!' && input.la(2) === '-' && input.la(3) === '-') {
              // match HTML comment
              input.next(); // <

              input.next(); // !

              input.next(); // -

              input.next(); // -

              while ((c = input.la(0)) !== _CharStream.EOF) {
                if (c === '-' && input.la(1) === '-') {
                  input.next();
                  input.next();

                  if (!(c = input.next()) === '>') {
                    this.error('Unexpected end for HTML comment', input.mark(), "Expected comment to end with '>' but found '".concat(c, "' instead."));
                  }

                  break;
                }

                input.next();
              }

              return this.createToken(TokenTypes.HTML_COMMENT, pos);
            } else if (input.la(1) === '!' && (isAlpha(input.lac(2)) || isWhitespace(input.la(2)))) {
              input.next();
              input.next();
              this.pushState(State.DECLARATION);
              return this.createToken(TokenTypes.DECLARATION_START, pos);
            } else {
              return this.matchText(pos);
            }
          } else if (c === '{') {
            return this.matchExpressionToken(pos);
          } else if (c === '&' && (entityToken = this.matchEntity(pos))) {
            return entityToken;
          } else {
            return this.matchText(pos);
          }
        } else if (this.state === State.EXPRESSION) {
          if (c === '}' && input.la(1) === '}' || c === '-' && input.la(1) === '}' && input.la(2) === '}') {
            if (c === '-') {
              input.next();
            }

            input.next();
            input.next();
            this.popState();
            return this.createToken(TokenTypes.EXPRESSION_END, pos);
          }

          return this.matchExpression(pos);
        } else if (this.state === State.TAG) {
          if (c === '%' && input.la(1) === '}' || c === '-' && input.la(1) === '%' && input.la(2) === '}') {
            if (c === '-') {
              input.next();
            }

            input.next();
            input.next();
            this.popState();
            return this.createToken(TokenTypes.TAG_END, pos);
          }

          return this.matchExpression(pos);
        } else if (this.state === State.STRING_SINGLE || this.state === State.STRING_DOUBLE) {
          return this.matchString(pos, true);
        } else if (this.state === State.INTERPOLATION) {
          if (c === '}') {
            input.next();
            this.popState(); // pop interpolation

            return this.createToken(TokenTypes.INTERPOLATION_END, pos);
          }

          return this.matchExpression(pos);
        } else if (this.state === State.ELEMENT) {
          switch (c) {
            case '/':
              input.next();
              return this.createToken(TokenTypes.SLASH, pos);

            case '{':
              return this.matchExpressionToken(pos);

            case '>':
              input.next();
              this.popState();
              return this.createToken(TokenTypes.ELEMENT_END, pos);

            case '"':
              input.next();
              this.pushState(State.ATTRIBUTE_VALUE);
              return this.createToken(TokenTypes.STRING_START, pos);

            case '=':
              input.next();
              return this.createToken(TokenTypes.ASSIGNMENT, pos);

            default:
              return this.matchSymbol(pos);
          }
        } else if (this.state === State.ATTRIBUTE_VALUE) {
          if (c === '"') {
            input.next();
            this.popState();
            return this.createToken(TokenTypes.STRING_END, pos);
          } else {
            return this.matchAttributeValue(pos);
          }
        } else if (this.state === State.DECLARATION) {
          switch (c) {
            case '>':
              input.next();
              this.popState();
              return this.createToken(TokenTypes.ELEMENT_END, pos);

            case '"':
              input.next();
              this.pushState(State.STRING_DOUBLE);
              return this.createToken(TokenTypes.STRING_START, pos);

            case '{':
              return this.matchExpressionToken(pos);

            default:
              return this.matchSymbol(pos);
          }
        } else {
          return this.error("Invalid state ".concat(this.state), pos);
        }
      }

      return TokenTypes.EOF_TOKEN;
    }
  }, {
    key: "matchExpressionToken",
    value: function matchExpressionToken(pos) {
      var input = this.input;

      switch (input.la(1)) {
        case '{':
          input.next();
          input.next();
          this.pushState(State.EXPRESSION);

          if (input.la(0) === '-') {
            input.next();
          }

          return this.createToken(TokenTypes.EXPRESSION_START, pos);

        case '%':
          input.next();
          input.next();
          this.pushState(State.TAG);

          if (input.la(0) === '-') {
            input.next();
          }

          return this.createToken(TokenTypes.TAG_START, pos);

        case '#':
          input.next();
          input.next();

          if (input.la(0) === '-') {
            input.next();
          }

          return this.matchComment(pos);

        default:
          return this.matchText(pos);
      }
    }
  }, {
    key: "matchExpression",
    value: function matchExpression(pos) {
      var input = this.input,
          c = input.la(0);

      switch (c) {
        case "'":
          this.pushState(State.STRING_SINGLE);
          input.next();
          return this.createToken(TokenTypes.STRING_START, pos);

        case '"':
          this.pushState(State.STRING_DOUBLE);
          input.next();
          return this.createToken(TokenTypes.STRING_START, pos);

        default:
          {
            if (isDigit(input.lac(0))) {
              input.next();
              return this.matchNumber(pos);
            }

            if (c === 't' && input.match('true') || c === 'T' && input.match('TRUE')) {
              return this.createToken(TokenTypes.TRUE, pos);
            }

            if (c === 'f' && input.match('false') || c === 'F' && input.match('FALSE')) {
              return this.createToken(TokenTypes.FALSE, pos);
            }

            if (c === 'n' && (input.match('null') || input.match('none')) || c === 'N' && (input.match('NULL') || input.match('NONE'))) {
              return this.createToken(TokenTypes.NULL, pos);
            }

            var _this$findLongestMatc = this.findLongestMatchingOperator(),
                longestMatchingOperator = _this$findLongestMatc.longestMatchingOperator,
                longestMatchEndPos = _this$findLongestMatc.longestMatchEndPos;

            var cc = input.lac(0);

            if (cc === 95
            /* _ */
            || isAlpha(cc) || isDigit(cc)) {
              // okay... this could be either a symbol or an operator
              input.next();
              var sym = this.matchSymbol(pos);

              if (sym.text.length <= longestMatchingOperator.length) {
                // the operator was longer so let's use that
                input.rewind(longestMatchEndPos);
                return this.createToken(TokenTypes.OPERATOR, pos);
              } // found a symbol


              return sym;
            } else if (longestMatchingOperator) {
              input.rewind(longestMatchEndPos);
              return this.createToken(TokenTypes.OPERATOR, pos);
            } else if (CHAR_TO_TOKEN.hasOwnProperty(c)) {
              input.next();
              return this.createToken(CHAR_TO_TOKEN[c], pos);
            } else if (c === '\xa0') {
              return this.error('Unsupported token: Non-breaking space', pos);
            } else {
              return this.error("Unknown token ".concat(c), pos);
            }
          }
      }
    }
  }, {
    key: "findLongestMatchingOperator",
    value: function findLongestMatchingOperator() {
      var input = this.input,
          start = input.mark();
      var longestMatchingOperator = '',
          longestMatchEndPos = null;

      for (var i = 0, ops = this[OPERATORS], len = ops.length; i < len; i++) {
        var op = ops[i];

        if (op.length > longestMatchingOperator.length && input.match(op)) {
          var cc = input.lac(0); // prevent mixing up operators with symbols (e.g. matching
          // 'not in' in 'not invalid').

          if (op.indexOf(' ') === -1 || !(isAlpha(cc) || isDigit(cc))) {
            longestMatchingOperator = op;
            longestMatchEndPos = input.mark();
          }

          input.rewind(start);
        }
      }

      input.rewind(start);
      return {
        longestMatchingOperator: longestMatchingOperator,
        longestMatchEndPos: longestMatchEndPos
      };
    }
  }, {
    key: "error",
    value: function error(message, pos) {
      var advice = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var errorToken = this.createToken(TokenTypes.ERROR, pos);
      errorToken.message = message;
      errorToken.advice = advice;
      return errorToken;
    }
  }, {
    key: "matchEntity",
    value: function matchEntity(pos) {
      var input = this.input;
      input.next(); // &

      if (input.la(0) === '#') {
        input.next(); // #

        if (input.la(0) === 'x') {
          // hexadecimal numeric character reference
          input.next(); // x

          var c = input.la(0);

          while ('a' <= c && c <= 'f' || 'A' <= c && c <= 'F' || isDigit(input.lac(0))) {
            input.next();
            c = input.la(0);
          }

          if (input.la(0) === ';') {
            input.next();
          } else {
            input.rewind(pos);
            return null;
          }
        } else if (isDigit(input.lac(0))) {
          // decimal numeric character reference
          // consume decimal numbers
          do {
            input.next();
          } while (isDigit(input.lac(0))); // check for final ";"


          if (input.la(0) === ';') {
            input.next();
          } else {
            input.rewind(pos);
            return null;
          }
        } else {
          input.rewind(pos);
          return null;
        }
      } else {
        // match named character reference
        while (isAlpha(input.lac(0))) {
          input.next();
        }

        if (input.la(0) === ';') {
          input.next();
        } else {
          input.rewind(pos);
          return null;
        }
      }

      return this.createToken(TokenTypes.ENTITY, pos);
    }
  }, {
    key: "matchSymbol",
    value: function matchSymbol(pos) {
      var input = this.input,
          inElement = this.state === State.ELEMENT,
          c;

      while ((c = input.lac(0)) && (c === 95 || isAlpha(c) || isDigit(c) || inElement && (c === 45 || c === 58))) {
        input.next();
      }

      var end = input.mark();

      if (pos.index === end.index) {
        return this.error('Expected an Identifier', pos, inElement ? "Expected a valid attribute name, but instead found \"".concat(input.la(0), "\", which is not part of a valid attribute name.") : "Expected letter, digit or underscore but found ".concat(input.la(0), " instead."));
      }

      return this.createToken(TokenTypes.SYMBOL, pos);
    }
  }, {
    key: "matchString",
    value: function matchString(pos) {
      var allowInterpolation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var input = this.input,
          start = this.state === State.STRING_SINGLE ? "'" : '"';
      var c; // string starts with an interpolation

      if (allowInterpolation && input.la(0) === '#' && input.la(1) === '{') {
        this.pushState(State.INTERPOLATION);
        input.next();
        input.next();
        return this.createToken(TokenTypes.INTERPOLATION_START, pos);
      }

      if (input.la(0) === start) {
        input.next();
        this.popState();
        return this.createToken(TokenTypes.STRING_END, pos);
      }

      while ((c = input.la(0)) !== start && c !== _CharStream.EOF) {
        if (c === '\\' && input.la(1) === start) {
          // escape sequence for string start
          input.next();
          input.next();
        } else if (allowInterpolation && c === '#' && input.la(1) === '{') {
          // found interpolation start, string part matched
          // next iteration will match the interpolation
          break;
        } else {
          input.next();
        }
      }

      var result = this.createToken(TokenTypes.STRING, pos); // Replace double backslash before escaped quotes

      if (!this.options.preserveSourceLiterally) {
        result.text = result.text.replace(new RegExp('(?:\\\\)(' + start + ')', 'g'), '$1');
      }

      return result;
    }
  }, {
    key: "matchAttributeValue",
    value: function matchAttributeValue(pos) {
      var input = this.input,
          start = this.state === State.STRING_SINGLE ? "'" : '"',
          c;

      if (input.la(0) === '{') {
        return this.matchExpressionToken(pos);
      }

      while ((c = input.la(0)) !== start && c !== _CharStream.EOF) {
        if (c === '\\' && input.la(1) === start) {
          input.next();
          input.next();
        } else if (c === '{') {
          // interpolation start
          break;
        } else if (c === start) {
          break;
        } else {
          input.next();
        }
      }

      var result = this.createToken(TokenTypes.STRING, pos); // Replace double backslash before escaped quotes

      if (!this.options.preserveSourceLiterally) {
        result.text = result.text.replace(new RegExp('(?:\\\\)(' + start + ')', 'g'), '$1');
      }

      return result;
    }
  }, {
    key: "matchNumber",
    value: function matchNumber(pos) {
      var input = this.input,
          c;

      while ((c = input.lac(0)) !== _CharStream.EOF) {
        if (!isDigit(c)) {
          break;
        }

        input.next();
      }

      if (input.la(0) === '.' && isDigit(input.lac(1))) {
        input.next();

        while ((c = input.lac(0)) !== _CharStream.EOF) {
          if (!isDigit(c)) {
            break;
          }

          input.next();
        }
      }

      return this.createToken(TokenTypes.NUMBER, pos);
    }
  }, {
    key: "matchText",
    value: function matchText(pos) {
      var input = this.input,
          c;

      while ((c = input.la(0)) && c !== _CharStream.EOF) {
        if (c === '{') {
          var c2 = input.la(1);

          if (c2 === '{' || c2 === '#' || c2 === '%') {
            break;
          }
        } else if (c === '<') {
          var nextChar = input.la(1);

          if (nextChar === '/' || // closing tag
          nextChar === '!' || // HTML comment
          isAlpha(input.lac(1)) // opening tag
          ) {
            break;
          } else if (input.la(1) === '{') {
            var _c = input.la(1);

            if (_c === '{' || _c === '#' || _c === '%') {
              break;
            }
          }
        }

        input.next();
      }

      return this.createToken(TokenTypes.TEXT, pos);
    }
  }, {
    key: "matchComment",
    value: function matchComment(pos) {
      var input = this.input,
          c;

      while ((c = input.next()) !== _CharStream.EOF) {
        if (c === '#' && input.la(0) === '}') {
          input.next(); // consume '}'

          break;
        }
      }

      return this.createToken(TokenTypes.COMMENT, pos);
    }
  }]);

  return Lexer;
}();

exports["default"] = Lexer;

function isWhitespace(c) {
  return c === '\n' || c === ' ' || c === '\t';
}

function isAlpha(c) {
  return 65 <= c && c <= 90 || 97 <= c && c <= 122;
}

function isDigit(c) {
  return 48 <= c && c <= 57;
}