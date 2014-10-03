import os

from pip.req import parse_requirements

try:
        from setuptools import setup
except ImportError:
        from distutils.core import setup

#mainscript = 'run.py'

install_requirements = parse_requirements('./requirements.txt')
install_requirements = [str(ir.req) for ir in install_requirements]

setup(
        name = 'surfboard',
        version = '',
        author = 'Tristan Fisher',
        author_email = 'code@tristanfisher.com',
        description = "surfboard ",
        long_description = open(os.path.join(os.path.realpath(os.path.dirname(__file__)), 'README.md'), 'r').read(),
#        scripts = [mainscript],
        url = '',
        license = open('LICENSE').read(),
        install_requires = install_requirements,
        setup_requires = []
)