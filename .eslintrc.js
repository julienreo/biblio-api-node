module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "__basedir": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "indent": [
            "error",
            2,
            {
                "SwitchCase": 1
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "callback-return": [
            "error",
            [
                "callback",
                "cb",
                "next"
            ]
        ],
        "array-callback-return": "error",
        "class-methods-use-this": "error",
        "curly": "error",
        "default-case": "error",
        "default-param-last": "error",
        "eqeqeq": "error",
        "no-alert": "error",
        "no-caller": "error",
        "no-else-return": "error",
        "no-empty-function": "error",
        "no-eq-null": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-extra-label": "error",
        "no-floating-decimal": "error",
        "no-implicit-coercion": "error",
        "no-implicit-globals": "error",
        "no-implied-eval": "error",
        "no-invalid-this": "error",
        "no-iterator": "error",
        "no-lone-blocks": "error",
        "no-loop-func": "error",
        "no-magic-numbers": [
          "error",
          {
            "ignore": [0]
          }
        ],
        "no-multi-spaces": "error",
        "no-multi-str": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-wrappers": "error",
        "no-octal-escape": "error",
        "no-param-reassign": "error",
        "no-proto": "error",
        "no-return-assign": "error",
        "no-script-url": "error",
        "no-self-compare": "error",
        "no-sequences": "error",
        "no-throw-literal": "error",
        "no-unmodified-loop-condition": "error",
        "no-unused-expressions": "error",
        "no-useless-call": "error",
        "no-useless-concat": "error",
        "no-useless-return": "error",
        "no-void": "error",
        "prefer-promise-reject-errors": "error",
        "prefer-regex-literals": "error",
        "radix": "error",
        "require-await": "error",
        "require-unicode-regexp": "error",
        "vars-on-top": "error",
        "wrap-iife": "error",
        "yoda": "error",
        "accessor-pairs": "error",
        "block-scoped-var": "warn",
        "no-delete-var": "error",
        "no-label-var": "error",
        "no-restricted-globals": "error",
        "no-undef-init": "error",
        "no-undefined": "error",
        "no-use-before-define": "warn",
        "global-require": "error",
        "handle-callback-err": "error",
        "no-buffer-constructor": "error",
        "no-mixed-requires": "warn",
        "no-new-require": "error",
        "no-path-concat": "error",
        "no-process-exit": "error",
        "no-sync": "error",
        "array-bracket-spacing": "error",
        "block-spacing": "error",
        "brace-style": "error",
        "camelcase": "error",
        "capitalized-comments": [
            "error",
            "always"
        ],
        "comma-spacing": [
          "error", {
            "before": false,
            "after": true
          }
        ],
        "comma-style": [
          "error",
          "last"
        ],
        "comma-dangle": [
          "error",
          "never"
        ],
        "computed-property-spacing": [
          "error",
          "never"
        ],
        "func-call-spacing": [
          "error",
          "never"
        ],
        "implicit-arrow-linebreak": [
          "error",
          "beside"
        ],
        "jsx-quotes": [
          "error",
          "prefer-double"
        ],
        "key-spacing": [
          "error",
          {
            "beforeColon": false
          }
        ],
        "keyword-spacing": [
          "error",
          {
            "before": true
          }
        ],
        "lines-between-class-members": ["error", "always"],
        "max-len": [
          "error",
          {
            "code": 120,
            "ignoreComments": true,
            "ignoreUrls": true,
            "ignoreStrings": true,
            "ignoreTemplateLiterals": true,
            "ignoreRegExpLiterals": true
          }
        ],
        "max-statements-per-line": "error",
        "no-array-constructor": "error",
        "no-bitwise": "error",
        "no-lonely-if": "error",
        "no-mixed-operators": "error",
        "no-multi-assign": "error",
        "no-multiple-empty-lines": "error",
        "no-negated-condition": "error",
        "no-nested-ternary": "error",
        "no-new-object": "error",
        "no-trailing-spaces": "error",
        "no-unneeded-ternary": "error",
        "no-whitespace-before-property": "error",
        "nonblock-statement-body-position": [
          "error",
          "beside"
        ],
        "object-curly-spacing": [
          "error",
          "never"
        ],
        "one-var": [
          "error",
          "never"
        ],
        "operator-linebreak": [
          "error",
          "before"
        ],
        "padded-blocks": [
          "error",
          "never"
        ],
        "quote-props": [
          "error",
          "as-needed"
        ],
        "semi-spacing": "error",
        "semi-style": [
          "error",
          "last"
        ],
        "space-before-blocks": "error",
        "space-before-function-paren": [
          "error",
          {
            "anonymous": "never",
            "named": "never",
            "asyncArrow": "always"
          }
        ],
        "space-in-parens": [
          "error",
          "never"
        ],
        "space-infix-ops": "error",
        "space-unary-ops": "error",
        "spaced-comment": [
          "error",
          "always"
        ],
        "switch-colon-spacing": "error",
        "template-tag-spacing": "error",
        "arrow-spacing": "error",
        "arrow-parens": [
          "error",
          "always"
        ],
        "generator-star-spacing": [
          "error",
          {
            "before": false,
            "after": true
          }
        ],
        "no-confusing-arrow": "error",
        "no-duplicate-imports": "error",
        "no-useless-computed-key": "error",
        "no-useless-constructor": "error",
        "no-useless-rename": "error",
        "no-var": "error",
        "object-shorthand": [
          "error",
          "always"
        ],
        "prefer-arrow-callback": "error",
        "prefer-const": "error",
        "prefer-destructuring": "error",
        "prefer-numeric-literals": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        "rest-spread-spacing": [
          "error",
          "never"
        ],
        "template-curly-spacing": "error",
        "yield-star-spacing": [
          "error",
          "after"
        ]
    }
};