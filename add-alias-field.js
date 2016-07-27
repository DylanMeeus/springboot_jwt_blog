var fs = require('fs');
var path = require('path');

const loadPostIndex =
  () => fs.readdirSync(path.join(__dirname, '/_posts'))
    .filter(post => post.indexOf('.markdown') > -1)
;

const extractPostAlias =
  (name) => name.substr(0, 11).replace(/\-/g, '/') + name.substr(11).replace('.markdown', '')
;

const extractContent =
  (name) => fs.readFileSync(path.join(__dirname, '/_posts', name), 'utf8')
;

const extractAliasNameAndContent =
  (name) => ({
    name,
    alias: extractPostAlias(name),
    content: extractContent(name)
  })
;

const writePost =
  (name, content) => fs.writeFileSync(path.join(__dirname, '/_posts', name), content, 'utf8')
;

const includeAlias =
  (name) => {
    var alias = '\nalias: /' + extractPostAlias(name) + '/';
    var content = extractContent(name);

    if (content.indexOf('alias:') > -1) {
      return content;
    }

    if (content.indexOf('permalink:') > -1) {
      return content.replace('permalink:', 'alias:');
    }

    return content.replace('\nauthor:', alias + '\nauthor:');
  }
;

const processFiles =
  () => {
    loadPostIndex()
      .forEach((file) => writePost(file, includeAlias(file)))
    ;
  }
;

processFiles();
