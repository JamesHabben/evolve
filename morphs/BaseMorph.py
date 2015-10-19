#__author__ = 'james.habben'

import os
import json
class BaseMorph (object):
    name = ''
    displayname = ''
    helptext = ''
    plugins = []
    config = {}
    configpath = ''

    def __init__(self):
        self.configpath = os.path.join(os.path.dirname(__file__), 'configs', '%s.json'%self.name)
        if not os.path.exists(os.path.join(os.path.dirname(__file__), 'configs')):
            os.makedirs(os.path.join(os.path.dirname(__file__), 'configs'))
        if os.path.exists(self.configpath):
            self.ReadConfig()

    def PrintName (self):
        print self.name

    def ReadConfig (self):
        with open(self.configpath, 'r') as infile:
            newconfig = json.load(infile)
            for conf in newconfig:
                '''if newconfig[conf].lower() == 'true':
                    self.config[conf]['value'] = True
                elif newconfig[conf].lower() == 'false':
                    self.config[conf]['value'] = False
                else:'''
                self.config[conf]['value'] = newconfig[conf]

    def WriteConfig (self):
        with open(self.configpath, 'w') as outfile:
            saveconfig = {}
            for conf in self.config:
                saveconfig[conf] = self.config[conf]['value']
            json.dump(saveconfig, outfile)

    def SetConfig (self, newconfig):
        for conf in newconfig:
            '''
            if newconfig[conf][0].lower() == 'true':
                self.config[conf]['value'] = True
            elif newconfig[conf][0].lower() == 'false':
                self.config[conf]['value'] = False
            else:
                self.config[conf]['value'] = newconfig[conf][0]
            '''
            self.config[conf]['value'] = newconfig[conf]
        self.WriteConfig()