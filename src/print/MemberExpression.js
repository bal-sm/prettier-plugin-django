import { concat, group } from './../util/prettier-doc-builders.js'
import { EXPRESSION_NEEDED, STRING_NEEDS_QUOTES, wrapExpressionIfNeeded } from '../util'

export const printMemberExpression = (node, path, print) => {
  node[EXPRESSION_NEEDED] = false
  node[STRING_NEEDS_QUOTES] = true
  const parts = [path.call(print, 'object')]
  parts.push(node.computed ? '[' : '.')
  parts.push(path.call(print, 'property'))
  if (node.computed) {
    parts.push(']')
  }
  wrapExpressionIfNeeded(path, parts, node)
  return group(concat(parts))
}
