from distutils.core import setup

setup(
    name='evolve',
    version='1.5',
    packages=['morphs','web'],
    url='https://github.com/JamesHabben/evolve',
    license='',
    author='James Habben',
    author_email='james@wmif.net',
    description='Web interface for the Volatility Memory Forensics Framework',
    install_requires=[
        'bottle',
        'maxminddb',
    ]
)
