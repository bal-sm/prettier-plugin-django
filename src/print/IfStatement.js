import { Node } from 'melody-types'
import { EXPRESSION_NEEDED, hasNoNewlines, PRESERVE_LEADING_WHITESPACE, PRESERVE_TRAILING_WHITESPACE, printChildBlock } from '../util'
import { concat, group, hardline, indent, line } from './../util/prettier-doc-builders.js'

const IS_ELSEIF = Symbol('IS_ELSEIF')

export const printIfStatement = (node, path, print) => {
  node[EXPRESSION_NEEDED] = false
  const hasElseBranch = Array.isArray(node.alternate) && node.alternate.length > 0
  const hasElseIfBranch = Node.isIfStatement(node.alternate)
  const isElseIf = node[IS_ELSEIF] === true
  const isEmptyIf = node.consequent.length === 0
  const hasOneChild = node.consequent.length === 1
  const firstChild = node.consequent[0]
  const printInline = !isElseIf && !node.alternate && (isEmptyIf || (hasOneChild && !Node.isElement(firstChild) && (!Node.isPrintTextStatement(firstChild) || hasNoNewlines(firstChild.value.value))))

  // Preserve no-newline white space in single text node child
  if (hasOneChild && Node.isPrintTextStatement(firstChild) && hasNoNewlines(firstChild.value.value)) {
    firstChild[PRESERVE_LEADING_WHITESPACE] = true
    firstChild[PRESERVE_TRAILING_WHITESPACE] = true
  }

  const ifClause = group(concat([node.trimLeft ? '{%- ' : '{% ', isElseIf ? node.elseifText : 'if', indent(concat([line, path.call(print, 'test')])), ' ', node.trimRightIf ? '-%}' : '%}']))
  const ifBody = printInline ? (isEmptyIf ? '' : path.call(print, 'consequent', '0')) : printChildBlock(node, path, print, 'consequent')
  const parts = [ifClause, ifBody]
  if (hasElseBranch) {
    parts.push(hardline, node.trimLeftElse ? '{%-' : '{%', ' else ', node.trimRightElse ? '-%}' : '%}')
    parts.push(printChildBlock(node, path, print, 'alternate'))
  } else if (hasElseIfBranch) {
    node.alternate[IS_ELSEIF] = true
    parts.push(hardline)
    parts.push(path.call(print, 'alternate'))
  }
  // The {% endif %} will be taken care of by the "root" if statement
  if (!isElseIf) {
    parts.push(printInline ? '' : hardline, node.trimLeftEndif ? '{%-' : '{%', ' endif ', node.trimRight ? '-%}' : '%}')
  }
  return concat(parts)
}
