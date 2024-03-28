FROM node:lts-alpine
WORKDIR /build
# 设置npm镜像
RUN npm config set registry https://registry.npmmirror.com
COPY package.json /build/package.json
RUN npm install
COPY ./ /build
RUN npm run build

FROM nginx
RUN mkdir /app
COPY --from=0 /build/dist /app
COPY --from=0 /build/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
