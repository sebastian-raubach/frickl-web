# Frickl Docker Container

## Using Docker Compose
Modify `docker-compose.yml` and bind your image folder into the container:

```yml
version: '3.3'
services:
    mysql:
        image: mysql:5.7
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
        image: sebastianraubach/frickl:release-2.1.0
        environment:
          JAVA_OPTS: -Xmx512m
          # Optionally, limit how many CPU cores the image scanner thread can use up.
          FRICKL_MAX_CPU: 4
        ports:
          - 80:8080
        restart: always
        volumes:
          # Bind the config.properties file into the correct location
          - type: bind
            source: ./config.properties
            target: /data/frickl/config.properties
          # Bind your images folder into the Docker container
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

Then run

```
docker-compose up -d
```


## Configuring Frickl

Download the `config.template.properties` file from [GitHub](https://github.com/sebastian-raubach/frickl-web-server/blob/master/config.template.properties) and rename it to `config.properties`. Place the file in the same location as the `docker-compose.yml` file.

The content of the `config.properties` file should then look something like this:

```ini
authentication.enabled=<should authentication be enabled? Set to 'true'  or 'false'>

public.url=<the URL under which you access the client in your browser>

database.server=<'host.docker.internal' if the database runs on the Docker host or the IP of the database server, 'mysql' if you are using the accompanying MySQL Docker container>
database.name=<name of the database within the server>
database.username=<your database username>
database.password=<your database password>
database.port=<optional port of the database server>

admin.username=<username of an initial admin account that gets automatically created>
admin.password=<password for the initial admin account>

# Plausible Analytics information (https://plausible-tracker.netlify.app/globals#plausibleinitoptions)
plausible.domain=
plausible.hash.mode=
plausible.api.host=

google.analytics.key=

# Do not change this!
base.path=/data/images
```

## Using an existing database

Set the `database.server` property to `host.docker.internal` if the database is running on the Docker host (same machine as the Frickl Docker image runs on). Set it to `mysql` if you are using the Docker MySQL image specified in the `docker-compose.yml` file. If the MySQL server is running on a different host, set this to the IP of this host.

You can then remove the `mysql` Docker container from the `docker-compose.yml` file.