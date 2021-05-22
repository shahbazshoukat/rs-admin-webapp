########################################
# Setting Docker Node
########################################

FROM node:12

########################################
# Setting root user
########################################

USER root

ENV HOME=/usr/local/resultsquare-webapp

########################################
# Creating Directory
########################################

RUN mkdir $HOME && \
    apt-get -qqy update && \
    apt-get -qqy --no-install-recommends install \
    nginx && \
    rm -rf /var/lib/apt/lists/*

########################################
# Setting Code directory
########################################

WORKDIR $HOME

########################################
# Copying code
########################################

COPY ./ $HOME

########################################
# Installing dependencies and
# configuring nginx
########################################

RUN chmod 777 -R $HOME && \
    chmod 777 -R /usr/local/lib/node_modules/ && \
    npm config set user 0 && \
    npm config set unsafe-perm true && \
    npm install -g @angular/cli@8 typings && \
    npm install && \
    npm run buildDocker && \
    cp -f resultsquare.nginx.conf /etc/nginx/conf.d/default && \
    cp -f resultsquare.nginx.conf /etc/nginx/sites-available/default

########################################
# Expose port
########################################

EXPOSE 80
CMD $HOME/entrypoint.sh
