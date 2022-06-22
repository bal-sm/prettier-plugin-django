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
import { Types, setStartFromToken, setEndFromToken } from '../../../melody-parser/src/'
import { DoStatement } from './../types'

export const DoParser = {
  name: 'do',
  parse(parser, token) {
    const tokens = parser.tokens,
      tagStartToken = tokens.la(-2),
      doStatement = new DoStatement(parser.matchExpression())
    setStartFromToken(doStatement, token)
    setEndFromToken(doStatement, tokens.expect(Types.TAG_END, '', tagStartToken))
    return doStatement
  }
}
