"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.voidElements = exports.rawTextElements = exports.escapableRawTextElements = void 0;

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
// https://www.w3.org/TR/html5/syntax.html#void-elements
var voidElements = {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
};
exports.voidElements = voidElements;
var rawTextElements = {
  script: true,
  style: true
};
exports.rawTextElements = rawTextElements;
var escapableRawTextElements = {
  textarea: true,
  title: true
};
exports.escapableRawTextElements = escapableRawTextElements;