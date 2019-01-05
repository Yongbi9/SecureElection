FROM debian:latest

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get update \
    && apt-get install -y curl \
    && apt-get -y autoclean

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 8.14.1

RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash

RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN npm install -g composer-cli@0.20
RUN npm install -g composer-rest-server@0.20
RUN npm install -g generator-hyperledger-composer@0.20
RUN npm install -g yo
RUN export FABRIC_VERSION=hlfv12
RUN ./downloadFabric.sh
RUN ./stopFabric.sh
RUN ./teardownFabric.sh
RUN ./startFabric.sh
RUN ./createPeerAdminCard.sh
RUN cd election-network/ \
        && composer archive create -t dir -n . \
        && composer network install --card PeerAdmin@hlfv1 --archiveFile election-network@0.0.13.bna \
        && composer network start --networkName election-network --networkVersion 0.0.13 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card \
        && composer-rest-server -c admin@election-network -n never -w true

WORKDIR /fabric_servers

COPY . /fabric_servers

EXPOSE 3000