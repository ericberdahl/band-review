const _ = require('lodash');
const asciidoctor = require('asciidoctor')();
const debug = require('debug')('render-adoc-to-html');
const path = require('path');
const pluginKit = require('metalsmith-plugin-kit');

function renderAsciidoc(options)
{
    if (!options.pattern) {
        throw Error('pattern option is required');
    }

    options = _.defaults(options, {
        renderedExtension: '.html',
        removeOriginal: true
    });

    return pluginKit.middleware({
        match: options.pattern,

        each: (adocSourceFilename, adocSourceFile, files, metalsmith) => {
                const pathParts = path.parse(adocSourceFilename);
                const newName = path.join(pathParts.dir, pathParts.name + options.renderedExtension);
                
                debug('rendering %s as %s, %sremoving original',
                    adocSourceFilename,
                    newName,
                    (options.removeOriginal ? '' : 'not '));

                const html = asciidoctor.convert(adocSourceFile.contents.toString(), { safe: 'safe', header_footer: true });

                if (options.removeOriginal) {
                    delete files[adocSourceFilename];
                }
                pluginKit.addFile(files, newName, html);
            },
        });
    
    
}

module.exports = renderAsciidoc;
