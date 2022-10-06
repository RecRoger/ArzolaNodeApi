import os from 'os'
import {logger} from '../commons/logger.js'
const numCpus = os?.cpus()?.length


export const getServerData = async (req, res) => {
  logger.info('> Getting server data')
  logger.info("numCpus: ", numCpus);

  let args = [...process.argv]
  
  // logger.info('> total args:', process.argv)
  let nodeExe = args.shift();
  // logger.info('> node: ', nodeExe)
  // logger.info('> nodeVersion: ', process.version)
  let file = null
  if(args && args.length) {
    let ejec = args.shift().split("\\");
    file = ejec[ejec.length - 1];
  }
  
  const datos = {
    platform: process.platform,
    node_version: process.version,
    node: nodeExe,
    memory: process.memoryUsage().rss,
    arguments: args,
    exeFile: file,
    directory: process.cwd(),
    pid: process.pid,
    numCpus: numCpus
  }

  return res.render('server-data', { data: datos })

}