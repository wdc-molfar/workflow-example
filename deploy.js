const {Container}  = require("@molfar/csc")
const { yaml2js } = require("@molfar/amqp-client")
const path = require("path")
const fs = require("fs")

const DEPLOYMENT_DIR = path.resolve("./.deployment")

const run = async () => {
	const spec = yaml2js( fs.readFileSync("./workflow.msapi.yaml").toString())

	const repos = spec.workflow
					.filter( i => i.instance.of.repo)
					.map( i => i.instance.of.repo)

	console.log(repos)
	const container = new Container()


	for( let i=0; i < repos.length; i++){
		const deployedServicePath = await container.deploy(repos[i], DEPLOYMENT_DIR)
		console.log(`Repo ${repos[i]} is deployed into ${deployedServicePath}`)
	}
}	

run()

