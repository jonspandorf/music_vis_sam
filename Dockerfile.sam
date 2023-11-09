FROM public.ecr.aws/sam/build-python3.9:1.95.0-20230810182727 

RUN curl https://download.docker.com/linux/static/stable/x86_64/docker-24.0.5.tgz -o docker.tgz

RUN tar xzvf docker.tgz 

RUN cp docker/* /usr/bin/

RUN rm -r docker

