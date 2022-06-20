import { group, concat, softline, line, indent, join } from './../util/prettier-doc-builders'
import { STRING_NEEDS_QUOTES } from '../util'

export const printArrayExpression = (node, path, print) => {
  node[STRING_NEEDS_QUOTES] = true
  const mappedElements = path.map(print, 'elements')
  const indentedContent = concat([softline, join(concat([',', line]), mappedElements)])

  return group(concat(['[', indent(indentedContent), softline, ']']))
}
