FROM node:18-alpine

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --only=prod --silent
COPY . .

CMD npm run dev

EXPOSE 8000
