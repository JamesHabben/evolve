#__author__ = 'james.habben'

#import morphs.BaseMorph as BaseMorph
from morphs.BaseMorph import BaseMorph

class SampleMorph(BaseMorph):
    name = 'sampleconfig'
    displayname = 'Sample Morph with Config'
    helptext = 'Some example text to display in a tooltip'
    plugins = ['pslist','dlllist']
    config = {
        'filename':{
            'name':'Find Filename',
            'description':'provide a filename to highlight in the data view',
            'type':'string',
            'required':True
        },
        'boguspath':{
            'name':'Bogus Path',
            'description':'Bogus configuration entry to show a path value',
            'type':'path'
        },
        'boguscheck':{
            'name':'Bogus Checkbox',
            'description':'Bogus configuartion entry to show a checkbox value',
            'type':'bool'
        },
        'bogusnum':{
            'name':'Bogus Number',
            'description':'Bogus configutation entry for show a number value also with a default value',
            'type':'number',
            'defaultvalue':1234,
            'required':True
        }
    }

    #def __init__(self):
        #super.__init__(self)
        #self.displayname = 'Sample Morph'
        #self.plugins = ['pslist','dlllist']


    def morph(self, data):
        if data['name'] == 'pslist':
            colnum = data['columns'].index('Name')
            for idx,row in enumerate(data['data']):
                if row[colnum] == 'services.exe':
                    row = list(row)
                    row[colnum] = {'value':row[colnum],'style':'background-color:pink;'}
                    data['data'][idx] = row
