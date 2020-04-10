FROM node:lts-alpine3.9
ARG VERSION=1.0
LABEL maintainer="Miguel Olave <molavec@gmail.com>" \
      version="${VERSION}-lts-alpine3.9"
COPY . /app
WORKDIR /app
RUN npm install --only=prod --no-package-lock --no-shrinkwrap --no-optional
CMD ["npm", "start"]