#!/usr/bin/python

import datetime
import io
import os
import pybars
import subprocess
import sys
import yaml

def readUTF8(filename):
    with io.open(filename, mode='rt', encoding='utf-8') as f:
        return f.read()

config = yaml.load(readUTF8('./_data/config.yml'))

def computeNumericCitation(count):
    try:
        found = next(cite for cite in config['count_citation'] if cite['min'] <= count and count <= cite['max'])
        return found['cite']
    except StopIteration:
        return count

def countLineup(lineup):
    condition = lambda x: 'ref' in x
    return sum(condition(x) for x in lineup)

def fixupUnit(show, unit):
    if (isinstance(unit['last-updated'], basestring)):
        d = datetime.datetime.strptime(unit['last-updated'], "%Y-%m-%d %H:%M:%S %Z")
    else:
        d = datetime.datetime(unit['last-updated'], 1, 1)
    unit['_upToDate'] = (d.year >= show['year'])
    unit['_lastUpdated'] = d

def collectSchoolData(schoolDataDir):
    # Add each school into a large array property that holds all the schools
    schools = { }
    for root, dirs, files in os.walk(schoolDataDir):
        for f in files:
            filename, extension = os.path.splitext(f)
            if (extension == '.yml'):
                schools[filename] = yaml.load(readUTF8(os.path.join(root, f)))
    return schools

def collectViewdata(eventDataPath, schoolDataDir):
    data = yaml.load(readUTF8(eventDataPath))

    schools = collectSchoolData(schoolDataDir)
    data['_schools'] = schools
    
    today = datetime.date.today()
    data['_generationDate'] = today.strftime('%d %B %Y')

    # In each unit of each school, add a property that indicates whether the unit
    # data is up to date for the current program
    for s in schools:
        aSchool = schools[s]
        for unitname in data['units']:
            if unitname in data:
                lineupCount = countLineup(data[unitname]['lineup'])
                _count = {
                    'number': lineupCount,
                    'citation': computeNumericCitation(lineupCount)
                }
                data[unitname]['_count'] = _count
            if unitname in aSchool:
                # aSchool[unitname]['_upToDate'] = (aSchool[unitname]['last-updated'] >= data['show']['year'])
                fixupUnit(data['show'], aSchool[unitname])

    return data

def collectPartials(basePath, compiler):
    partials = { }
    for root, dirs, files in os.walk(basePath):
        for f in files:
            filename, extension = os.path.splitext(f)
            if (extension == '.adoc'):
                partials[filename] = compiler.compile(readUTF8(os.path.join(root, f)))
    return partials

def buildPDF(rootPartial, outputDir):
    basename = rootPartial + '-book'
    adocFilepath = os.path.join(outputDir, basename + '.adoc')
    pdfFilepath = os.path.join(outputDir, basename + '.pdf')

    print '# Compiling pdf book {}'.format(pdfFilepath)
    subprocess.call([
        'asciidoctor-pdf',
        '-a', 'pdf-stylesdir=.',
        '-a', 'pdf-style=announcer',
        adocFilepath,
        '-o', pdfFilepath
        ])

def buildHTML(rootPartial, outputDir):
    basename = rootPartial + '-book'
    adocFilepath = os.path.join(outputDir, basename + '.adoc')
    htmlFilepath = os.path.join(outputDir, basename + '.html')

    print '# Compiling HTML {}'.format(htmlFilepath)
    subprocess.call([
        'asciidoctor',
        adocFilepath
        ])

def buildAdoc(eventDataPath, schoolDataDir, partialsDir, rootPartial, outputDir):
    rootTemplate = '{{> ' + rootPartial + ' }}'
    basename = rootPartial + '-book'
    adocFilepath = os.path.join(outputDir, basename + '.adoc')
    pdfFilepath = os.path.join(outputDir, basename + '.pdf')

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
    
def buildAll(eventDataPath, schoolDataDir, partialsDir, rootPartial, outputDir):
    buildAdoc(eventDataPath, schoolDataDir, partialsDir, rootPartial, outputDir)
    buildHTML(rootPartial, outputDir)
    buildPDF(rootPartial, outputDir)

def main(argv):
    bandReviewDataPath = './_data/bandreview.yml'
    bandReviewPartial = 'band-review'

    winterShowDataPath = './_data/wintershow.yml'
    winterShowPartial = 'winter-show'

    schoolDataDir = './_data/schools'
    partialsDir = './_partials'
    outputDir = './_books'

    buildAll(bandReviewDataPath, schoolDataDir, partialsDir, bandReviewPartial, outputDir)
    buildAll(winterShowDataPath, schoolDataDir, partialsDir, winterShowPartial, outputDir)

if __name__ == "__main__":
	main(sys.argv)
