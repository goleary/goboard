---
title: "Pacific Northwest Predictive Current Map"
link: "/tools/current-map"
date: "2022-3-14"
description: "NOAA provides wonderful predictions of sea current strength & direction at many stations around the Puget Sound (and rest of the US), but they don't do the best job of presenting the data in a consumable form. I took their data & built an improved experience around it."
---

Because the Salish Sea (which includes the Puget Sound) is an inland ocean, it has a lot of water moving in and out of it every day as the tides rise and fall. This results in relatively intense & variable currents that depend on the topography of the earth and the depth of the water.

Last year I went on a paddling trip in the Puget Sound and wanted to be sure that we wouldn't get swept away or be fighting currents the entire time.

NOAA provides super cool predictions of sea current strength & direction at many stations around the Puget Sound (and rest of the US), but they don't do the best job of presenting the data in a consumable form. You can only look at the predictions for a single station at a time:

![](https://www.datocms-assets.com/19855/1647235545-screen-shot-2022-03-13-at-10-25-28-pm.png)

At the suggestion of my partner, Angela, I decided to take their data & present it in a somewhat more usable form. I pull the data for many stations at once and plot the strength & direction of the currents on the map at once:

![](https://www.datocms-assets.com/19855/1647233088-screen-shot-2022-03-13-at-9-44-24-pm.png)

I've included a time scrubber, so the user can look at what the currents will be doing over time.

Check it out [here](/tools/current-map).

This data is sure to be useful for open water swimmers, stand up paddlers, kayakers sailors & other types of boaters.

It currently only shows a subset of stations (to avoid overloading the NOAA API), but I'll update it to include more stations & even other regions of the US when I have time.

### Technologies Used

- React - frontend
- Leaflet - mapping
- Netlify - static hosting
- Node.js - backend code
- Express - simple server side framework
- Railway - backend host
