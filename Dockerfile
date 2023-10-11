FROM node:18-alpine

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --omit=dev --silent
COPY . .

CMD npm run dev

EXPOSE 8000
