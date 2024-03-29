FROM node:16-alpine AS builder

LABEL maintainer="sebastian@raubach.co.uk"

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
    echo "VUE_APP_BASE_URL=./api/" > .env && \
    apk add --no-cache python3 build-base gcc wget && \
    npm i --legacy-peer-deps && \
    npm run build && \
    mkdir /opt/frickl-server/client/ && \
    cp -a /opt/frickl/dist/. /opt/frickl-server/client/ && \
    echo "config.file=/data/frickl/config.properties" > /opt/frickl-server/config.properties

# Copy a configuration for the server
COPY build.properties /opt/frickl-server/build.properties

# Download Gradle and build the server code
RUN apk add --no-cache openjdk11 && \
    wget https://services.gradle.org/distributions/gradle-6.0.1-bin.zip -P /tmp/ && \
    unzip /tmp/gradle-6.0.1-bin.zip -d /opt/ && \
    /opt/gradle-6.0.1/bin/gradle -p /opt/frickl-server war


FROM tomcat:10.1-jdk11

LABEL maintainer="sebastian@raubach.co.uk"

RUN apt-get update && \
    apt-get --yes --force-yes install ffmpeg imagemagick exiftool

RUN mkdir -p /usr/local/tomcat/webapps && \
    rm -rf /usr/local/tomcat/webapps/ROOT

COPY --from=builder /opt/frickl-server/build/libs/frickl-*.war /usr/local/tomcat/webapps/ROOT.war

WORKDIR /usr/local/tomcat/
