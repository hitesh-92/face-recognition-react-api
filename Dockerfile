FROM node:12.3.1

WORKDIR /usr/src/face-recognition

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]
