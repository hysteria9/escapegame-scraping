const puppeteer = require("puppeteer");
const fs = require("fs");

const URL = "https://www.escapegame.fr/";
const location = "france";

const getRooms = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL + location, {
      waitUntil: "networkidle2",
    });
    const cities = await page.evaluate(() => {
      return [...document.querySelectorAll(".all_city_list > li")].map(
        (city) => {
          return {
            href: city.querySelector("a").getAttribute("href"),
            cityFullName: city.querySelector("a").textContent,
            city: city
              .querySelector("a")
              .getAttribute("href")
              .split(".fr/")[1]
              .slice(0, -1),
          };
        }
      );
    });
    //console.log(cities);
    //await browser.close();

    for (let index = 0; index < cities.length; index++) {
      await getRoomsPerCities(browser, cities[index]);
    }
    await browser.close();
  } catch (error) {
    console.error(error);
  }
};

const saveToFile = (data, city) => {
  try {
    fs.writeFile(
      `./data/${city}_rooms.json`,
      JSON.stringify(data),
      "utf8",
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const getRoomsPerCities = async (browser, dataCity) => {
  try {
    const { href, cityFullName, city } = dataCity;
    //const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(href, {
      waitUntil: "networkidle2",
    });
    const rooms = await page.evaluate(() => {
      return [...document.querySelectorAll("#jsRooms > .card-room")].map(
        (element) => {
          return {
            brand:
              element.querySelector(".card-room-brand") &&
              element.querySelector(".card-room-brand").textContent,
            name:
              element.querySelector(".card-title > a") &&
              element.querySelector(".card-title > a").textContent,
            description:
              element.querySelector(".room-summary") &&
              element.querySelector(".room-summary").textContent.trim(),
            snooping:
              element.querySelector(".room-snooping") &&
              Number(
                element
                  .querySelector(".room-snooping")
                  .textContent.trim()
                  .split(" ")[0]
                  .slice(0, -1)
              ),
            handling:
              element.querySelector(".room-handling") &&
              Number(
                element
                  .querySelector(".room-handling")
                  .textContent.trim()
                  .split(" ")[0]
                  .slice(0, -1)
              ),
            thinking:
              element.querySelector(".room-thinking") &&
              Number(
                element
                  .querySelector(".room-thinking")
                  .textContent.trim()
                  .split(" ")[0]
                  .slice(0, -1)
              ),
            rating:
              element.querySelector(".rating-full") &&
              Number(
                (
                  Number(
                    element
                      .querySelector(".rating-full")
                      .getAttribute("style")
                      .split(" ")[1]
                      .slice(0, -3)
                  ) / 17
                ).toFixed(1)
              ),
            userRating:
              element.querySelector(".user-rating") &&
              Number(
                element
                  .querySelector(".user-rating")
                  .textContent.trim()
                  .split("%")[0]
              ),
            thumbnail:
              element.querySelector(".card-room-hero-image") &&
              element
                .querySelector(".card-room-hero-image")
                .getAttribute("data-src")
                .split("?")[0],
            domain:
              element.querySelector(".card-title > a") &&
              element.querySelector(".card-title > a").getAttribute("href"),
            roomSpecs:
              element.querySelector(".room-specs li") &&
              [...element.querySelectorAll(".room-specs li")].map((spec) => {
                const key = spec.innerText.trim().split("\n")[0];
                const value = spec.innerText.trim().split("\n")[1];
                return {
                  [key]: value,
                };
              }),
          };
        }
      );
    });
    //console.log("titre : " + title);

    saveToFile(rooms, city);
  } catch (error) {
    console.error(error);
  }
};

getRooms();
