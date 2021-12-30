"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EOF = exports.CharStream = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

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
var EOF = Symbol();
exports.EOF = EOF;

var CharStream = /*#__PURE__*/function () {
  function CharStream(input) {
    _classCallCheck(this, CharStream);

    this.input = String(input);
    this.length = this.input.length;
    this.index = 0;
    this.position = {
      line: 1,
      column: 0
    };
  }

  _createClass(CharStream, [{
    key: "source",
    get: function get() {
      return this.input;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.rewind({
        line: 1,
        column: 0,
        index: 0
      });
    }
  }, {
    key: "mark",
    value: function mark() {
      var _this$position = this.position,
          line = _this$position.line,
          column = _this$position.column,
          index = this.index;
      return {
        line: line,
        column: column,
        index: index
      };
    }
  }, {
    key: "rewind",
    value: function rewind(marker) {
      this.position.line = marker.line;
      this.position.column = marker.column;
      this.index = marker.index;
    }
  }, {
    key: "la",
    value: function la(offset) {
      var index = this.index + offset;
      return index < this.length ? this.input.charAt(index) : EOF;
    }
  }, {
    key: "lac",
    value: function lac(offset) {
      var index = this.index + offset;
      return index < this.length ? this.input.charCodeAt(index) : EOF;
    }
  }, {
    key: "next",
    value: function next() {
      if (this.index === this.length) {
        return EOF;
      }

      var ch = this.input.charAt(this.index);
      this.index++;
      this.position.column++;

      if (ch === '\n') {
        this.position.line += 1;
        this.position.column = 0;
      }

      return ch;
    }
  }, {
    key: "match",
    value: function match(str) {
      var start = this.mark();

      for (var i = 0, len = str.length; i < len; i++) {
        var ch = this.next();

        if (ch !== str.charAt(i) || ch === EOF) {
          this.rewind(start);
          return false;
        }
      }

      return true;
    }
  }]);

  return CharStream;
}();

exports.CharStream = CharStream;