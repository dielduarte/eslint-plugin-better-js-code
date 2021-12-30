/**
 * @fileoverview do not let a variable be used with different types
 * @author 
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-diff-variable-types"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-diff-variable-types", rule, {
  valid: [
    {
      code: `var myVar = '';
        myVar = 'testing'
      `,
    },
    {
      code: `
        var a = 10;

        function sum(a, b){
          var a = '';
          {
            a = 10
            a = 11
          }
          
          a = 'new string'
          return a + b;
        }
        
        a = 0;
      `,
    },
    {
      code: `
        var testing;
        testing = [];
        testing = [];
      `,
    },
    {
      code: `
        var testing = 10;

        function func(){
          testing = 20;
        }
      `,
    },
    {
      code: `
        var testing = 10;

        function func(){
          var testing = '';
          testing = 'string'
        }
      `,
    },
  ],

  invalid: [
    {
      code: `var myVar = '';
        myVar = 10
      `,
      errors: [{ message: "variable type can't change to Number, it was defined as String first on line 1", type: "AssignmentExpression" }],
    },
    {
      code: `var myVar1; 
        myVar = 10;
        myVar = '';
      `,
      errors: [{ message: "variable type can't change to String, it was defined as Number first on line 2", type: "AssignmentExpression" }],
    },
    {
      code: `
        var a = 10;

        function sum(a, b){
          var a = '';
          return a + b;
        }
        
        a = '';
      `,
      errors: [{ message: "variable type can't change to String, it was defined as Number first on line 2", type: "AssignmentExpression" }],
    },
    {
      code: `
        var testing = 10;

        function sum(a, b){
          var a = '';
          return a + b;
        }
        
        testing = []
      `,
      errors: [{ message: "variable type can't change to Array, it was defined as Number first on line 2", type: "AssignmentExpression" }],
    },
    {
      code: `
        var testing = [];
        var a = [];

        function sum(a, b){
          var a = '';
          a = 10;
          return a + b;
        }

        testing = {};
      `,
      errors: [
        { message: "variable type can't change to Number, it was defined as String first on line 6", type: "AssignmentExpression" }, 
        { message: "variable type can't change to Object, it was defined as Array first on line 2", type: "AssignmentExpression" }
      ],
    },
    {
      code: `
        var testing;
        testing = {};
        testing = [];
      `,
      errors: [
        { message: "variable type can't change to Array, it was defined as Object first on line 3", type: "AssignmentExpression" }, 
      ],
    },
    {
      code: `
        var testing = 10;

        function func(){
          testing = 'string';
        }
      `,
      errors: [
        { message: "variable type can't change to String, it was defined as Number first on line 2", type: "AssignmentExpression" }, 
      ],
    },
    {
      code: `
        var testing = 10;

        function func(){
          var testing = 'string';
          testing = 20
        }
      `,
      errors: [
        { message: "variable type can't change to Number, it was defined as String first on line 5", type: "AssignmentExpression" }, 
      ],
    },
  ],
});
