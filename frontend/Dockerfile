FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_API_URL=http://localhost:3001
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
