FROM gcc:14

RUN useradd -m runner

COPY run.sh /run.sh

RUN chmod +x /run.sh

USER runner

WORKDIR /workspace

ENTRYPOINT ["/run.sh"]