FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Exposer le port
EXPOSE 3000

# Lancer la migration puis le serveur
CMD ["sh", "-c", "npx prisma migrate deploy && npx ts-node api/app.ts"]
