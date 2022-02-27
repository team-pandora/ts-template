FROM node:13.12-alpine

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production=false --silent
COPY . .

CMD npm run dev

EXPOSE 8000
