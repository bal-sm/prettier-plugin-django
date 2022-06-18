"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _TokenTypes = require("./TokenTypes");

var _trimEnd = require("lodash/trimEnd");

var _trimEnd2 = _interopRequireDefault(_trimEnd);

var _trimStart = require("lodash/trimStart");

var _trimStart2 = _interopRequireDefault(_trimStart);

var _melodyCodeFrame = require("melody-code-frame");

var _melodyCodeFrame2 = _interopRequireDefault(_melodyCodeFrame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
const TOKENS = Symbol(),
    LENGTH = Symbol();

class TokenStream {
    constructor(lexer, options) {
        this.input = lexer;
        this.index = 0;
        const mergedOptions = Object.assign({}, {
            ignoreComments: true,
            ignoreHtmlComments: true,
            ignoreWhitespace: true,
            applyWhitespaceTrimming: true
        }, options);
        this[TOKENS] = getAllTokens(lexer, mergedOptions);
        this[LENGTH] = this[TOKENS].length;

        if (this[TOKENS].length && this[TOKENS][this[TOKENS].length - 1].type === _TokenTypes.ERROR) {
            const errorToken = this[TOKENS][this[TOKENS].length - 1];
            this.error(errorToken.message, errorToken.pos, errorToken.advice, errorToken.endPos.index - errorToken.pos.index || 1);
        }
    }

    la(offset) {
        var index = this.index + offset;
        return index < this[LENGTH] ? this[TOKENS][index] : _TokenTypes.EOF_TOKEN;
    }

    lat(offset) {
        return this.la(offset).type;
    }

    test(type, text) {
        const token = this.la(0);
        return token.type === type && (!text || token.text === text);
    }

    next() {
        if (this.index === this[LENGTH]) {
            return _TokenTypes.EOF_TOKEN;
        }

        const token = this[TOKENS][this.index];
        this.index++;
        return token;
    }

    nextIf(type, text) {
        if (this.test(type, text)) {
            return this.next();
        }

        return false;
    }

    expect(types, text) {
        const token = this.la(0);

        if (!Array.isArray(types)) {
            types = [types];
        }

        if (types.includes(token.type) && (!text || token.text === text)) {
            return this.next();
        }

        var type = types[0];
        this.error('Invalid Token', token.pos, `Expected ${_TokenTypes.ERROR_TABLE[type] || type || text} but found ${_TokenTypes.ERROR_TABLE[token.type] || token.type || token.text} instead.`, token.length);
    }

    error(message, pos, advice, length = 1, metadata = {}) {
        let errorMessage = `ERROR: ${message}. `;
        if (advice) {
            errorMessage += advice;
        }
        let diagnosticMsg = errorMessage;
        errorMessage += "\n" + (0, _melodyCodeFrame2.default)({
            rawLines: this.input.source,
            lineNumber: pos.line,
            colNumber: pos.column,
            length,
            tokens: getAllTokens(this.input, {
                ignoreWhitespace: false,
                ignoreComments: false,
                ignoreHtmlComments: false
            })
        });

        const result = new Error(errorMessage);
        Object.assign(result, metadata);
        console.error(result);
        result.stack = {
            msg: diagnosticMsg,
            line: pos.line,
            column: pos.column
        };
        throw result;
    }

}

module.exports = TokenStream;

function getAllTokens(lexer, options) {
    let token,
        tokens = [],
        acceptWhitespaceControl = false,
        trimNext = false;

    while ((token = lexer.next()) !== _TokenTypes.EOF_TOKEN) {
        const shouldTrimNext = trimNext;
        trimNext = false;

        if (acceptWhitespaceControl) {
            switch (token.type) {
                case _TokenTypes.EXPRESSION_START:
                case _TokenTypes.TAG_START:
                    if (token.text[token.text.length - 1] === '-') {
                        tokens[tokens.length - 1].text = (0, _trimEnd2.default)(tokens[tokens.length - 1].text);
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
                        tokens[tokens.length - 1].text = (0, _trimEnd2.default)(tokens.text);
                    }

                    trimNext = true;
                    break;
            }
        }

        if (shouldTrimNext && (token.type === _TokenTypes.TEXT || token.type === _TokenTypes.STRING)) {
            token.text = (0, _trimStart2.default)(token.text);
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