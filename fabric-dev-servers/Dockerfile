FROM ubuntu:18.04

RUN apt-get update

RUN apt-get install curl -y
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
RUN touch .bash_profile
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
RUN nvm install v8
RUN nvm use 8
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