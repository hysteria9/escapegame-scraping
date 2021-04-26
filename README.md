# Escape-game.fr - Web Scraping

## Description of the exercise
The goal was to scrap data from this link [https://www.escapegame.fr/france/](https://www.escapegame.fr/france/). This webpage gathers every escape-game rooms located in France and categorized by city. 


## Description of the program
The program contains 3 functions:
`getRooms()`, `saveToFile()` and `getRoomsPerCities()`.


### `getRooms()`
This is the main function. It deploys an headless browser using [`puppeteer`](https://github.com/puppeteer/puppeteer). An object array named `cities` collects the url, the abreviated name and the real name of every city displayed.
Then, it calls the function `getRoomsPerCities()` for every city.


### `getRoomsPerCities(browser, dataCity)`
The browser instance and the `cities` are given by `getRooms()`. This function collects an object containing all rooms data from the given city.
The outcoming object (only keys are represented): 
```json
    {
        "brand",
        "name",
        "description",
        "snooping",
        "handling",
        "thinking",
        "rating",
        "userRating",
        "thumbnail",
        "domain",
        "roomSpecs"
    }

```


### `saveToFile(data, city)`
The arguments are given by the function `getRoomsPerCities()`. Data contains all rooms data of the (also given) city. This function transforms the incoming object into a JSON file. A single JSON file is generated per cities.


## Try it out !
To try it, clone the repository: 
```
git clone https://github.com/anthonyrovira/escapegame-scraping.git
```

Install dependencies:
```
npm install
```

Then, run it :
```
npm start
```