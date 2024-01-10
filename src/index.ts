import { exit } from 'node:process';
import { createServer } from 'node:http';

import { lookup } from "./webhook.ts";



const server = createServer(async (request, response) => {
	const lookupResult = await lookup();

	response.writeHead(200, {"Content-Type": "text/html"});
	response.end(`Pong! ${lookupResult}`);

	if(lookupResult > 1) exit(0);
});

server.listen(8000, () => {
	console.log("Server is listening now.")
});