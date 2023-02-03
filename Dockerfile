FROM node

# Install jq
RUN apt-get update && apt-get install jq -y

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
ENTRYPOINT ["npm", "start"]
