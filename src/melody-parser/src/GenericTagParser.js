"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericTagParser = undefined;

var _util = require("./util");

var _TokenTypes = require("./TokenTypes");

var Types = _interopRequireWildcard(_TokenTypes);

var _melodyTypes = require("melody-types");

var n = _interopRequireWildcard(_melodyTypes);

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
const GenericTagParser = exports.GenericTagParser = {
  name: 'genericTwigTag',

  parse(parser) {
    const tokens = parser.tokens,
          tagStartToken = tokens.la(-2);
    let currentToken;
    const twigTag = new n.GenericTwigTag(tokens.la(-1).text);

    while (currentToken = tokens.la(0)) {
      if (currentToken.type === Types.TAG_END) {
        break;
      } else {
        try {
          twigTag.parts.push(parser.matchExpression());
        } catch (e) {
          if (e.errorType === 'UNEXPECTED_TOKEN') {
            twigTag.parts.push(new n.GenericToken(e.tokenType, e.tokenText));
            tokens.next();
          } else {
            throw e;
          }
        }
      }
    }

    tokens.expect(Types.TAG_END);
    twigTag.trimLeft = (0, _util.hasTagStartTokenTrimLeft)(tagStartToken);
    twigTag.trimRight = (0, _util.hasTagEndTokenTrimRight)(currentToken);
    return twigTag;
  }

};