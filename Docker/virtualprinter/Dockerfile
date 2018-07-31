FROM node:10.6.0
#FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 9100
EXPOSE 161
EXPOSE 5000
CMD [ "npm", "start" ]
