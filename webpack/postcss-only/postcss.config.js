/**
 * PostCSS configuration file
 * as configured under cssRules.use['postcss-loader'] in development.js and production.js
 *
 * @docs https://postcss.org/
 * @since 1.0.0
 */
module.exports = ( projectOptions ) => {
    return {
        postcssOptions: {
            plugins: [
                // This plugin can consume local files, node modules or web_modules
                // /https://github.com/postcss/postcss-import
                require( 'postcss-import' ),
                // introduces ^& selector which let you reference any parent ancestor selector with an easy and customizable interface.
                // https://github.com/toomuchdesign/postcss-nested-ancestors
                require( 'postcss-nested-ancestors' ),
                // PostCSS plugin to unwrap nested rules like how Sass does it.
                // https://github.com/postcss/postcss-nested
                require( 'postcss-nested' ),
                // To parse CSS and add vendor prefixes to CSS rules using values from Can I Use.
                // https://github.com/postcss/autoprefixer
                require( 'autoprefixer' ),
                // lets you use Sass-like variables, conditionals, and iterators in CSS.
                // https://github.com/jonathantneal/postcss-advanced-variables
                require( 'postcss-advanced-variables' )
            ]
        }
    }
}