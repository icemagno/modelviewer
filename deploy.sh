#! /bin/sh

mvn clean package

docker ps -a | awk '{ print $1,$2 }' | grep magnoabreu/modelviewer:1.0 | awk '{print $1 }' | xargs -I {} docker rm -f {}
docker rmi magnoabreu/modelviewer:1.0
docker build --tag=magnoabreu/modelviewer:1.0 --rm=true .

docker run --name modelviewer --hostname=modelviewer \
-v /etc/localtime:/etc/localtime:ro \
-v /srv/modelviewer:/models \
-p 36577:8080 \
-d magnoabreu/modelviewer:1.0

docker push magnoabreu/modelviewer:1.0

