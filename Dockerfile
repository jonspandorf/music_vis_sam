FROM node:20-alpine3.17 

RUN npm install -g serverless

# RUN npm install --save serverless-python-requirements

RUN apk add curl

RUN curl https://download.docker.com/linux/static/stable/x86_64/docker-24.0.5.tgz -o docker.tgz

RUN tar xzvf docker.tgz 

RUN cp docker/* /usr/bin/

RUN rm -r docker

ENTRYPOINT [ "serverless" ]

CMD ["deploy"]