FROM node:12-alpine
EXPOSE 8300
WORKDIR /app

# Add local files
COPY package*.json /app/
COPY server.js /app/
COPY dist /app/dist

RUN npm install --quiet

ENTRYPOINT ["node", "server.js"]
