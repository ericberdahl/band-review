#!/usr/bin/python

import io
import os
import pybars
import subprocess
import sys
import yaml

def readUTF8(filename):
    with io.open(filename, mode='rt', encoding='utf-8') as f:
        return f.read()

def collectViewdata(eventDataPath, schoolDataDir):
    data = yaml.load(readUTF8(eventDataPath))
    schools = { }
    for root, dirs, files in os.walk(schoolDataDir):
        for f in files:
            filename, extension = os.path.splitext(f)
            if (extension == '.yml'):
                schools[filename] = yaml.load(readUTF8(os.path.join(root, f)))
    data['schools'] = schools
    return data

def collectPartials(basePath, compiler):
    partials = { }
    for root, dirs, files in os.walk(basePath):
        for f in files:
            filename, extension = os.path.splitext(f)
            if (extension == '.adoc'):
                partials[filename] = compiler.compile(readUTF8(os.path.join(root, f)))
    return partials

def buildBook(eventDataPath, schoolDataDir, partialsDir, rootPartial):
    rootTemplate = '{{> ' + rootPartial + ' }}'
    adocFilepath = rootPartial + '-book.adoc'
    pdfFilepath = rootPartial + '-book.pdf'

    compiler = pybars.Compiler()

    print '# Collecting data'
    viewdata = collectViewdata(eventDataPath, schoolDataDir)

    print '# Compiling partials'
    partials = collectPartials(partialsDir, compiler)
    
    print '# Compiling asciidoc book {}'.format(adocFilepath)
    template = compiler.compile(unicode(rootTemplate))
    with io.open(adocFilepath, mode='wt', encoding='utf-8') as f:
        f.write(template(viewdata, partials=partials))
    
    print '# Compiling pdf book {}'.format(pdfFilepath)
    subprocess.call([
        'asciidoctor-pdf',
        '-a', 'pdf-stylesdir=.',
        '-a', 'pdf-style=announcer',
        adocFilepath,
        '-o', pdfFilepath
        ])

def main(argv):
    eventDataPath = '../_data/bandreview.yml'
    schoolDataDir = '../_data/schools'
    partialsDir = '../_partials'
    rootPartial = 'band-review'

    buildBook(eventDataPath, schoolDataDir, partialsDir, rootPartial)

if __name__ == "__main__":
	main(sys.argv)
