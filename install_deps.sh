sudo apt-get install docker.io -y

sudo apt-get install curl -y
sudo curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

curl -O https://hyperledger.github.io/composer/v0.19/prereqs-ubuntu.sh
hmod u+x prereqs-ubuntu.sh
./prereqs-ubuntu.sh

