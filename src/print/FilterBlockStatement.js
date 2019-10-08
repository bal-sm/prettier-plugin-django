const prettier = require("prettier");
const { concat, group, line, indent, hardline } = prettier.doc.builders;
const { printChildBlock } = require("../util");

const printOpeningGroup = (node, path, print) => {
    const parts = ["{% "];
    const printedExpression = path.call(print, "filterExpression");
    parts.push(printedExpression, line, "%}");
    return group(concat(parts));
};

const p = (node, path, print) => {
    const openingGroup = printOpeningGroup(node, path, print);
    const body = printChildBlock(node, path, print, "body");
    const closingStatement = concat([hardline, "{% endfilter %}"]);

    return concat([openingGroup, body, closingStatement]);
};

module.exports = {
    printFilterBlockStatement: p
};