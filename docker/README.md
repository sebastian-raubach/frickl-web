# frickl-docker

## Using Docker Compose
Modify `docker-compose.yml` and bind your image folder into the container:

```yml
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
        image: sebastianraubach/frickl:x86-release-1.0.0 (or :arm-release-1.0.0)
        environment:
          JAVA_OPTS: -Xmx512m
          FRICKL_USERNAME: <OPTIONAL USERNAME FOR AUTHENTICATION>
          FRICKL_PASSWORD: <OPTIONAL PASSWORD FOR AUTHENTICATION>
          GOOGLE_ANALYTICS_KEY: <OPTIONAL GOOGLE ANALYTICS KEY>
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
    --e GOOGLE_ANALYTICS_KEY=<OPTIONAL GOOGLE ANALYTICS KEY> \
    -v frickl:/usr/local/tomcat/temp \
    -v /path/to/your/images:/data/images \
    -p 80:8080 \
    --restart always \
    sebastianraubach/frickl:x86-release-1.0.0 (or :arm-release-1.0.0)
```

## Using an existing database

If you are using an existing database rather than using the MySQL Docker database, you need to do some additional configuration.

Add this to your `docker-compose.yml` file:

```yml
        volumes:
          - type: bind
            source: ./config.properties
            target: /data/frickl/config.properties
```

This will bind a local `config.properties` file into the Docker container overwriting Frickl's default configuration.

The content of the `config.properties` file should then look something like this:

```ini
database.username=<your database username>
database.password=<your database password>
database.server=<'host.docker.internal' if the database runs on the Docker host or the IP of the database server>
database.name=<name of the database within the server>
database.port=<optional port of the database server>

base.path=/data/images
```

You can then remove the `mysql` Docker container from the `docker-compose.yml` file.