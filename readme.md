##### Wordpress Theme
- Apparel wordpress theme

### Supported Functionality Details

Ticks indicate what is currently available.

- no submodules needed by default (ideally) ✓
- plugins should have (version) tag injected into the files ✓
- the source files shouldn't be changed, however, so we should build to another area ✓
- should be able to build outside of docker ✓
- have example bitbucket pipelines files/instructions for building ✓
- should be able to build JS/CSS in plugins and themes ✓
- should support for CSS, JS, HTML, etc.
  - imagemin ✓
  - cssmin ✓
  - svgmin
  - uglify ✓
  - file versioning (hash in filename):
    - js ✓
    - css ✓
    - images (coming with webpack 5.0)
  - file versions rendered in the static HTML
    - js ✓
    - css ✓
    - images
  - watch and or live reload ✓
  - hot reload js ✓
- zip plugins/themes ✓
- lint
  - js ✓
  - php (static analysis) ✓

### Not requirements
- ~~compass~~
- ~~casper~~
- ~~phantomjs~~
- ~~bundler~~
- ~~bower~~