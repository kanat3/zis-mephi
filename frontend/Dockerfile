FROM node:25-alpine

COPY . /frontend

WORKDIR /frontend

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "3000"]