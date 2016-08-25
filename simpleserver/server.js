const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const mimeTypes = {
	"html": "text/html",
	"jpeg": "image/jpeg",
	"jpg": "image/jpg",
	"png": "image/png",
	"js": "text/javascript",
	"css": "text/css"
};

http.createServer(function(req, res){
	var uri = url.parse(req.url).pathname; 	//The URL.PARSE() method takes a URL string, parses it, and returns a URL object.

											//The PATHNAME property consists of the entire path section of the URL. This is everything 
											//following the host (including the port) and before the start of the query or hash components, 
											//delimited by either the ASCII question mark (?) or hash (#) characters.

											//req – объект запроса («request»), то есть то, что прислал клиент (обычно браузер), из него читаем данные.

	var fileName = path.join(process.cwd(), unescape(uri));
											//The PATH.JOIN() method join all given path segments together using the platform specific 
											//separator as a delimiter, then normalizes the resulting path.

											//The PROCESS.CWD() method returns the current working directory of the Node.js process.

											//Устаревший метод UNESCAPE(str) создает новую строку в которой шестнадцатиричная последовательность 
											//симоволов вида %xx заменяется эквивалентами из кодировки ASCII. Знаки, закодированные в формате %uxxxx 
											//(знаки Юникода), заменяются знаками Юникода в шестнадцатеричной кодировке xxxx.
	console.log('Loading ' + uri);

	var stats;
	try{
		stats = fs.lstatSync(fileName);		//fs.lstatSync(path) - Synchronous''', Returns an instance of fs.Stats
											//fs.Stats - class, Objects returned from fs.stat()
	} catch(e){
		res.writeHead(404, {'Content-type':'text/plain'});
											//res – объект ответа («response»), в него пишем данные в ответ клиенту.
												//вызов res.writeHead(HTTP-код, [строка статуса], {заголовки}) пишет заголовки.
												//вызов res.write(txt) пишет текст в ответ.
												//вызов res.end(txt) – завершает запрос ответом.
		res.write('404 Not Found\n');
		res.end();
		return;
	}

	if(stats.isFile()){
		var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
		res.writeHead(200, {'Content-type': mimeType});

		var fileStream = fs.createReadStream(fileName);
											//fs.createReadStream(path[, options]) - Returns a new ReadStream object, ReadStream is a Readable Stream
		fileStream.pipe(res);				//EThe 'pipe' event is emitted when the stream.pipe() method is called on a readable stream, adding this 
											//writable to its set of destinations.
	} else if(stats.isDirectory()){
		res.writeHead(302, {
			'Location': 'index.html'
		})
		res.end();
	} else{
		res.writeHead(500, {'Content-type': 'text/plain'});
		res.write('500 Internal Error\n');
		res.end();
	}
}).listen(1337);