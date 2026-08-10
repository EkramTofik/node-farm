const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
// Synchronuos and non blocking code
// const input = fs.readFileSync("./text/input.txt", "utf-8");
// console.log(input);
// const outPut = `This is what we know about Node Js ${input}.\n Created on ${new Date().toLocaleTimeString(
//   "en-US",
//   {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "numeric",
//     minute: "2-digit",
//   },
// )}`;
// fs.writeFileSync("./text/writeFile.txt", outPut);
// console.log("File Written Successfuly");

//Asynchronous and Non Blocking Code and Callback Hell🔥
// fs.readFile("./text/start.txt", "utf-8", (error, data1) => {
//   if (error) return console.log("ERROR!🔥");
//   fs.readFile(`./text/${data1}.txt`, "utf-8", (error, data2) => {
//     if (error) return console.log("ERROR!🔥");
//     fs.writeFile("./text/final.txt", `${data1}\n${data2}`, "utf-8", (error) => {
//       console.log(error);
//     });
//   });
// });
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8",
);
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8",
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8",
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join("");
    const output = templateOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(output);
    //Product page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);
    //API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);
    //Not found
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-header": "hello-world",
    });
    res.end("<h1>Page Not Found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests from port 8000");
});
