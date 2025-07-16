# Dockerfile - FRONT
# Étape 1 : Build Vite
FROM node:20.13.1-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2 : Serveur statique avec nginx
FROM nginx:1.25-alpine

# Ajoute la conf Nginx pour gérer le fallback React
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie les fichiers Vite construits
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]