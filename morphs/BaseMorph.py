#__author__ = 'james.habben'

class BaseMorph(object):
    name = ''
    displayname = ''
    helptext = ''
    plugins = []

    #def __init__(self):
        #self
        #self.displayname = ''
        #self.plugins = []

    @staticmethod
    def changeValue(tup, index, ins):
        lst = list(tup)
        lst[index] = ins
        return tuple(lst)