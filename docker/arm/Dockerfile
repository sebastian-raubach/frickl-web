FROM node:12-alpine3.10 AS builder

LABEL maintainer="sebastian@raubach.co.uk"

COPY qemu-arm-static /usr/bin/qemu-arm-static

ARG BRANCH=master

# Force docker to not cache the next line
ADD https://api.github.com/repos/sebastian-raubach/frickl-web/git/refs/heads/master version.json
# Clone the Germinate server code and client code
RUN echo "Pulling GitHub branch: $BRANCH"
RUN apk add --no-cache git && \
    git clone -b "$BRANCH" --single-branch --depth 1 https://github.com/sebastian-raubach/frickl-web-server.git /opt/frickl-server && \
    git clone -b "$BRANCH" --single-branch --depth 1 https://github.com/sebastian-raubach/frickl-web.git /opt/frickl

# Build the client code
WORKDIR /opt/frickl
RUN rm -f .env && \
    echo "VUE_APP_BASE_URL=/api/" > .env && \
    apk add --no-cache python build-base gcc wget && \
    npm i && \
    npm run build && \
    mkdir /opt/frickl-server/client/ && \
    cp -a /opt/frickl/dist/. /opt/frickl-server/client/

# Copy a configuration for the server
COPY build.properties /opt/frickl-server/build.properties
COPY config.properties /opt/frickl-server/config.properties

# Download Gradle and build the server code
RUN apk add --no-cache openjdk11 && \
    wget https://services.gradle.org/distributions/gradle-6.0.1-bin.zip -P /tmp/ && \
    unzip /tmp/gradle-6.0.1-bin.zip -d /opt/ && \
    /opt/gradle-6.0.1/bin/gradle -p /opt/frickl-server war


FROM tomcat:8-jdk8

LABEL maintainer="sebastian@raubach.co.uk"

RUN apt-get update && \
    apt-get install ffmpeg

RUN mkdir -p /usr/local/tomcat/webapps && \
    rm -rf /usr/local/tomcat/webapps/ROOT

COPY --from=builder /opt/frickl-server/build/libs/frickl-*.war /usr/local/tomcat/webapps/ROOT.war
COPY tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml

WORKDIR /usr/local/tomcat/