cd fabric-dev-servers
./stopFabric.sh 
./teardownFabric.sh 
./startFabric.sh 
./createPeerAdminCard.sh

cd election-network

composer archive create -t dir -n . 
composer network install --card PeerAdmin@hlfv1 --archiveFile election-network@0.0.13.bna 
composer network start --networkName election-network --networkVersion 0.0.13 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card 

killall -9 node

composer-rest-server -c admin@election-network -n never -w true

composer archive create -t dir -n .

composer network install --card PeerAdmin@hlfv1 --archiveFile election-network@0.0.13.bna

composer network start --networkName election-network --networkVersion 0.0.13 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card

composer network ping --card admin@election-network

composer-rest-server -c admin@election-network -n never -w true
