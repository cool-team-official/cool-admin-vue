FROM node:lts-alpine
WORKDIR /build
RUN npm config set sass_binary_site=https://npm.taobao.org/mirrors/node-sass 
RUN npm set registry https://registry.npm.taobao.org
COPY package.json /build/package.json
RUN npm install
COPY ./ /build
RUN npm run build

FROM nginx
RUN mkdir /app
COPY --from=0 /build/dist /app
COPY --from=0 /build/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80