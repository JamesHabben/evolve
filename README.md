<img src="https://github.com/JamesHabben/evolve/blob/master/images/evolve-logo-github.png" /> <br />
Web interface for the Volatility Memory Forensics Framework
https://github.com/volatilityfoundation/volatility

Short video demo:
https://youtu.be/55G2oGPQHF8

## Installation
This requires volatility to be a library, not just an EXE file sitting somewhere. Run these commands at python shell:

`pip install volatility` <br />
`pip install yara` <br/ >
`pip install distorm3` <br/ >
* note: you may need to prefix 'sudo' on the above commands depending on your OS.

## Usage
-f File containing the RAM dump to analyze <br />
-p Volatility profile to use during analysis <br />

<img src="https://github.com/JamesHabben/evolve/blob/master/images/evolve-cmd.png" />

## Features
- Works with any Volatility module that provides a SQLite render method (some don't)
- Automatically detects plugins - If volatility sees the plugin, so will eVOLve
- All results stored in a single SQLite db stored beside the RAM dump
- Web interface is fully AJAX using jQuery & JSON to pass requests and responses
- Uses Bottle module in Python to provide a standalone web server
- Option to edit SQL query to provide enhanced data views with data from multiple tables
- Run plugins and view data from any browser - even a tablet!
- Allow multiple people to review results of single RAM dump

## Coming Features
- Save custom queries for future use
- Import/Export queries to share with others
- Threading for more responsive interface while modules are running
- Export/save of table data to JSON, CSV, etc
- Review mode which requires only the generated SQLite file for better portability

Please send your ideas for features!

<img src="https://github.com/JamesHabben/evolve/blob/master/images/evolve-connections.png" />
<br /><br />
<img src="https://github.com/JamesHabben/evolve/blob/master/images/evolve-wsock32.png" />
