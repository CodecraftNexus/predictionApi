FROM node:18

WORKDIR /app

COPY package*.json ./
COPY dist ./dist

# If you have any dependencies
RUN npm install --production

CMD ["node", "dist/app.js"]







