/**
 * @fileoverview do not let a variable be used with different types
 * @author 
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "do not let a variable be used with different types",
      category: "Fill me in",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    const variablesMap = new Map();

    let scope = [];

    /**
     * Makes a block scope.
     * @param {ASTNode} node A node of a scope.
     * @returns {void}
     */
    function enterScope(node) {
      scope.push(node.range);
    }

    /**
     * Pops the last block scope.
     * @returns {void}
     */
    function exitScope() {
      scope.pop();
    }

  /**
   * Check if a reference is out of scope
   * @param {ASTNode} reference node to examine
   * @returns {boolean} True is its outside the scope
   * @private
   */
    function isOutsideOfScope(idRange) {
      const scopeRange = scope[scope.length - 1];

      return idRange[0] < scopeRange[0] || idRange[1] > scopeRange[1];
    }

  /**
   * @param {value} any node value
   * @returns {type} the real value type
   * @private
   */
    const getType = (value) => {
      return Object.prototype.toString.call(value).slice(8, -1)
    }

    const getValue = (node, nodeField = 'init') => {
      if(typeof node[nodeField]?.value !== 'undefined')
        return node[nodeField].value;

      if(node[nodeField]?.elements)
        return []

      return node[nodeField]?.properties
       ? {}
       : undefined;
    }

    return {
      Program(node) {
        scope = [node.range];
      },

      // Manages scopes.
      BlockStatement: enterScope,
      "BlockStatement:exit": exitScope,
      ForStatement: enterScope,
      "ForStatement:exit": exitScope,
      ForInStatement: enterScope,
      "ForInStatement:exit": exitScope,
      ForOfStatement: enterScope,
      "ForOfStatement:exit": exitScope,
      SwitchStatement: enterScope,
      "SwitchStatement:exit": exitScope,
      CatchClause: enterScope,
      "CatchClause:exit": exitScope,
      StaticBlock: enterScope,
      "StaticBlock:exit": exitScope,

      VariableDeclarator(node) {
        if (node.init === null) return;
        
        const variablesByName = variablesMap.get(node.id.name) || []
        const value = getValue(node);

        variablesByName.push({
          typeOf: getType(value),
          line: node.loc.start.line,
          range: node.range
        })

        variablesMap.set(node.id.name, variablesByName);
      },
      AssignmentExpression(node) {
        const variables = variablesMap.get(node.left.name);
        const value = getValue(node, 'right');

        const pushVariable = () => {
          variablesMap.set(node.left.name, [{
            typeOf: getType(value),
            line: node.loc.start.line,
            range: node.range
          }]);
        }

        // if there is no variables with the same name in the variables map
        // it means this is the first time this variable is defining a value
        // so we just save it in the map and stop.
        if(!variables) {        
          pushVariable();

          return;
        }

        // since we have variables with the same name
        // the first thing is actually make sure
        // the variables we found previously exist in the same scope or in an upper scope.
        // so we try to find the right variable definition to compare the values type.
        // First we try to find the right variable in the current scope using !isOutsideOfScope, 
        // otherwise in the upper scope using isOutsideOfScope
        const variable = variables
          .find(variable => !isOutsideOfScope(variable.range)) 
        ?? variables
          .find(variable => isOutsideOfScope(variable.range))

        // if there is no definition in the same scope
        // then we don't need to continue but we also need to insert
        // this variable in the variables map
        // since this means this if the first time this variable got a value
        // in this scope.
        if(!variable) {
          pushVariable()

          variablesMap.set(node.left.name, variables);
          return;
        }


        const ignoredTypes = ['Undefined', 'Null']
        const valueType = getType(value) 

        //this code would handle a strict vs non strict mode
        // where updating to null or undefined would only be reported if strict mode enabled
        // if(ignoredTypes.includes(valueType) && ignoredTypes.includes(variable.typeOf))
        //   return;

        // if we have already a definition in the scope
        // then we compare the types.
        // if the types are different then we should report an error.
        if (valueType !== variable.typeOf) {
          context.report({
            node,
            message: `variable type can't change to ${valueType}, it was defined as ${variable.typeOf} first on line ${variable.line}`
          });
        }
      }
    };
  },
};
