var trumpet = require("trumpet")
var fs = require("fs")
var path = require("path")
var index = fs.createReadStream("index.html")
var companies = fs.readdirSync(__dirname + "/data")

// pick 4 at random
var select = []
while (select.length < 4 && companies.length) {
  var i = Math.floor(Math.random() * companies.length)
  if (i === companies.length) continue
  select.push(companies[i])
  companies.splice(i, 1)
}

var html = select.map(function (company) {
  var compdir = path.resolve(__dirname, "data", company)
  var quote = path.resolve(compdir, "quote.html")
  var logo = path.relative(process.cwd(), compdir) + "/logo.png"
  return '<li class="' + company + '">' +
    '<img src="' + logo + '" alt="logo">' +
    fs.readFileSync(quote) +
    '</li>'
}).join("\n")

index.pipe(trumpet())
.select("div#quotes ul", function (ul) {
  ul.update(function () { return html })
})
.pipe(fs.createWriteStream(".index.html"))
.on("close", function () {
  fs.rename(".index.html", "index.html")
})
