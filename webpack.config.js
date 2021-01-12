/**
 * This is a main entrypoint for Webpack config.
 *
 * @since 1.0.0
 */
const path = require( 'path' );

// Paths to find our files and provide BrowserSync functionality.
const projectPaths = {
    projectDir:      __dirname, // Current project directory absolute path.
    projectUrl:      'wp-strap.lndo.site/wordpress', // Used for providing BrowserSync functionality.
    projectPath:     'wp-content/plugins/test-plugin', // Project path relative to project root.
    projectJsPath:   path.resolve( __dirname, 'assets/src/js' ),
    projectScssPath: path.resolve( __dirname, 'assets/src/scss' ),
    projectOutput:   path.resolve( __dirname, 'assets/public' ),
    projectWebpack:  path.resolve( __dirname, 'webpack' ),
};

// Javascript files to bundle
const projectFiles = {
    projectJs:  {
        babelJs:  __dirname + '/webpack/.eslintrc.js',
        eslint:   true, // enable or disable eslint  | this is only enabled in development env.
        filename: 'js/[name].js',
        entry:    {
            frontend: projectPaths.projectJsPath + '/frontend.js',
            backend:  projectPaths.projectJsPath + '/backend.js',
        },
        rules:    {
            js: {
                test: /\.m?js$/,
            }
        }
    },
    projectCss: {
        postCss:   projectPaths.projectWebpack + '/postcss.config.js',
        stylelint: true, // enable or disable stylelint | this is only enabled in development env.
        filename:  'css/[name].css',
        rules:     {
            scss: {
                test: /\.s[ac]ss$/i,
            }
        },
        purgeCss:  { // PurgeCSS is only being activated in production environment
            paths: [ // Specify content that should be analyzed by PurgeCSS
                __dirname + '/assets/src/js/**/*',
                __dirname + '/templates/**/**/*',
                __dirname + '/template-parts/**/**/*',
                __dirname + '/blocks/**/**/*',
                __dirname + '/*',
            ]
        }
    }
}

// Merging the projectFiles & projectPaths objects
const projectOptions = {
    ...projectPaths, ...projectFiles,
    projectConfig: {
        // add extra options here
    }
}

// Get the development or production setup based
// on the script from package.json
module.exports = env => {
    if ( env.NODE_ENV === 'production' ) {
        return require( './webpack/config.production' )( projectOptions );
    } else {
        return require( './webpack/config.development' )( projectOptions );
    }
};
