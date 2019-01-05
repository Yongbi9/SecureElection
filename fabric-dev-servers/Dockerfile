FROM ubuntu:18.04

RUN apt-get update

RUN apt-get install curl -y
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
RUN export NVM_DIR="${HOME}/.nvm"[ -s "${NVM_DIR}/nvm.sh" ] && . "${NVM_DIR}/nvm.sh"[ -s "${NVM_DIR}/bash_completion" ] && . "${NVM_DIR}/bash_completion"
RUN nvm install 8
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