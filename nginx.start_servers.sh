## Comandos de PM2 para levantar los servidores
## se puede ejecutar desde la raiz de con ./nginx.start_servers.sh

pm2 start nginx.server.js --name=single_service -- 8080
pm2 start nginx.server.js --name=service1 -- 8082
pm2 start nginx.server.js --name=service2 -- 8083
pm2 start nginx.server.js --name=service3 -- 8084
pm2 start nginx.server.js --name=service4 -- 8085