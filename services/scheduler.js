 const { ServiceWrapper } = require("@molfar/csc")
 const { AmqpManager, Middlewares, yaml2js} = require("@molfar/amqp-client")
 const fs = require("fs")
 const path = require("path")

 let service = new ServiceWrapper({
 	publisher: null,
 	config: null,
 	
 	async onConfigure(config,resolve){
 		this.config = config
	 	console.log(`configure ${ this.config._instance_name || this.config._instance_id}`)
        
	 	this.publisher = await AmqpManager.createPublisher(this.config.service.produce)
	 	
	 	await this.publisher.use([
		    Middlewares.Schema.validator(this.config.service.produce.message),
		    Middlewares.Error.BreakChain,
		    Middlewares.Json.stringify
		])
	 	
		resolve({status: "configured"})
	
 	},

	onStart(data,resolve){
 		
 		console.log(`start ${ this.config._instance_name || this.config._instance_id}`)
        
 		let channels = yaml2js(fs.readFileSync(path.resolve(__dirname, "./tg-channels.yaml")).toString()).url
 		channels.forEach( url => {
 			this.publisher.send({type:"telegram", url})
		})
 		
 		console.log(`${ this.config._instance_name || this.config._instance_id} > initiate ${channels.length} tasks`)
 		
		resolve({status: "started"})	
 	},

 	async onStop(data,resolve){
		console.log(`stop ${ this.config._instance_name || this.config._instance_id}`)
        await this.publisher.close()
		
		resolve({status: "stoped"})

	}

 })

 service.start()

