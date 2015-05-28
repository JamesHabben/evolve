#__author__ = 'james.habben'

#import morphs.BaseMorph as BaseMorph
from morphs.BaseMorph import BaseMorph
import re

class IntVsExtIpMorph(BaseMorph):
    name = 'IntVsExtIp'
    displayname = 'Internal vs External IPs'
    helptext = 'Highlight internal and external IPs with colors for quick recognition'
    plugins = ['connections','connscan']

    #def __init__(self):
        #super.__init__(self)
        #self.displayname = 'Sample Morph'
        #self.plugins = ['pslist','dlllist']

    @staticmethod
    def IsInternal(ip):
        #ip = str(ip)
        if ip.startswith('10.') or ip.startswith('192.168.') or ip.startswith('127.0.0.1'):
            return True
        if re.match('^172.([1][6-9]|[2][0-9]|[3][0-1])\.', ip):
            return True

    def morph(self, data):
        if data['name'] in ['connections','connscan']:
            loccol = data['columns'].index('LocalAddress')
            remcol = data['columns'].index('RemoteAddress')
            for idx,row in enumerate(data['data']):
                row = list(row)
                if self.IsInternal(row[loccol]):
                    row[loccol] = {'value':row[loccol],'style':'background-color:lightyellow;'}
                else:
                    row[loccol] = {'value':row[loccol],'style':'background-color:lightgreen;'}
                if self.IsInternal(row[remcol]):
                    row[remcol] = {'value':row[remcol],'style':'background-color:lightyellow;'}
                else:
                    row[remcol] = {'value':row[remcol],'style':'background-color:lightgreen;'}
                data['data'][idx] = row