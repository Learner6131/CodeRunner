FROM node:22-alpine

RUN adduser -D runner

WORKDIR /workspace

COPY run.sh /run.sh

RUN chmod +x /run.sh

USER runner

ENTRYPOINT ["/run.sh"]