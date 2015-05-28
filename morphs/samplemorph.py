#__author__ = 'james.habben'

#import morphs.BaseMorph as BaseMorph
from morphs.BaseMorph import BaseMorph

class SampleMorph(BaseMorph):
    name = 'sample'
    displayname = 'Sample Morph'
    helptext = 'Some example text to display in a tooltip'
    plugins = ['pslist','dlllist']

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
