FROM node:16.0.0



# private only
EXPOSE 80
EXPOSE 3000

#copying requirement directory
ADD /public /home/ui/public
ADD /src /home/ui/src

#Copying all file

COPY /package-lock.json /home/ui/package-lock.json
COPY /package.json /home/ui/package.json


# Set the default directory where CMD will execute
WORKDIR /home/ui

#RUN npm install -g npm
RUN npm install
RUN npm run build

CMD [ "npm", "run", "start" ]