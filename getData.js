const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const fs = require("fs");

async function getChampAndItem() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://tftactics.gg/team-builder");

    await page.waitForSelector(".drag-zone", { timeout: 3000 });
    const content = await page.content();

    const selector = cheerio.load(content);

    const searchResults = selector("body")
      .find("section[class='builder container']")
      .find("div[class='drag-zone']")
      .find("img[class='character-icon']");

    const characters = searchResults
      .map((idx, el) => {
        const elementSelector = selector(el);
        return {
          url: elementSelector.attr("src").trim(),
          name: elementSelector.attr("alt").trim(),
        };
      })
      .get();

    console.log(characters);

    const json = JSON.stringify(characters);

    fs.writeFile("./characters.json", json, "utf8", () => {
      console.log("success");
    });

    await browser.close();
  } catch (error) {
    console.log(error);
  }
}

async function getOriginAndClass() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://tftactics.gg/champions");

    await page.waitForSelector(".filters-item", { timeout: 3000 });

    const content = await page.content();

    const selector = cheerio.load(content);

    const searchResults = selector("body").find(
      "div[class='d-none d-lg-block col-3 sidebar']"
    );

    const ocIcons = searchResults
      .find("img[class='filters-icon']")
      .map((idx, el) => {
        const elementSelector = selector(el);
        return {
          url: elementSelector.attr("src").trim(),
          name: elementSelector.attr("alt").trim(),
        };
      })
      .get();

    const json = JSON.stringify(ocIcons);

    fs.writeFile("./coinocicons.json", json, "utf8", () => {
      console.log("success");
    });

    await browser.close();
  } catch (error) {
    console.log(error);
  }
}

// getChampAndItem();
// getOriginAndClass();

const characters = require("./data/originandclass.json");
const shortid = require("shortid");

function addId() {
  const charactersWithId = characters.map(({ name }) => ({
    id: shortid.generate(),
    name,
  }));
  console.log(charactersWithId);

  const json = JSON.stringify(charactersWithId);

  fs.writeFile("./data/originandclass.json", json, "utf8", () => {
    console.log("success");
  });
}

addId();
