const _ = require('lodash');
const debug = require('debug')('discover-partials');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

function discoverPartials(options)
{
    if (!options.pattern) {
        throw Error('pattern option is required');
    }
    if (!options.directory) {
        throw Error('partials directory is required');
    }
    if (!options.handlebars) {
        throw Error('Handlebars instance is required');
    }

    // TODO replace with metalsmith-discover-partials
    return (files, metalsmith, done) => {
        const partialsDir = metalsmith.path(options.directory);
        debug('finding partials in %s', partialsDir);

        const globOptions = {
            cwd: partialsDir,
            nodir: true,
        }
        glob(options.pattern, globOptions, (err, matchedFiles) => {
            if (err) {
                done(err);
                return;
            }

            matchedFiles.forEach((f) => {
                const partialName = path.basename(f, path.extname(f));
                debug('registering partial %s', partialName);

                options.handlebars.registerPartial(partialName,
                                                   fs.readFileSync(path.join(partialsDir, f),
                                                                   { encoding:'utf8'}));
            });

            done();
        });
    };
}

module.exports = discoverPartials;