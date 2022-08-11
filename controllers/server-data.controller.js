export const getServerData = async (req, res) => {
  console.log('> Getting server data')

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


  // console.log('ejec', ejec)
  
  const datos = {
    platform: process.platform,
    node_version: process.version,
    node: nodeExe,
    memory: process.memoryUsage().rss,
    arguments: args,
    exeFile: file,
    directory: process.cwd(),
    pid: process.pid
  }
  // console.log( 'datos', datos);

  return res.render('server-data', { data: datos })

}