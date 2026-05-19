FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_API_URL=http://localhost:8000
ARG VITE_META_PIXEL_ID=
ARG VITE_TIKTOK_PIXEL_ID=
ARG VITE_SNAP_PIXEL_ID=
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_META_PIXEL_ID=$VITE_META_PIXEL_ID
ENV VITE_TIKTOK_PIXEL_ID=$VITE_TIKTOK_PIXEL_ID
ENV VITE_SNAP_PIXEL_ID=$VITE_SNAP_PIXEL_ID
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
