import Fastify from 'fastify'

const fastify = Fastify({
	logger: true
})

fastify.get('/', async function handler(request, reply) {
	return { hello: 'world' }
})

try {
	await fastify.listen({ port: 4242 })
}
catch (err) {
	fastify.log.error("uh oh:", err)
	process.exit(1)
}
