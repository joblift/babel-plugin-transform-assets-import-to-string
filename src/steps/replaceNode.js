function getVariableName(node) {
    if (node.specifiers && node.specifiers[0] && node.specifiers[0].local) {
        return node.specifiers[0].local.name;
    }
}

function replaceNode(scope, baseUri, filepath, envName) {
    
    let content;
    
    if(envName) {
        const fromEnvExpression = scope.types.memberExpression(
            scope.types.memberExpression(scope.types.identifier('process'), scope.types.identifier('env'), false),
            scope.types.identifier(envName),
            false
        );
        const baseUriExpression = scope.types.parenthesizedExpression(
            scope.types.logicalExpression('||', fromEnvExpression, scope.types.StringLiteral(''))
        );
        const filepathLiteral = scope.types.StringLiteral(filepath);

        content = scope.types.binaryExpression('+', baseUriExpression, filepathLiteral);
    } else {
        content = scope.types.StringLiteral(baseUri + filepath);
    }
    

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
