import express from 'express'
import { logger } from './logger.js'

const app = express();
const PORT = parseInt(process.argv[2]) || 8081;

const renderServerData =(req, res) => {
  res.status(200).send(`
    <div style="padding: 1.5rem 3rem">
      <h1>
        Bienvenido
      </h1>
      <h3>
        Servidor express <span style="color:blueviolet;">(Nginx)</span>
      </h3>
      <h5>
        ${ new Date().toLocaleString()}
      </h5>
      <table>
        <tablebody>
          <tr>
            <td>Puerto</td>
            <th>${PORT}</th>
          </tr>
          <tr>
            <td>PID</td>
            <th>${process.pid}</th>
          </tr>
        </tablebody>
      </table>
    <div>
  `);
}

app.get("/", renderServerData);
app.get("/api/random", renderServerData);

app.listen(PORT, () => {
  logger.info(`Server running on PORT: ${PORT}`);
})