import { concat, hardline } from './../util/prettier-doc-builders'
import { printChildBlock, quoteChar } from '../util'

const createOpener = (node, options) => {
  return concat([node.trimLeft ? '{%-' : '{%', ' autoescape ', quoteChar(options), node.escapeType || 'html', quoteChar(options), ' ', node.trimRightAutoescape ? '-%}' : '%}'])
}

export const printAutoescapeBlock = (node, path, print, options) => {
  const parts = [createOpener(node, options)]
  parts.push(printChildBlock(node, path, print, 'expressions'))
  parts.push(hardline, node.trimLeftEndautoescape ? '{%-' : '{%', ' endautoescape ', node.trimRight ? '-%}' : '%}')

  return concat(parts)
}
