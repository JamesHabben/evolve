#__author__ = 'james.habben'

#import morphs.BaseMorph as BaseMorph
from morphs.BaseMorph import BaseMorph
import re
import maxminddb

class CountryCodedIpMorph(BaseMorph):
    name = 'CountryCodedIp'
    displayname = 'Country Coded IPs'
    helptext = 'Display country information next to IP address'
    plugins = ['connections','connscan','netscan']
    config = {
        'dbpath':{
            'name':'MaxMind Database Path',
            'description':'Provide the path to the MaxMind GeoLite2 Country database. Get database from MaxMind website.',
            'type':'path',
            'required':True
        },
        'alertlist':{
            'name':'Alert List',
            'description':'CSV List of country ISO codes to alert if seen in the output',
            'type':'string',
            'defaultvalue':'cn,ru,kp'
        },
        'showalert':{
            'name':'Show Alerts',
            'description':'Display countries in alert list in a different color to distinguish',
            'type':'bool'
        }
    }

    def __init__(self):
        BaseMorph.__init__(self)

    @staticmethod
    def IsInternal(ip):
        #ip = str(ip)
        if ip.startswith('0.0.0.0'):
            return True
        if ip.startswith('10.') or ip.startswith('192.168.') or ip.startswith('127.0.0.1'):
            return True
        if re.match('^172.([1][6-9]|[2][0-9]|[3][0-1])\.', ip):
            return True

    @staticmethod
    def FormatIp (ip, mmData):
        #return '[%s] %s' % (mmData['country']['iso_code'], ip)
        return '<img src="/web/images/flags/%s.png"/> %s' % (mmData['country']['iso_code'], ip)

    @staticmethod
    def FormatTooltip (mmData):
        return 'Country: %s; ISO: %s; Continent: %s;' % \
               (mmData['country']['names']['en'],
               mmData['country']['iso_code'],
               mmData['continent']['names']['en'])

    def PrepareExtData(self, col, mmreader):
        try:
            mmData = mmreader.get(str(col).split(':')[0])
            newrow = {'value':self.FormatIp(col, mmData),'tooltip':self.FormatTooltip(mmData)}
            alertlist = self.config['alertlist']['value'].lower().split(',')
            if self.config['showalert']['value'] and mmData['country']['iso_code'].lower() in alertlist:
                newrow['style'] = 'background-color:pink;'
                newrow['blinkbg'] = ['pink','red']
            else:
                newrow['style'] = 'background-color:lightgreen;'
            return newrow
        except:
            return {'value':col,'style':'background-color:lightgreen;'}


    def morph(self, data):
        mmreader = maxminddb.open_database(self.config['dbpath']['value'])
        if data['name'] in ['connections','connscan','netscan','sockets','sockscan','linux_route_cache','linux_netstat']:
            for colname in ['LocalAddress','RemoteAddress','LocalAddr','ForeignAddr','Address','Destination']:
                if colname in data['columns']:
                    col = data['columns'].index(colname)
                    #remcol = data['columns'].index('RemoteAddress')
                    for idx,row in enumerate(data['data']):
                        row = list(row)
                        if self.IsInternal(row[col]):
                            row[col] = {'value':row[col],'style':'background-color:lightyellow;'}
                        else:
                            row[col] = self.PrepareExtData(row[col], mmreader)
                        #if self.IsInternal(row[remcol]):
                        #    row[remcol] = {'value':row[remcol],'style':'background-color:lightyellow;'}
                        #else:
                        #    row[remcol] = self.PrepareExtData(row[remcol], mmreader)
                        data['data'][idx] = row
