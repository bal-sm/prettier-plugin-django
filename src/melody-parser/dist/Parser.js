"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var n = _interopRequireWildcard(require("melody-types"));

var Types = _interopRequireWildcard(require("./TokenTypes"));

var _Associativity = require("./Associativity");

var _util = require("./util");

var _GenericTagParser = require("./GenericTagParser");

var _GenericMultiTagParser = require("./GenericMultiTagParser");

var _elementInfo = require("./elementInfo");

var he = _interopRequireWildcard(require("he"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var UNARY = Symbol(),
    BINARY = Symbol(),
    TAG = Symbol(),
    TEST = Symbol();

var Parser = /*#__PURE__*/function () {
  function Parser(tokenStream, options) {
    _classCallCheck(this, Parser);

    this.tokens = tokenStream;
    this[UNARY] = {};
    this[BINARY] = {};
    this[TAG] = {};
    this[TEST] = {};
    this.options = Object.assign({}, {
      ignoreComments: true,
      ignoreHtmlComments: true,
      ignoreDeclarations: true,
      decodeEntities: true,
      preserveSourceLiterally: false,
      allowUnknownTags: false,
      multiTags: {} // e.g. { "nav": ["endnav"], "switch": ["case", "default", "endswitch"]}

    }, options); // If there are custom multi tags, then we allow all custom tags

    if (Object.keys(this.options.multiTags).length > 0) {
      this.options.allowUnknownTags = true;
    }
  }

  _createClass(Parser, [{
    key: "applyExtension",
    value: function applyExtension(ext) {
      if (ext.tags) {
        var _iterator = _createForOfIteratorHelper(ext.tags),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var tag = _step.value;
            this.addTag(tag);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      if (ext.unaryOperators) {
        var _iterator2 = _createForOfIteratorHelper(ext.unaryOperators),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var op = _step2.value;
            this.addUnaryOperator(op);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      if (ext.binaryOperators) {
        var _iterator3 = _createForOfIteratorHelper(ext.binaryOperators),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _op = _step3.value;
            this.addBinaryOperator(_op);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }

      if (ext.tests) {
        var _iterator4 = _createForOfIteratorHelper(ext.tests),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var test = _step4.value;
            this.addTest(test);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
    }
  }, {
    key: "addUnaryOperator",
    value: function addUnaryOperator(op) {
      this[UNARY][op.text] = op;
      return this;
    }
  }, {
    key: "addBinaryOperator",
    value: function addBinaryOperator(op) {
      this[BINARY][op.text] = op;
      return this;
    }
  }, {
    key: "addTag",
    value: function addTag(tag) {
      this[TAG][tag.name] = tag;
      return this;
    }
  }, {
    key: "addTest",
    value: function addTest(test) {
      this[TEST][test.text] = test;
    }
  }, {
    key: "hasTest",
    value: function hasTest(test) {
      return !!this[TEST][test];
    }
  }, {
    key: "getTest",
    value: function getTest(test) {
      return this[TEST][test];
    }
  }, {
    key: "isUnary",
    value: function isUnary(token) {
      return token.type === Types.OPERATOR && !!this[UNARY][token.text];
    }
  }, {
    key: "getBinaryOperator",
    value: function getBinaryOperator(token) {
      return token.type === Types.OPERATOR && this[BINARY][token.text];
    }
  }, {
    key: "parse",
    value: function parse() {
      var test = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var tokens = this.tokens,
          p = (0, _util.setStartFromToken)(new n.SequenceExpression(), tokens.la(0));

      while (!tokens.test(Types.EOF)) {
        var token = tokens.next();

        if (!p) {
          p = (0, _util.setStartFromToken)(new n.SequenceExpression(), token);
        }

        if (test && test(tokens.la(0).text, token, tokens)) {
          (0, _util.setEndFromToken)(p, token);
          return p;
        }

        switch (token.type) {
          case Types.EXPRESSION_START:
            {
              var expression = this.matchExpression();
              var statement = new n.PrintExpressionStatement(expression);
              var endToken = tokens.expect(Types.EXPRESSION_END);
              (0, _util.setStartFromToken)(statement, token);
              (0, _util.setEndFromToken)(statement, endToken);
              (0, _util.setEndFromToken)(p, endToken);
              statement.trimLeft = !!expression.trimLeft;
              statement.trimRight = !!expression.trimRight;
              p.add(statement);
              break;
            }

          case Types.TAG_START:
            p.add(this.matchTag());
            break;

          case Types.TEXT:
            {
              var textStringLiteral = (0, _util.createNode)(n.StringLiteral, token, token.text);
              var textTextStatement = (0, _util.createNode)(n.PrintTextStatement, token, textStringLiteral);
              p.add(textTextStatement);
              break;
            }

          case Types.ENTITY:
            {
              var entityStringLiteral = (0, _util.createNode)(n.StringLiteral, token, !this.options.decodeEntities || this.options.preserveSourceLiterally ? token.text : he.decode(token.text));
              var entityTextStatement = (0, _util.createNode)(n.PrintTextStatement, token, entityStringLiteral);
              p.add(entityTextStatement);
              break;
            }

          case Types.ELEMENT_START:
            p.add(this.matchElement());
            break;

          case Types.DECLARATION_START:
            {
              var declarationNode = this.matchDeclaration();

              if (!this.options.ignoreDeclarations) {
                p.add(declarationNode);
              }

              break;
            }

          case Types.COMMENT:
            if (!this.options.ignoreComments) {
              var stringLiteral = (0, _util.createNode)(n.StringLiteral, token, token.text);
              var twigComment = (0, _util.createNode)(n.TwigComment, token, stringLiteral);
              p.add(twigComment);
            }

            break;

          case Types.HTML_COMMENT:
            if (!this.options.ignoreHtmlComments) {
              var _stringLiteral = (0, _util.createNode)(n.StringLiteral, token, token.text);

              var htmlComment = (0, _util.createNode)(n.HtmlComment, token, _stringLiteral);
              p.add(htmlComment);
            }

            break;
        }
      }

      return p;
    }
    /**
     * e.g., <!DOCTYPE html>
     */

  }, {
    key: "matchDeclaration",
    value: function matchDeclaration() {
      var tokens = this.tokens,
          declarationStartToken = tokens.la(-1);
      var declarationType = null,
          currentToken = null;

      if (!(declarationType = tokens.nextIf(Types.SYMBOL))) {
        this.error({
          title: 'Expected declaration start',
          pos: declarationStartToken.pos,
          advice: "After '<!', an unquoted symbol like DOCTYPE is expected"
        });
      }

      var declaration = new n.Declaration(declarationType.text);

      while (currentToken = tokens.next()) {
        if (currentToken.type === Types.SYMBOL) {
          var symbol = (0, _util.createNode)(n.Identifier, currentToken, currentToken.text);
          declaration.parts.push(symbol);
        } else if (currentToken.type === Types.STRING_START) {
          var stringToken = tokens.expect(Types.STRING);
          declaration.parts.push((0, _util.createNode)(n.StringLiteral, stringToken, stringToken.text));
          tokens.expect(Types.STRING_END);
        } else if (currentToken.type === Types.EXPRESSION_START) {
          var expression = this.matchExpression();
          declaration.parts.push((0, _util.copyLoc)(new n.PrintExpressionStatement(expression), expression));
          tokens.expect(Types.EXPRESSION_END);
        } else if (currentToken.type === Types.ELEMENT_END) {
          break;
        } else {
          this.error({
            title: 'Expected string, symbol, or expression',
            pos: currentToken.pos,
            advice: 'Only strings or symbols can be part of a declaration'
          });
        }
      }

      (0, _util.setStartFromToken)(declaration, declarationStartToken);
      (0, _util.setEndFromToken)(declaration, currentToken);
      return declaration;
    }
    /**
     * matchElement = '<' SYMBOL attributes* '/'? '>' (children)* '<' '/' SYMBOL '>'
     * attributes = SYMBOL '=' (matchExpression | matchString)
     *              | matchExpression
     */

  }, {
    key: "matchElement",
    value: function matchElement() {
      var tokens = this.tokens,
          elementNameToken = tokens.la(0),
          tagStartToken = tokens.la(-1);
      var elementName;

      if (!(elementName = tokens.nextIf(Types.SYMBOL))) {
        this.error({
          title: 'Expected element start',
          pos: elementNameToken.pos,
          advice: tokens.lat(0) === Types.SLASH ? "Unexpected closing \"".concat(tokens.la(1).text, "\" tag. Seems like your DOM is out of control.") : 'Expected an element to start'
        });
      }

      var element = new n.Element(elementName.text);
      this.matchAttributes(element, tokens);

      if (tokens.nextIf(Types.SLASH)) {
        tokens.expect(Types.ELEMENT_END);
        element.selfClosing = true;
      } else {
        tokens.expect(Types.ELEMENT_END);

        if (_elementInfo.voidElements[elementName.text]) {
          element.selfClosing = true;
        } else {
          element.children = this.parse(function (_, token, tokens) {
            if (token.type === Types.ELEMENT_START && tokens.lat(0) === Types.SLASH) {
              var name = tokens.la(1);

              if (name.type === Types.SYMBOL && name.text === elementName.text) {
                tokens.next(); // SLASH

                tokens.next(); // elementName

                tokens.expect(Types.ELEMENT_END);
                return true;
              }
            }

            return false;
          }).expressions;
        }
      }

      (0, _util.setStartFromToken)(element, tagStartToken);
      (0, _util.setEndFromToken)(element, tokens.la(-1));
      (0, _util.setMarkFromToken)(element, 'elementNameLoc', elementNameToken);
      return element;
    }
  }, {
    key: "matchAttributes",
    value: function matchAttributes(element, tokens) {
      while (tokens.lat(0) !== Types.SLASH && tokens.lat(0) !== Types.ELEMENT_END) {
        var key = tokens.nextIf(Types.SYMBOL);

        if (key) {
          var keyNode = new n.Identifier(key.text);
          (0, _util.setStartFromToken)(keyNode, key);
          (0, _util.setEndFromToken)(keyNode, key); // match an attribute

          if (tokens.nextIf(Types.ASSIGNMENT)) {
            var start = tokens.expect(Types.STRING_START);
            var canBeString = true,
                nodes = [],
                token = void 0;

            while (!tokens.test(Types.STRING_END)) {
              if (canBeString && (token = tokens.nextIf(Types.STRING))) {
                nodes[nodes.length] = (0, _util.createNode)(n.StringLiteral, token, token.text);
                canBeString = false;
              } else if (token = tokens.nextIf(Types.EXPRESSION_START)) {
                nodes[nodes.length] = this.matchExpression();
                tokens.expect(Types.EXPRESSION_END);
                canBeString = true;
              } else {
                break;
              }
            }

            tokens.expect(Types.STRING_END);

            if (!nodes.length) {
              var node = (0, _util.createNode)(n.StringLiteral, start, '');
              nodes.push(node);
            }

            var expr = nodes[0];

            for (var i = 1, len = nodes.length; i < len; i++) {
              var _expr$loc$start = expr.loc.start,
                  line = _expr$loc$start.line,
                  column = _expr$loc$start.column;
              expr = new n.BinaryConcatExpression(expr, nodes[i]);
              expr.loc.start.line = line;
              expr.loc.start.column = column;
              (0, _util.copyEnd)(expr, expr.right);
            } // Distinguish between BinaryConcatExpression generated by
            // this Parser (implicit before parsing), and those that the
            // user wrote explicitly.


            if (nodes.length > 1) {
              expr.wasImplicitConcatenation = true;
            }

            var attr = new n.Attribute(keyNode, expr);
            (0, _util.copyStart)(attr, keyNode);
            (0, _util.copyEnd)(attr, expr);
            element.attributes.push(attr);
          } else {
            element.attributes.push((0, _util.copyLoc)(new n.Attribute(keyNode), keyNode));
          }
        } else if (tokens.nextIf(Types.EXPRESSION_START)) {
          element.attributes.push(this.matchExpression());
          tokens.expect(Types.EXPRESSION_END);
        } else {
          this.error({
            title: 'Invalid token',
            pos: tokens.la(0).pos,
            advice: 'A tag must consist of attributes or expressions. Twig Tags are not allowed.'
          });
        }
      }
    }
  }, {
    key: "error",
    value: function error(options) {
      var metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.tokens.error(options.title, options.pos, options.advice, 1, metadata);
    }
  }, {
    key: "getGenericParserFor",
    value: function getGenericParserFor(tagName) {
      if (this.options.multiTags[tagName]) {
        return (0, _GenericMultiTagParser.createMultiTagParser)(tagName, this.options.multiTags[tagName]);
      } else {
        return _GenericTagParser.GenericTagParser;
      }
    }
  }, {
    key: "matchTag",
    value: function matchTag() {
      var tokens = this.tokens;
      var tagStartToken = tokens.la(-1);
      var tag = tokens.expect(Types.SYMBOL);
      var parser = this[TAG][tag.text];
      var isUsingGenericParser = false;

      if (!parser) {
        if (this.options.allowUnknownTags) {
          parser = this.getGenericParserFor(tag.text);
          isUsingGenericParser = true;
        } else {
          tokens.error("Unknown tag \"".concat(tag.text, "\""), tag.pos, "Expected a known tag such as\n- ".concat(Object.getOwnPropertyNames(this[TAG]).join('\n- ')), tag.length);
        }
      }

      var result = parser.parse(this, tag);
      var tagEndToken = tokens.la(-1);

      if (!isUsingGenericParser) {
        result.trimLeft = tagStartToken.text.endsWith('-');
        result.trimRight = tagEndToken.text.startsWith('-');
      }

      (0, _util.setStartFromToken)(result, tagStartToken);
      (0, _util.setEndFromToken)(result, tagEndToken);
      (0, _util.setMarkFromToken)(result, 'tagNameLoc', tag);
      return result;
    }
  }, {
    key: "matchExpression",
    value: function matchExpression() {
      var precedence = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var tokens = this.tokens,
          exprStartToken = tokens.la(0);
      var token,
          op,
          trimLeft = false; // Check for {{- (trim preceding whitespace)

      if (tokens.la(-1).type === Types.EXPRESSION_START && tokens.la(-1).text.endsWith('-')) {
        trimLeft = true;
      }

      var expr = this.getPrimary();

      while ((token = tokens.la(0)) && token.type !== Types.EOF && (op = this.getBinaryOperator(token)) && op.precedence >= precedence) {
        var opToken = tokens.next(); // consume the operator

        if (op.parse) {
          expr = op.parse(this, opToken, expr);
        } else {
          var expr1 = this.matchExpression(op.associativity === _Associativity.LEFT ? op.precedence + 1 : op.precedence);
          expr = op.createNode(token, expr, expr1);
        }

        token = tokens.la(0);
      }

      var result = expr;

      if (precedence === 0) {
        (0, _util.setEndFromToken)(expr, tokens.la(-1));
        result = this.matchConditionalExpression(expr); // Update the local token variable because the stream pointer already advanced.

        token = tokens.la(0);
      } // Check for -}} (trim following whitespace)


      if (token.type === Types.EXPRESSION_END && token.text.startsWith('-')) {
        result.trimRight = true;
      }

      if (trimLeft) {
        result.trimLeft = trimLeft;
      }

      var exprEndToken = tokens.la(-1);
      (0, _util.setStartFromToken)(result, exprStartToken);
      (0, _util.setEndFromToken)(result, exprEndToken);
      return result;
    }
  }, {
    key: "getPrimary",
    value: function getPrimary() {
      var tokens = this.tokens,
          token = tokens.la(0);

      if (this.isUnary(token)) {
        var op = this[UNARY][token.text];
        tokens.next(); // consume operator

        var expr = this.matchExpression(op.precedence);
        return this.matchPostfixExpression(op.createNode(token, expr));
      } else if (tokens.test(Types.LPAREN)) {
        tokens.next(); // consume '('

        var _expr = this.matchExpression();

        tokens.expect(Types.RPAREN);
        return this.matchPostfixExpression(_expr);
      }

      return this.matchPrimaryExpression();
    }
  }, {
    key: "matchPrimaryExpression",
    value: function matchPrimaryExpression() {
      var tokens = this.tokens,
          token = tokens.la(0),
          node;

      switch (token.type) {
        case Types.NULL:
          node = (0, _util.createNode)(n.NullLiteral, tokens.next());
          break;

        case Types.FALSE:
          node = (0, _util.createNode)(n.BooleanLiteral, tokens.next(), false);
          break;

        case Types.TRUE:
          node = (0, _util.createNode)(n.BooleanLiteral, tokens.next(), true);
          break;

        case Types.SYMBOL:
          tokens.next();

          if (tokens.test(Types.LPAREN)) {
            // SYMBOL '(' arguments* ')'
            node = new n.CallExpression((0, _util.createNode)(n.Identifier, token, token.text), this.matchArguments());
            (0, _util.copyStart)(node, node.callee);
            (0, _util.setEndFromToken)(node, tokens.la(-1)); // ')'
          } else {
            node = (0, _util.createNode)(n.Identifier, token, token.text);
          }

          break;

        case Types.NUMBER:
          node = (0, _util.createNode)(n.NumericLiteral, token, Number(tokens.next()));
          break;

        case Types.STRING_START:
          node = this.matchStringExpression();
          break;
        // potentially missing: OPERATOR type

        default:
          if (token.type === Types.LBRACE) {
            node = this.matchArray();
          } else if (token.type === Types.LBRACKET) {
            node = this.matchMap();
          } else {
            this.error({
              title: 'Unexpected token "' + token.type + '" of value "' + token.text + '"',
              pos: token.pos
            }, {
              errorType: 'UNEXPECTED_TOKEN',
              tokenText: token.text,
              tokenType: token.type
            });
          }

          break;
      }

      return this.matchPostfixExpression(node);
    }
  }, {
    key: "matchStringExpression",
    value: function matchStringExpression() {
      var canBeString = true,
          token;
      var tokens = this.tokens,
          nodes = [],
          stringStart = tokens.expect(Types.STRING_START);

      while (!tokens.test(Types.STRING_END)) {
        if (canBeString && (token = tokens.nextIf(Types.STRING))) {
          nodes[nodes.length] = (0, _util.createNode)(n.StringLiteral, token, token.text);
          canBeString = false;
        } else if (token = tokens.nextIf(Types.INTERPOLATION_START)) {
          nodes[nodes.length] = this.matchExpression();
          tokens.expect(Types.INTERPOLATION_END);
          canBeString = true;
        } else {
          break;
        }
      }

      var stringEnd = tokens.expect(Types.STRING_END);

      if (!nodes.length) {
        return (0, _util.setEndFromToken)((0, _util.createNode)(n.StringLiteral, stringStart, ''), stringEnd);
      }

      var expr = nodes[0];

      for (var i = 1, len = nodes.length; i < len; i++) {
        var _expr$loc$start2 = expr.loc.start,
            line = _expr$loc$start2.line,
            column = _expr$loc$start2.column;
        expr = new n.BinaryConcatExpression(expr, nodes[i]);
        expr.loc.start.line = line;
        expr.loc.start.column = column;
        (0, _util.copyEnd)(expr, expr.right);
      }

      if (nodes.length > 1) {
        expr.wasImplicitConcatenation = true;
      }

      (0, _util.setStartFromToken)(expr, stringStart);
      (0, _util.setEndFromToken)(expr, stringEnd);
      return expr;
    }
  }, {
    key: "matchConditionalExpression",
    value: function matchConditionalExpression(test) {
      var tokens = this.tokens;
      var condition = test,
          consequent,
          alternate;

      while (tokens.nextIf(Types.QUESTION_MARK)) {
        if (!tokens.nextIf(Types.COLON)) {
          consequent = this.matchExpression();

          if (tokens.nextIf(Types.COLON)) {
            alternate = this.matchExpression();
          } else {
            alternate = null;
          }
        } else {
          consequent = null;
          alternate = this.matchExpression();
        }

        var _condition$loc$start = condition.loc.start,
            line = _condition$loc$start.line,
            column = _condition$loc$start.column;
        condition = new n.ConditionalExpression(condition, consequent, alternate);
        condition.loc.start = {
          line: line,
          column: column
        };
        (0, _util.copyEnd)(condition, alternate || consequent);
      }

      return condition;
    }
  }, {
    key: "matchArray",
    value: function matchArray() {
      var tokens = this.tokens,
          array = new n.ArrayExpression(),
          start = tokens.expect(Types.LBRACE);
      (0, _util.setStartFromToken)(array, start);

      while (!tokens.test(Types.RBRACE) && !tokens.test(Types.EOF)) {
        array.elements.push(this.matchExpression());

        if (!tokens.test(Types.RBRACE)) {
          tokens.expect(Types.COMMA); // support trailing commas

          if (tokens.test(Types.RBRACE)) {
            break;
          }
        }
      }

      (0, _util.setEndFromToken)(array, tokens.expect(Types.RBRACE));
      return array;
    }
  }, {
    key: "matchMap",
    value: function matchMap() {
      var tokens = this.tokens,
          token,
          obj = new n.ObjectExpression(),
          startToken = tokens.expect(Types.LBRACKET);
      (0, _util.setStartFromToken)(obj, startToken);

      while (!tokens.test(Types.RBRACKET) && !tokens.test(Types.EOF)) {
        var computed = false,
            key = void 0,
            value = void 0;

        if (tokens.test(Types.STRING_START)) {
          key = this.matchStringExpression();

          if (!n.is(key, 'StringLiteral')) {
            computed = true;
          }
        } else if (token = tokens.nextIf(Types.SYMBOL)) {
          key = (0, _util.createNode)(n.Identifier, token, token.text);
        } else if (token = tokens.nextIf(Types.NUMBER)) {
          key = (0, _util.createNode)(n.NumericLiteral, token, Number(token.text));
        } else if (tokens.test(Types.LPAREN)) {
          key = this.matchExpression();
          computed = true;
        } else {
          this.error({
            title: 'Invalid map key',
            pos: tokens.la(0).pos,
            advice: 'Key must be a string, symbol or a number but was ' + tokens.next()
          });
        }

        tokens.expect(Types.COLON);
        value = this.matchExpression();
        var prop = new n.ObjectProperty(key, value, computed);
        (0, _util.copyStart)(prop, key);
        (0, _util.copyEnd)(prop, value);
        obj.properties.push(prop);

        if (!tokens.test(Types.RBRACKET)) {
          tokens.expect(Types.COMMA); // support trailing comma

          if (tokens.test(Types.RBRACKET)) {
            break;
          }
        }
      }

      (0, _util.setEndFromToken)(obj, tokens.expect(Types.RBRACKET));
      return obj;
    }
  }, {
    key: "matchPostfixExpression",
    value: function matchPostfixExpression(expr) {
      var tokens = this.tokens;
      var node = expr;

      while (!tokens.test(Types.EOF)) {
        if (tokens.test(Types.DOT) || tokens.test(Types.LBRACE)) {
          node = this.matchSubscriptExpression(node);
        } else if (tokens.test(Types.PIPE)) {
          tokens.next();
          node = this.matchFilterExpression(node);
        } else {
          break;
        }
      }

      return node;
    }
  }, {
    key: "matchSubscriptExpression",
    value: function matchSubscriptExpression(node) {
      var tokens = this.tokens,
          op = tokens.next();

      if (op.type === Types.DOT) {
        var token = tokens.next(),
            computed = false,
            property;

        if (token.type === Types.SYMBOL) {
          property = (0, _util.createNode)(n.Identifier, token, token.text);
        } else if (token.type === Types.NUMBER) {
          property = (0, _util.createNode)(n.NumericLiteral, token, Number(token.text));
          computed = true;
        } else {
          this.error({
            title: 'Invalid token',
            pos: token.pos,
            advice: 'Expected number or symbol, found ' + token + ' instead'
          });
        }

        var memberExpr = new n.MemberExpression(node, property, computed);
        (0, _util.copyStart)(memberExpr, node);
        (0, _util.copyEnd)(memberExpr, property);

        if (tokens.test(Types.LPAREN)) {
          var callExpr = new n.CallExpression(memberExpr, this.matchArguments());
          (0, _util.copyStart)(callExpr, memberExpr);
          (0, _util.setEndFromToken)(callExpr, tokens.la(-1));
          return callExpr;
        }

        return memberExpr;
      } else {
        var arg, start;

        if (tokens.test(Types.COLON)) {
          // slice
          tokens.next();
          start = null;
        } else {
          arg = this.matchExpression();

          if (tokens.test(Types.COLON)) {
            start = arg;
            arg = null;
            tokens.next();
          }
        }

        if (arg) {
          return (0, _util.setEndFromToken)((0, _util.copyStart)(new n.MemberExpression(node, arg, true), node), tokens.expect(Types.RBRACE));
        } else {
          // slice
          var result = new n.SliceExpression(node, start, tokens.test(Types.RBRACE) ? null : this.matchExpression());
          (0, _util.copyStart)(result, node);
          (0, _util.setEndFromToken)(result, tokens.expect(Types.RBRACE));
          return result;
        }
      }
    }
  }, {
    key: "matchFilterExpression",
    value: function matchFilterExpression(node) {
      var tokens = this.tokens,
          target = node;

      while (!tokens.test(Types.EOF)) {
        var token = tokens.expect(Types.SYMBOL),
            name = (0, _util.createNode)(n.Identifier, token, token.text),
            args = void 0;

        if (tokens.test(Types.COLON)) {
          args = this.matchFilterArguments();
        } else {
          args = [];
        }

        var newTarget = new n.FilterExpression(target, name, args);
        (0, _util.copyStart)(newTarget, target);

        if (newTarget.arguments.length) {
          (0, _util.copyEnd)(newTarget, newTarget.arguments[newTarget.arguments.length - 1]);
        } else {
          (0, _util.copyEnd)(newTarget, target);
        }

        target = newTarget;

        if (!tokens.test(Types.PIPE) || tokens.test(Types.EOF)) {
          break;
        }

        tokens.next(); // consume '|'
      }

      return target;
    }
  }, {
    key: "matchArguments",
    value: function matchArguments() {
      var tokens = this.tokens,
          args = [];
      tokens.expect(Types.LPAREN);

      while (!tokens.test(Types.RPAREN) && !tokens.test(Types.EOF)) {
        if (tokens.test(Types.SYMBOL) && tokens.lat(1) === Types.ASSIGNMENT) {
          var name = tokens.next();
          tokens.next();
          var value = this.matchExpression();
          var arg = new n.NamedArgumentExpression((0, _util.createNode)(n.Identifier, name, name.text), value);
          (0, _util.copyEnd)(arg, value);
          args.push(arg);
        } else {
          args.push(this.matchExpression());
        }

        if (!tokens.test(Types.COMMA)) {
          tokens.expect(Types.RPAREN);
          return args;
        }

        tokens.expect(Types.COMMA);
      }

      tokens.expect(Types.RPAREN);
      return args;
    }
  }, {
    key: "matchFilterArguments",
    value: function matchFilterArguments() {
      var tokens = this.tokens,
          args = [];
      tokens.expect(Types.COLON);

      while (!tokens.test(Types.PIPE) && !tokens.test(Types.EXPRESSION_END) && !tokens.test(Types.TAG_END)) {
        args.push(this.matchExpression());
      }

      tokens.expect([Types.PIPE, Types.EXPRESSION_END, Types.TAG_END]);
      tokens.index--; //must back to last token

      return args;
    }
  }]);

  return Parser;
}();

exports["default"] = Parser;