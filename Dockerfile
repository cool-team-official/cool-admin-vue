FROM node:lts-alpine
WORKDIR /build
# 设置Node-Sass的镜像地址
RUN npm config set sass_binary_site=https://npm.taobao.org/mirrors/node-sass/ 
# 设置npm镜像
RUN npm config set registry https://registry.npm.taobao.org
COPY package.json /build/package.json
RUN yarn
COPY ./ /build
RUN npm run build

FROM nginx
RUN mkdir /app
COPY --from=0 /build/dist /app
COPY --from=0 /build/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80