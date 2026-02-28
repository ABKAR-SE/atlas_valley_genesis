FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
COPY contracts/package*.json ./contracts/
RUN npm install
COPY . .
EXPOSE 5173 4000 8545
CMD ["npm","run","dev"]
