const mix = require('laravel-mix')
const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const pugpigUtils = require('pugpig-mixutils-npm')

require('laravel-mix-string-replace')
require('pugpig-mixphp-npm')
require('laravel-mix-imagemin')
require('laravel-mix-eslint')
require('laravel-mix-clean')

const name = path.basename(__dirname)
const item_dist = path.join('dist', name)
const isWatching = process.argv.includes('--watch')
const isHMR = mix.config.hmr
const isLocal = mix.config.hmr || isWatching
const useGit = !isLocal && process.env.NO_GIT === undefined

if (!isHMR && !isWatching) {
  require('laravel-mix-versionhash')
  mix.versionHash({delimiter: '-'})
}

mix.setPublicPath(item_dist)
  .setResourceRoot('../')
  .disableSuccessNotifications()
  .clean({
    cleanOnceBeforeBuildPatterns: isHMR ? [] : ["**/*"],
    cleanAfterEveryBuildPatterns: ["!**/*"]
  })
  .imagemin('images/*', {context: 'src'})
  .copy('src/fonts/*', `${item_dist}/fonts`)
  .copy('src/templates/*.mustache', `${item_dist}/templates`)
  .copy('src/styles/theme.json', `${item_dist}/`) 
  .sass('src/styles/_style.scss', 'style.css')
  .sourceMaps()
  .eslint({
    fix: false,
    cache: false,
    verbose: true,
  })
  .copy('src/screenshot.png', item_dist)

  .php(useGit
      ? pugpigUtils.getVersionTag
      : function() { return '?' }
  )
  .then((stats) => {
    // nasty hack to work around (current) inability to not version the `style.css` filename
    // which Wordpress needs to be left as is
    if (!mix.config.hmr && !isWatching) {
      pugpigUtils.moveVersionedAsset(stats.compilation.assets, /style[\.\-][0-9a-fA-F]+\.css$/, 'style.css')
      pugpigUtils.makePackage(stats.compilation.outputOptions.path)
      pugpigUtils.createGitTagFile(path.join(__dirname, 'dist', 'build'))
    }
  })

  if(useGit)
    mix.stringReplace({
      test: /_style\.scss$/,
      loader: 'string-replace-loader',
      options: {
        search: 'GIT_VERSION',
        replace: pugpigUtils.getVersionTag,
      }
  })

// Handle multiple entry points for Javascript files
glob.sync('src/scripts/*.js').forEach(
  filename => mix.js(filename, 'scripts')
);

// Handle multiple entry points for SASS/SCSS files
glob.sync('src/styles/[!_]*.s[ac]ss').forEach(
  filename => mix.sass(filename, 'styles')
)

const plugins = [
  ...glob.sync('src/static/**/*.html').map((item) => {
    return new HtmlWebpackPlugin({
      filename: item.substring(4),
      template: item,
    })
  }),
]

if (!mix.config.hmr && !isWatching) {
  plugins.push(
    pugpigUtils.getPluginToFixAssetPathsForHtml()
  )
}

mix.webpackConfig({ plugins })

if (mix.config.hmr) {
  mix.browserSync({
    proxy: '0.0.0.0:8080',
    notify: false,
    files: ['**/*.sass', '**/*.html']
  })
}
