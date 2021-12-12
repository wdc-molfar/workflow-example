const {Container}  = require("@molfar/csc")
const { yaml2js } = require("@molfar/amqp-client")
const path = require("path")
const fs = require("fs")

const DEPLOYMENT_DIR = path.resolve("./.deployment")

const run = async () => {
	const spec = yaml2js( fs.readFileSync("./workflow.msapi.yaml").toString())

	const services = spec.workflow
	services.reverse()
					
	const container = new Container()

	for( let i=0; i < services.length; i++){
		
		container.hold(path.resolve(__dirname, services[i].instance.of.path), services[i].instance.of.name)
	
		const worker = await container.startInstance(container.getService(s => s.name == services[i].instance.of.name))
		let res = await worker.configure( { service:services[i].instance.of } )
		// console.log(res)
		

		res = await worker.start()
		// console.log(res)
	}

}	

run()

