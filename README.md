<img src="https://github.com/JamesHabben/evolve/blob/master/images/evolve-logo.png" /> <br />
Web interface for the Volatility Memory Forensics Framework
https://github.com/volatilityfoundation/volatility

Current Version: 1.5 (2015-11-09) <br /><br />
See what people are saying: [#EvolveTool](https://twitter.com/search?q=%23evolvetool) <br />
Short video demo:
https://youtu.be/55G2oGPQHF8 <br />
Pre-Scan video:
https://youtu.be/mqMuQQowqMI

## Installation
This requires volatility to be a library, not just an EXE file sitting somewhere. Run these commands at python shell:

Download Volatility source zip from https://github.com/volatilityfoundation/volatility<br />
Inside the extracted folder run: <br />
`setup.py install`<br />

Then install these dependencies: <br />
`pip install bottle` <br />
`pip install yara` <br/ >
`pip install distorm3` <br/ >
`pip install maxminddb` <br/ >
* Note: you may need to prefix `sudo` on the above commands depending on your OS.
* Note: You may also need to prefix `python` if it is not in your run path.
* Note: Windows may require distorm3 download: https://pypi.python.org/pypi/distorm3/3.3.0.
* Note: Windows pip seems to install Yara based on OS bitness, not python. Download installer: http://plusvic.github.io/yara/
* Note: Microsoft Visual C++ Compiler for Python 2.7 will help pip install distorm3 and pycrypto: http://www.microsoft.com/en-us/download/details.aspx?id=44266


## Usage
-f File containing the RAM dump to analyze <br />
-p Volatility profile to use during analysis (--profile may not work even though it shows as an option) <br />
-d Optional path for output file. Default is beside memory image <br />
-l Restrict web server from serving content outside of the local machine <br />
-r comma separated list of plugins to run at the start<br />

!!! WARNING: Avoid writing sqlite to NFS shares. They can lock or get corrupt. If you must, try mounting share with 'nolock' option.

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
- Multiprocessing for full CPU usage
- Pre-Scan runs a list of plugins at the start

## Coming Features
- Save custom queries for future use
- Import/Export queries to share with others
- ~~Threading for more responsive interface while modules are running~~
- Export/save of table data to JSON, CSV, etc
- Review mode which requires only the generated SQLite file for better portability

Please send your ideas for features!

<img src="https://github.com/JamesHabben/evolve/blob/master/images/evolve-connections.png" />
<br /><br />
<img src="https://github.com/JamesHabben/evolve/blob/master/images/evolve-wsock32.png" />

Release notes:<br />
v1.0 - Initial release <br />
v1.1 - Threading, Output folder option, removed unused imports<br />
v1.2 - Pre-Scan option to run list of plugins at the start<br />
v1.3 - Added Morph function and sample Morphs. Also fixed multiprocess bug in Windows.<br />
v1.4 - Added Morph config builder and more sample Morphs. Added searchable and sortable table.<br />
v1.5 - Added dynamic memory profile chooser.<br />
