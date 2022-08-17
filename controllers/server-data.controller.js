import os from 'os'
const numCpus = os?.cpus()?.length

export const getServerData = async (req, res) => {
  console.log('> Getting server data')
  console.log("numCpus: ", numCpus);

  let args = [...process.argv]
  
  // console.log('> total args:', process.argv)
  let nodeExe = args.shift();
  // console.log('> node: ', nodeExe)
  // console.log('> nodeVersion: ', process.version)
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