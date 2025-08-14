FROM node:22.11-alpine3.20 AS builder

LABEL maintainer="bazraubach@gmail.com"

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
    echo "VITE_BASE_URL=./api/" > .env && \
    apk add --no-cache python3 build-base gcc wget && \
    npm i --legacy-peer-deps && \
    npm run build && \
    mkdir /opt/frickl-server/client/ && \
    cp -a /opt/frickl/dist/. /opt/frickl-server/client/ && \
    echo "config.file=/data/frickl/config.properties" > /opt/frickl-server/config.properties

# Download Gradle and build the server code
RUN apk add --no-cache openjdk21 && \
    wget https://services.gradle.org/distributions/gradle-8.8-bin.zip -P /tmp/ && \
    unzip /tmp/gradle-8.8-bin.zip -d /opt/ && \
    /opt/gradle-8.8/bin/gradle -p /opt/frickl-server war


FROM tomcat:10.1-jdk21

LABEL maintainer="bazraubach@gmail.com"

RUN apt-get update && \
    apt-get --yes --force-yes install ffmpeg imagemagick exiftool

RUN mkdir -p /usr/local/tomcat/webapps && \
    rm -rf /usr/local/tomcat/webapps/ROOT

COPY --from=builder /opt/frickl-server/build/libs/frickl-*.war /usr/local/tomcat/webapps/ROOT.war

WORKDIR /usr/local/tomcat/
