var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function (request, response) {
    let _url = request.url;
    const myURL = new URL(`http://localhost:8800${_url}`);
    // var queryData = url.parse(_url, true).query;
    const queryData = myURL.searchParams.get('id');
    const pathname = myURL.pathname;

    if (pathname === '/') {
        if (queryData === null || queryData === undefined) {
            fs.readdir('./data', function (error, filelist) {
                let title = 'Welcome';
                let description = 'Hello, Node.js';
                let list = '<ul>';
                let i = 0;
                while (i < filelist.length) {
                    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i = i + 1;
                }
                list = list + '</ul>';

                let template = `
                <!doctype html>
                    <html>
                    <head>
                        <title>WEB1 - ${title}</title>
                        <meta charset="utf-8">
                    </head>
                    <body>
                        <h1><a href="/">WEB</a></h1>
                        ${list}
                        <h2>${title}</h2>
                        <div>${description}</div>
                    </body>
                </html>
                `;
                response.writeHead(200);
                response.end(template);
            });
        } else {
            fs.readdir('./data', function (error, filelist) {
                let list = '<ul>';
                let i = 0;
                while (i < filelist.length) {
                    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i = i + 1;
                }
                list = list + '</ul>';
                fs.readFile(`data/${queryData}`, 'utf8', function (err, description) {
                    let title = queryData;
                    let template = `
                    <!doctype html>
                        <html>
                        <head>
                            <title>WEB1 - ${title}</title>
                            <meta charset="utf-8">
                        </head>
                        <body>
                            <h1><a href="/">WEB</a></h1>
                            ${list}
                            <h2>${title}</h2>
                            <div>${description}</div>
                        </body>
                    </html>
                    `;
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    } else {
        response.writeHead(404);
        response.end('Not found')
    }

});
app.listen(8800);