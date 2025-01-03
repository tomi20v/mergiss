FROM node:22-alpine

#EXPOSE 8080

#RUN npm install -g @vue/cli

#RUN npm install -g @vue/cli-service-global

# serve is used in prod to serve static files
#RUN npm install -g serve

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
RUN npm ci

COPY . .
RUN npm run build
#RUN npm prune --production

#CMD [ "npm", "run", "serve:storybook" ]
CMD [ "/bin/ash" ]
