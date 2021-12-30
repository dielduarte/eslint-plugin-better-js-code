# eslint-plugin-better-js-code (only for study purpose)

This is just an experimental eslint plugin, to test my knowledge on AST, parsers, and eslint plugins in general.

it handles a few interesting challenges you can face when creating a plugin: 

- scope navigation (up/down the tree)
- type comparison in JS
- strict vs non strict mode

Check the tests file to understand the scenarios when the plugin would report an error.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, clone this repository and create a local link

```sh
yarn link
```

and the following command in the project you would like to test it:

```sh
 yarn link eslint-plugin-better-js-code
```

## Usage

Add `better-js-code` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "better-js-code"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "better-js-code/no-diff-variable-types": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


