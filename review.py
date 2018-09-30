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

    # Add each school into a large array property that holds all the schools
    schools = { }
    for root, dirs, files in os.walk(schoolDataDir):
        for f in files:
            filename, extension = os.path.splitext(f)
            if (extension == '.yml'):
                schools[filename] = yaml.load(readUTF8(os.path.join(root, f)))
    data['_schools'] = schools

    # In each unit of each school, add a property that indicates whether the unit
    # data is up to date for the current program
    for s in schools:
        aSchool = schools[s]
        for unitname in data['units']:
            if unitname in aSchool:
                aSchool[unitname]['_upToDate'] = (aSchool[unitname]['last-updated'] >= data['show']['year'])

    return data

def collectPartials(basePath, compiler):
    partials = { }
    for root, dirs, files in os.walk(basePath):
        for f in files:
            filename, extension = os.path.splitext(f)
            if (extension == '.adoc'):
                partials[filename] = compiler.compile(readUTF8(os.path.join(root, f)))
    return partials

def buildBook(eventDataPath, schoolDataDir, partialsDir, rootPartial, outputDir):
    rootTemplate = '{{> ' + rootPartial + ' }}'
    adocFilepath = os.path.join(outputDir, rootPartial + '-book.adoc')
    pdfFilepath = os.path.join(outputDir, rootPartial + '-book.pdf')

    if (not os.path.exists(outputDir)):
        os.makedirs(outputDir)

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
    bandReviewDataPath = './_data/bandreview.yml'
    bandReviewPartial = 'band-review'

    winterShowDataPath = './_data/wintershow.yml'
    winterShowPartial = 'winter-show'

    schoolDataDir = './_data/schools'
    partialsDir = './_partials'
    outputDir = './_books'

    buildBook(bandReviewDataPath, schoolDataDir, partialsDir, bandReviewPartial, outputDir)
    buildBook(winterShowDataPath, schoolDataDir, partialsDir, winterShowPartial, outputDir)

if __name__ == "__main__":
	main(sys.argv)
