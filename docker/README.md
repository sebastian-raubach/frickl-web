# frickl-docker

## Using Docker Compose
Modify `docker-compose.yml` and bind your image folder into the container:

```
version: '3.3'
services:
    mysql:
        image: mysql:5.7 (or yobasystems/alpine-mariadb:arm32v7)
        volumes:
          - type: volume
            source: mysql
            target: /var/lib/mysql
        environment:
          MYSQL_ROOT_PASSWORD: FricklIsAwesome
          MYSQL_DATABASE: frickl
          MYSQL_USER: frickl
          MYSQL_PASSWORD: frickl
        restart: always
        container_name: mysql

    frickl:
        image: sebastianraubach/frickl:x86 (or :arm)
        environment:
          JAVA_OPTS: -Xmx512m
          FRICKL_USERNAME: <OPTIONAL USERNAME FOR AUTHENTICATION>
          FRICKL_PASSWORD: <OPTIONAL PASSWORD FOR AUTHENTICATION>
        ports:
          - 80:8080
        restart: always
        volumes:
          - type: bind
            source: /path/to/your/images
            target: /data/images
          - type: volume
            source: frickl
            target: /usr/local/tomcat/temp
        container_name: frickl
        depends_on:
           - "mysql"

volumes:
    frickl:
    mysql:

```

```
docker-compose up -d
```

## Using plain Docker
```
docker volume create frickl
docker volume create mysql

docker network create frickl

docker run -d \
    --name mysql \
    --network frickl \
    -e MYSQL_ROOT_PASSWORD=FricklIsAwesome \
    -e MYSQL_DATABASE=frickl \
    -e MYSQL_USER=frickl \
    -e MYSQL_PASSWORD=frickl \
    -v mysql:/var/lib/mysql \
    --restart always \
    mysql:5.7 (or yobasystems/alpine-mariadb:arm32v7)

docker run -d \
    --name frickl \
    --network frickl \
    --e JAVA_OPTS=-Xmx512m \
    --e FRICKL_USERNAME=<OPTIONAL USERNAME FOR AUTHENTICATION> \
    --e FRICKL_PASSWORD=<OPTIONAL PASSWORD FOR AUTHENTICATION> \
    -v frickl:/usr/local/tomcat/temp \
    -v /path/to/your/images:/data/images \
    -p 80:8080 \
    --restart always \
    sebastianraubach/frickl:x86 (or :arm)
```
