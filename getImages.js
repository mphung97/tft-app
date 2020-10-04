const axios = require("axios");
const fs = require("fs");
const characters = require("./characters.json");
const origin = require("./originandclass.json");
const items = require("./items.json");

async function download(url, path) {
  const name = url.split("/").pop();
  const imgPath = `./images/${path}/${name}`;
  const writer = fs.createWriteStream(imgPath);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

characters.forEach(({ url }) => {
  download(url, "characters");
});

origin.forEach(({ url }) => {
  download(url, "originandclass");
});

items.forEach(({ url }) => {
  download(url, "items");
});
