# eslint-plugin-guesswork

let you write better code

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-guesswork`:

```sh
npm install eslint-plugin-guesswork --save-dev
```

## Usage

Add `guesswork` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "guesswork"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "guesswork/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


