FROM python:3.12-slim

RUN useradd -m runner

WORKDIR /workspace

COPY run.sh /run.sh

RUN chmod +x /run.sh

USER runner

ENTRYPOINT ["/run.sh"]