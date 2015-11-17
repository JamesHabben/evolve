#
# This Docker image encapsulates the Evolve Tool by James Habben from  
# https://github.com/JamesHabben/evolve
#
# Evolve provides a web interface for the Volatility Framework (version 2.5) by The 
# Volatility Foundation from http://www.volatilityfoundation.org/#!releases/component_71401
#
# To run this image after installing Docker, use the following command:
# sudo docker run --rm -it -v ~/memdumps:/home/nonroot/memdumps wzod/evolve bash
#
# To access the Evolve web interface from outside the Docker container, use the command:
#
# sudo docker run --rm -it -v ~/memdumps:/home/nonroot/memdumps -p 8080:8080 wzod/evolve bash
#
# Before running Evolve, create the ~/memdumps directory and make it world-accessible
# (“chmod a+xwr").

FROM wzod/volatility
MAINTAINER Zod (@wzod)

# Install packages from apt repository
USER root
RUN cd /home/nonroot/volatility-2.5 && \
  python setup.py build && \
  python setup.py install 

# Install additional dependencies
RUN pip install bottle \
  maxminddb

USER nonroot
RUN cd /home/nonroot && \
  git clone https://github.com/JamesHabben/evolve.git && \
  cd evolve

USER nonroot
ENV HOME /home/nonroot
ENV USER nonroot
WORKDIR /home/nonroot/evolve
