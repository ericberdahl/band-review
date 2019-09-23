const _ = require('lodash');
const childProcess = require('child_process');
const debug = require('debug')('render-adoc-to-pdf');
const fs = require('fs');
const path = require('path');
const pluginKit = require('metalsmith-plugin-kit');
const tempy = require('tempy');

function render(options)
{
    if (!options.pattern) {
        throw Error('pattern option is required');
    }

    options = _.defaults(options, {
        renderedExtension: '.pdf',
        removeOriginal: true
    });

    return pluginKit.middleware({
        match: options.pattern,

        each: (adocSourceFilename, adocSourceFile, files, metalsmith) => {
                const pathParts = path.parse(adocSourceFilename);
                const pdfDestFilename = path.join(pathParts.dir, pathParts.name + options.renderedExtension);

                debug('converting %s to %s', adocSourceFilename, pdfDestFilename);

                const tmpSrcName = tempy.file({ extension: 'adoc' });
                const tmpDstName = tempy.file({ extension: 'pdf' });

                fs.writeFileSync(tmpSrcName, adocSourceFile.contents, { encoding: 'utf8' });

                childProcess.spawnSync('asciidoctor-pdf', [
                    '-a', 'pdf-stylesdir=' + metalsmith.path(),
                    '-a', 'pdf-style=announcer',
                    tmpSrcName,
                    '-o', tmpDstName
                ]);

                pluginKit.addFile(files, pdfDestFilename, fs.readFileSync(tmpDstName));

                fs.unlinkSync(tmpSrcName);
                fs.unlinkSync(tmpDstName);

                if (options.removeOriginal) {
                    delete files[adocSourceFilename];
                }
        },
    });
}


module.exports = render;