function getVariableName(node) {
    if (node.specifiers && node.specifiers[0] && node.specifiers[0].local) {
        return node.specifiers[0].local.name;
    }
}

function replaceNode(scope, baseUri, filepath, envName) {
    const filepathLiteral = scope.types.StringLiteral(filepath);
    const baseUriLiteral = scope.types.StringLiteral(baseUri);
    const fromEnvExpression = scope.types.memberExpression(
        scope.types.memberExpression(scope.types.identifier('process'), scope.types.identifier('env'), false),
        scope.types.identifier(envName),
        false
    );
    const baseUriExpression = scope.types.parenthesizedExpression(
        scope.types.logicalExpression('||', fromEnvExpression, baseUriLiteral)
    );
    const content = scope.types.binaryExpression('+', baseUriExpression, filepathLiteral);

    if (scope.callee === 'require') {
        scope.path.replaceWith(content);

        return;
    }

    const variableName = getVariableName(scope.path.node);

    if (variableName) {
        scope.path.replaceWith(
            scope.types.variableDeclaration('const', [
                scope.types.variableDeclarator(scope.types.identifier(variableName), content),
            ])
        );
    }
}

export default replaceNode;
