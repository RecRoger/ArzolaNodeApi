# Coderhouse Node Api

Aplicacion de ejercicio de curso de Node.

## Scripts

- `npm run start` para levantar el servidor
- `npm run dev` para correr el servidor con nodemon
- `npm run axios` para correr el rapido cliente de pureba de la Api Productos al server de heroku
- `npm run test` para correr los test de Mocha sobre la Api productos de produccion

## Enviroment variables

| Varriables           | descriptions          |
| :------------------- | :-------------------- |
| `DB_SECRET_USER`     | Mongo Db User         |
| `DB_SECRET_PASSWORD` | Secret db password    |
| `SESSION_SECRET_KEY` | Secret session key    |
| `ADMIN_MAIL`         | Admin email           |
| `ADMIN_MAIL_PASS`    | Admin email password  |
| `ADMIN_PHONE`        | Admin validated Phone |
| `TWILIO_ACCOUNT_SID` | Twilio credentials    |
| `TWILIO_AUTH_TOKEN`  | Twilio credentials    |