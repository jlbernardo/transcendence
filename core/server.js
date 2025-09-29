import Fastify from 'fastify';
import SqlBricks from 'sql-bricks';
import { DatabaseSync } from "node:sqlite";

async function startServer() {
	const fastify = Fastify({
		logger: true
	});

	const database = new DatabaseSync('/core/db/db1');

	const insert = database.prepare('INSERT INTO tb1 (nick, age) VALUES (?, ?)');

	fastify.post('/', async function handler(request, reply) {
		const { nick, age } = request.body;
		insert.run(nick, age);
		return { status: 'ok' };
	});

	fastify.get('/', async function handler(request, reply) {
		const query = database.prepare('SELECT * FROM tb1');
		console.log(query.all());
		return query.all();
	});

	fastify.delete('/', async function handler(request, reply) {
		const { nick } = request.body;
		const deleteStmt = database.prepare('DELETE FROM tb1 WHERE nick = ?');
		deleteStmt.run(nick);
		return { status: 'ok' };
	});

	try {
		await fastify.listen({ host: "0.0.0.0", port: 3000 });
	}
	catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}

startServer();
