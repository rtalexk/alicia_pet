#!/usr/bin/env bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
sudo add-apt-repository -y ppa:nginx/stable
sudo apt-get update

# Install nginx
sudo apt-get install -y nginx
sudo cp ./sites-available /etc/nginx/sites-available/default
sudo systemctl restart nginx

# install NodeJS
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo cp ./mongo.service /lib/systemd/system/mongod.service
sudo systemctl start mongod

# Install PM2
npm install pm2 -g
