---
title: "TerraLog"
link: "https://terralog.app"
date: "2024-06-17"
description: "An iPhone app to share location based satellite messages with friends and family while off the grid - it supports weather forecasts over satellite too."
---

<style>
    @media (max-width: 768px) {
        .image-row {
            flex-direction: column !important;
            margin: 2em -10vw !important;
            height: 1000px;
            overflow: none;
        }
        .image-desktop {
          display: none;
        }
        img {
          flex: 1;
          max-height: 100%
        }
    }
</style>
<div class="image-row" style="display: flex; justify-content: center; gap: 2%; height: 500px; margin: 2em -10vw;">
  <img src="/terralog-mobile.png" alt="TerraLog Mobile" style="flex: 1; object-fit: contain;" />
  <img class="image-desktop" src="/terralog.png" alt="TerraLog Desktop" style="flex: 1; object-fit: contain;" />
</div>

<!-- ![](/terralog.png) -->

[TerraLog](https://terralog.app/) is a mobile app that lets you share location based messages with friends and family while you're off the grid using just your iPhone.

# Inspiration

After following along as a friend climbed Denali using her Garmin inReach, and the release of [Apple's Satellite Messaging](https://support.apple.com/en-us/120930) feature I realized it wouldn't be that hard to recreate similar functionality using just an iPhone.

# Details

In addition to being able to share location based messages on a map users can also request weather and avalanche forecasts over satellite so they can stay up to date with the latest conditions while off the grid.

# Technologies used

- React
- Next.js
- React Native
- Expo
- PostgreSQL
