const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const shortId = require("shortid");
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

async function getItems() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://tftactics.gg/item-builder");

    await page.waitForSelector(".characters-item", { timeout: 3000 });
    const content = await page.content();

    const selector = cheerio.load(content);

    const searchResults = selector("body")
      .find("section[class='container item-builder']")
      .find("div[class='col-12 col-lg-3 sidebar']")
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

    const data = characters.map((char, idx) => {
      if (idx < 9) {
        return Object.assign({}, char, {
          type: "base",
          id: shortId.generate(),
        });
      }
      return Object.assign({}, char, {
        type: "combined",
        id: shortId.generate(),
      });
    });

    console.log(data);

    const json = JSON.stringify(data);

    fs.writeFile("./data/items.json", json, "utf8", () => {
      console.log("success");
    });

    await browser.close();
  } catch (error) {
    console.log(error);
  }
}

getItems();
