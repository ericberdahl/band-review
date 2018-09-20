#!/usr/bin/python

import io
import os
import pybars
import yaml

eventDataPath = '../_data/bandreview.yml'
schoolDataDir = '../_data/schools'
partialsDir = '../_partials'
rootPartial = 'band-review'
outputAdocFilepath = 'test.adoc'

def readUTF8(filename):
    with io.open(filename, mode='rt', encoding='utf-8') as f:
        return f.read()

def collectViewdata():
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

def main():
    compiler = pybars.Compiler()
    viewdata = collectViewdata()
    partials = collectPartials(partialsDir, compiler)
    
    rootTemplate = '{{> ' + rootPartial + ' }}'
    template = compiler.compile(unicode(rootTemplate))
    with io.open(outputAdocFilepath, mode='wt', encoding='utf-8') as f:
        f.write(template(viewdata, partials=partials))

main()
