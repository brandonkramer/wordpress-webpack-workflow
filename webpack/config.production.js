/**
 * Webpack configurations for the production environment
 * based on the script from package.json
 * Run with: "npm run prod" or or "npm run prod:watch"
 *
 * @since 1.0.0
 * @type magicImporter : Add magic import functionalities to SASS https://github.com/maoberlehner/node-sass-magic-importer
 * @type MiniCssExtractPlugin : Extracts the CSS files into public/css https://webpack.js.org/plugins/mini-css-extract-plugin/
 *
 * Only in production environment:
 * @type PurgecssPlugin : A tool to remove unused CSS https://purgecss.com/plugins/webpack.html
 */
const glob                 = require( 'glob-all' );
const magicImporter        = require( 'node-sass-magic-importer' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const PurgecssPlugin       = require( 'purgecss-webpack-plugin' )

module.exports = ( projectOptions ) => {
    // Set environment level to 'production'
    process.env.NODE_ENV = 'production';

    // CSS Rules
    const cssRules       = {
        test:    projectOptions.projectCss.rules.scss.test,
        exclude: /(node_modules|bower_components|vendor)/,
        use:     [
            MiniCssExtractPlugin.loader, // Creates `style` nodes from JS strings
            "css-loader",  // Translates CSS into CommonJS
            {  // loads the PostCSS loader
                loader:  "postcss-loader",
                options: require( projectOptions.projectCss.postCss )( projectOptions )
            },
            { // Compiles Sass to CSS
                loader:  'sass-loader',
                options: {
                    sassOptions: {
                        importer: magicImporter() // add magic import functionalities to sass
                    }
                }
            }
        ],
    };

    // JavaScript rules
    const jsRules        = {
        test:    projectOptions.projectJs.rules.js.test,
        include: projectOptions.projectJsPath,
        exclude: /(node_modules|bower_components|vendor)/,
        use:     'babel-loader' // Configurations in "webpack/babel.config.js"
    };

    // Optimization rules
    const optimizations  = {
        splitChunks: {
            cacheGroups: {
                styles: {  // Configured for PurgeCSS
                    name:    'styles',
                    test:    /\.css$/,
                    chunks:  'all',
                    enforce: true
                }
            }
        }
    };

    // Plugins
    const plugins        = [
        new MiniCssExtractPlugin( {
            filename: projectOptions.projectCss.filename
        } ),
        new PurgecssPlugin( {
            paths: glob.sync( projectOptions.projectCss.purgeCss.paths, { nodir: true } ),
        } ),
    ];

    // The configuration that's being returned to Webpack
    return {
        mode:         'production',
        entry:        projectOptions.projectJs.entry, // Define the starting point of the application.
        output:       {
            path:     projectOptions.projectOutput,
            filename: projectOptions.projectJs.filename
        },
        optimization: optimizations,
        module:       { rules: [ cssRules, jsRules, ], },
        plugins:     plugins,
    }
}