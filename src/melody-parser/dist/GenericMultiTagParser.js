"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMultiTagParser = void 0;

var _util = require("./util");

var _GenericTagParser = require("./GenericTagParser");

var Types = _interopRequireWildcard(require("./TokenTypes"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
var tagMatchesOneOf = function tagMatchesOneOf(tokenStream, tagNames) {
  for (var i = 0; i < tagNames.length; i++) {
    if (tokenStream.test(Types.SYMBOL, tagNames[i])) {
      return true;
    }
  }

  return false;
};

var createMultiTagParser = function createMultiTagParser(tagName) {
  var subTags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return {
    name: 'genericTwigMultiTag',
    parse: function parse(parser, token) {
      var tokens = parser.tokens,
          tagStartToken = tokens.la(-1);

      if (subTags.length === 0) {
        subTags.push('end' + tagName);
      }

      var twigTag = _GenericTagParser.GenericTagParser.parse(parser, token);

      var currentTagName = tagName;
      var endTagName = subTags[subTags.length - 1];

      while (currentTagName !== endTagName) {
        // Parse next section
        twigTag.sections.push(parser.parse(function (tokenText, token, tokens) {
          var hasReachedNextTag = token.type === Types.TAG_START && tagMatchesOneOf(tokens, subTags);
          return hasReachedNextTag;
        }));
        tokens.next(); // Get past "{%"
        // Parse next tag

        var childTag = _GenericTagParser.GenericTagParser.parse(parser);

        twigTag.sections.push(childTag);
        currentTagName = childTag.tagName;
      }

      (0, _util.setStartFromToken)(twigTag, tagStartToken);
      (0, _util.setEndFromToken)(twigTag, tokens.la(0));
      return twigTag;
    }
  };
};

exports.createMultiTagParser = createMultiTagParser;