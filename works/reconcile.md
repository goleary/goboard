---
title: "Reconcile"
link: "https://reconcile.app"
date: "2020-05-12"
description: "Turn your credit card & bank transactions into Splitwise expenses."
---

![](https://www.datocms-assets.com/19855/1581121713-combined.png?auto=compress%2Cformat&dpr=0.19&fm=jpg&w=3188)

Yet another feature for someone else's application :)

# Inspiration

I hated the manual step of copying credit card transaction details (price, location, date etc.) from my statement over to splitwise for meals shared with my gf & other friends...so I built a solution to this problem.

# Details

Reconcile uses [Plaid](https://plaid.com/) to access user's credit card & bank transactions and displays them in a React based web application. The user can then select specific transactions and which friend or group on splitwise to split them with.

# Technologies used

- React
- Redux
- Firebase
  - Firestore (database)
  - Functions - to perform 3rd party data fetching & also create a webhook that listens to new transactions as they come in.
- Plaid API & Webhooks
- Netlify
- Splitwise (API)
