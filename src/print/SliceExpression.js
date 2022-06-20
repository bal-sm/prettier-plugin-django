import { concat } from './../util/prettier-doc-builders.js'

export const printSliceExpression = (node, path, print) => {
  const printedTarget = path.call(print, 'target')
  const printedStart = node.start ? path.call(print, 'start') : ''
  const printedEnd = node.end ? path.call(print, 'end') : ''
  return concat([printedTarget, '[', printedStart, ':', printedEnd, ']'])
}
