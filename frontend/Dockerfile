# STAGE 1: The Node.js environment
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Keep this here for dev
EXPOSE 5173 

# STAGE 2: The Production build
FROM development AS build
RUN npm run build

# STAGE 3: The Nginx environment (No Node.js here!)
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]