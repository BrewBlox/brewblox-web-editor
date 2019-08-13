FROM brewblox/rpi-node:10-alpine
EXPOSE 8300
WORKDIR /app

# Add Tini
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini

# Add local files
COPY package*.json /app/
COPY server.js /app/
COPY dist /app/dist

RUN npm install --quiet && chmod +x /tini

ENTRYPOINT ["/tini", "--"]
CMD [ "node", "server.js" ]
