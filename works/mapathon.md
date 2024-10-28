---
title: "HERE Mapathon"
date: "2019-12-12"
description: "Took home 2nd place and $5k in a map-based data visualization competition against over 800 teams from around the globe"
---

![](https://www.datocms-assets.com/19855/1578374460-mapathon.png?auto=compress%2Cformat&fm=jpg)

I took data from the US Census Bureau on income & commute time by geography and combined them to come up with a dollar value for the time lost to commuting.

I used 3 different granularities of geographic region, Zip Codes, Counties, & Metro/Micropolitan areas to serve different zoome levels of the map.

## Technologies used

- [Mapshaper](https://github.com/mbloch/mapshaper)
- [Python with Pandas](https://pandas.pydata.org/)
- [HERE XYZ](https://www.here.xyz/)
  - Data Hub
  - CLI
  - [Space Invader](https://www.here.xyz/space-invader/)
- [Tangram](https://github.com/tangrams/tangram)
- [Leaflet.js](https://leafletjs.com/)
- [Svelte](https://svelte.dev/)

# Data used

- US Census Bureau American Community Survey (2017 5 year estimate)
- Bureau of Labor Statistics
