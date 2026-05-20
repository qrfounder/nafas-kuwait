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
# Build context must be the **repository root** (Easypanel, CI). For local compose see docker-compose.yml.
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
