#!/usr/bin/python

import io
import os
import pybars
import yaml

def renderPystache(viewdata):
    import pystache
    renderer = pystache.Renderer(file_encoding='utf-8', file_extension='adoc')
    print renderer.render(u"{{> band-review}}", viewdata)

def readUTF8(filename):
    with io.open(filename, mode='rt', encoding='utf-8') as f:
        return f.read()

def collectViewdata():
    data = yaml.load(readUTF8('../_data/bandreview.yml'))
    schools = { }
    for root, dirs, files in os.walk('../_data/schools'):
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
    partials = collectPartials('../_partials', compiler)
    
    template = compiler.compile(u"{{> band-review}}")
    with io.open('test.adoc', mode='wt', encoding='utf-8') as f:
        f.write(template(viewdata, partials=partials))

main()
