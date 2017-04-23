## cd server_web
mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"

## cd ~/workspace 
node server

## cd ~/workspace 
gulp

## to look into mongo server:: 
## cd anywhere I think ? ? --> cd server_web 
mongo

##mongo commands: 
show dbs
use <dbs>

show collections

db.<collection>.find() //optional: .pretty()

db.<collection>.drop()

## our theme: 
https://bootswatch.com/cerulean/