const server_manifest = require('./manifest/server_manifest.json')
const fastify = require('fastify')(server_manifest.fastify_options)
//fastify.register(require('fastify-formbody'))
//fastify.register(require('fastify-multipart'))
//fastify.addContentTypeParser('*', function (request, payload, done) {done()})
fastify.register(require('fastify-cors'))
const get_file_routes = require('./routes/')
get_file_routes.forEach((route)=>{fastify.route(route)})

//listening to port : ( process.env.PORT || server_manifest.port)
fastify.listen(( process.env.PORT || server_manifest.port))