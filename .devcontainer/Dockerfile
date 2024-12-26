FROM oven/bun:alpine

# Config Bun
ENV PATH="~/.bun/bin:${PATH}"
RUN ln -s /usr/local/bin/bun /usr/local/bin/node

# Update packages
RUN if [ "alpine" == "alpine" ] ; then apk update ; else apt-get update ; fi

# Install Git
RUN if [ "alpine" == "alpine" ] ; then apk add git ; else apt-get install -y git ; fi

