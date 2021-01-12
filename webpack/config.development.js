/**
 * Webpack configurations for the development environment
 * based on the script from package.json
 * Run with: "npm run dev" or "npm run dev:watch"
 *
 * @since 1.0.0
 * @type magicImporter : Add magic import functionalities to SASS https://github.com/maoberlehner/node-sass-magic-importer
 * @type MiniCssExtractPlugin : Extracts the CSS files into public/css https://webpack.js.org/plugins/mini-css-extract-plugin/
 * @type BrowserSyncPlugin : Synchronising URLs, interactions and code changes across devices https://github.com/Va1/browser-sync-webpack-plugin
 * @type WebpackBar : Display elegant progress bar while building or watch https://github.com/nuxt-contrib/webpackbar
 *
 * Only in development environment:
 * @type ESLintPlugin : Find and fix problems in your JavaScript code https://eslint.org/
 * @type StylelintPlugin : Helps you avoid errors and enforce conventions in your styles https://stylelint.io/
 */
const magicImporter        = require( 'node-sass-magic-importer' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const ESLintPlugin         = require( 'eslint-webpack-plugin' );
const StylelintPlugin      = require( 'stylelint-webpack-plugin' )
const BrowserSyncPlugin    = require( 'browser-sync-webpack-plugin' )
const WebpackBar           = require( 'webpackbar' );

module.exports = ( projectOptions ) => {
    // Set environment level to 'development'
    process.env.NODE_ENV = 'development';

    // CSS Rules
    const cssRules = {
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
    const jsRules = {
        test:    projectOptions.projectJs.rules.js.test,
        include: projectOptions.projectJsPath,
        exclude: /(node_modules|bower_components|vendor)/,
        use:     'babel-loader' // Configurations in "webpack/babel.config.js"
    };

    // Optimization rules
    const optimizations = {};

    // Plugins
    const plugins = [
        new WebpackBar(
            // Uncomment this to enable profiler https://github.com/nuxt-contrib/webpackbar#options
            // { reporters: [ 'profile' ], profile: true }
        ),
        new MiniCssExtractPlugin( {
            filename: projectOptions.projectCss.filename
        } ),
    ];
    // Add browserSync to plugins if enabled
    if ( projectOptions.browserSync.enable === true ) {
        const browserSyncOptions = {
            files: projectOptions.browserSync.files,
            host: projectOptions.browserSync.host,
            port: projectOptions.browserSync.port,
        }
        if ( projectOptions.browserSync.mode === 'server' ) {
            Object.assign( browserSyncOptions, {
                server: projectOptions.browserSync.server
            } )
        } else {
            Object.assign( browserSyncOptions, {
                proxy: projectOptions.browserSync.proxy
            } )
        }
        plugins.push( new BrowserSyncPlugin( browserSyncOptions,
            { reload: projectOptions.browserSync.reload } ) )
    }
    // Add eslint to plugins if enabled
    if ( projectOptions.projectJs.eslint === true ) {
        plugins.push( new ESLintPlugin() )
    }
    // Add stylelint to plugins if enabled
    if ( projectOptions.projectJs.eslint === true ) {
        plugins.push( new StylelintPlugin() )
    }

    // The configuration that's being returned to Webpack
    return {
        mode:   'development',
        entry:  projectOptions.projectJs.entry, // Define the starting point of the application.
        output: {
            path:     projectOptions.projectOutput,
            filename: projectOptions.projectJs.filename
        },
        // A full SourceMap is emitted as a separate file ( e.g.  main.js.map )
        // It adds a reference comment to the bundle so development tools know where to find it.
        // set this to false if you don't need it as it may slow down the build process
        devtool:      'source-map',
        optimization: optimizations,
        module:       { rules: [ cssRules, jsRules, ], },
        plugins:      plugins,
    }
}