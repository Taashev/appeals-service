FROM node:22.12.0

# Приложение будет работать на 3000 порту
EXPOSE 3000

# Создаем рабочую директоию
WORKDIR /app

# Копируем зависимости в проект
COPY ./package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем остальные файлы в проект
COPY ./ ./

# Собираем приложение
RUN npm run build

# Запускаем приложение
CMD npm run migrate:up && npm run start
