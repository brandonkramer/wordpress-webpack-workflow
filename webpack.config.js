/**
 * This is a main entrypoint for Webpack config.
 *
 * @since 1.0.0
 */
const path = require( 'path' );

// Paths to find our files and provide BrowserSync functionality.
const projectPaths = {
    projectDir:      __dirname, // Current project directory absolute path.
    projectJsPath:   path.resolve( __dirname, 'assets/src/js' ),
    projectScssPath: path.resolve( __dirname, 'assets/src/scss' ),
    projectOutput:   path.resolve( __dirname, 'assets/public' ),
    projectWebpack:  path.resolve( __dirname, 'webpack' ),
    // BrowserSync settings
    browserSync: {
        enable: true, // enable or disable browserSync
        host:   'localhost',
        port: 3000,
        mode:   'proxy', // proxy | server
        server: { baseDir: [ 'public' ] }, // can be ignored if using proxy
        proxy:  'https://wp-strap.lndo.site',
        // BrowserSync will automatically watch for changes to any files connected to our entry,
        // including both JS and Sass files. We can use this property to tell BrowserSync to watch
        // for other types of files, in this case PHP files, in our project.
        files: '**/**/**.php',
        reload: true, // Set false to prevent BrowserSync from reloading and let Webpack Dev Server take care of this
        // browse to http://localhost:3000/ during development,
    }
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
