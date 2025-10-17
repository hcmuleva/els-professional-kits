FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

# Expose the port your consumer runs on (e.g. 3000)
EXPOSE 3000

CMD ["npm", "test"]
