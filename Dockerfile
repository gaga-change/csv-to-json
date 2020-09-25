FROM node:10-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", ".npmrc", "./"]
RUN npm install
COPY . .
EXPOSE 8720
CMD npm run start