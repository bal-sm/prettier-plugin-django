import { concat } from './../util/prettier-doc-builders.js'
import { STRING_NEEDS_QUOTES } from '../util'

export const printNamedArgumentExpression = (node, path, print) => {
  node[STRING_NEEDS_QUOTES] = true
  const printedName = path.call(print, 'name')
  const printedValue = path.call(print, 'value')
  return concat([printedName, ' = ', printedValue])
}
