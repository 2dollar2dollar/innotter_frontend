FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
CMD ["npm", "start"]

FROM development AS builder

ARG AUTH_API_URL
ARG POSTS_API_URL

ENV REACT_APP_AUTH_API_URL=$AUTH_API_URL
ENV REACT_APP_POSTS_API_URL=$POSTS_API_URL
ENV AUTH_API_URL=$AUTH_API_URL
ENV POSTS_API_URL=$POSTS_API_URL

RUN echo "AUTH_API_URL=$AUTH_API_URL" > .env && \
    echo "POSTS_API_URL=$POSTS_API_URL" >> .env && \
    echo "REACT_APP_AUTH_API_URL=$AUTH_API_URL" >> .env && \
    echo "REACT_APP_POSTS_API_URL=$POSTS_API_URL" >> .env

RUN npm run build

FROM nginx:alpine AS production

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
