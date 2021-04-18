var http = require('http');
var fs = require('fs');
var url = require('url');
let qs = require('querystring');

var template = require('./lib/template.js');

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
                let list = template.list(filelist);
                let html = template.HTML(title, list, `
                    <h2>${title}</h2>
                    <div>${description}</div>`,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        } else {
            fs.readdir('./data', function (error, filelist) {
                fs.readFile(`data/${queryData}`, 'utf8', function (err, description) {
                    let title = queryData;
                    let list = template.list(filelist);
                    let html = template.HTML(title, list, `
                        <h2>${title}</h2>
                        <div>${description}</div>`,
                        `<a href="/create">create</a>
                         <a href="/update?id=${title}">update</a>
                         <form action="delete_process" method="post">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                         </form>`
                    );
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if (pathname === '/create') {
        fs.readdir('./data', function (error, filelist) {
            let title = 'WEB - create';
            let list = template.list(filelist);
            let html = template.HTML(title, list, `
                <form action="/create_process" method="post">
                    <p>
                        <input type="text" name="title" placeholder="title">
                    </p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
            `, '');
            response.writeHead(200);
            response.end(html);
        });
    } else if (pathname === '/create_process') {
        let body = '';
        request.on('data', function (date) {
            body = body + date;
        });
        request.on('end', function () {
            let post = qs.parse(body);
            let title = post.title;
            let description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf-8', function (err) {
                response.writeHead(302, { Location: `/?id=${title}` });
                response.end();
            });
        });
    } else if (pathname === '/update') {
        fs.readdir('./data', function (error, filelist) {
            fs.readFile(`data/${queryData}`, 'utf8', function (err, description) {
                let title = queryData;
                let list = template.list(filelist);
                let html = template.HTML(title, list, `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <p>
                            <input type="text" name="title" placeholder="title" value="${title}">
                        </p>
                        <p>
                            <textarea name="description" placeholder="description">${description}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    } else if (pathname === '/update_process') {
        let body = '';
        request.on('data', function (date) {
            body = body + date;
        });
        request.on('end', function () {
            let post = qs.parse(body);
            let id = post.id;
            let title = post.title;
            let description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function (err) {
                fs.writeFile(`data/${title}`, description, 'utf-8', function (err) {
                    response.writeHead(302, { Location: `/?id=${title}` });
                    response.end();
                });
            })
        });
    } else if (pathname === '/delete_process') {
        let body = '';
        request.on('data', function (date) {
            body = body + date;
        });
        request.on('end', function () {
            let post = qs.parse(body);
            let id = post.id;
            fs.unlink(`data/${id}`, function (error) {
                response.writeHead(302, { Location: `/` });
                response.end();
            })
        });
    } else {
        response.writeHead(404);
        response.end('Not found')
    }

});
app.listen(8800);