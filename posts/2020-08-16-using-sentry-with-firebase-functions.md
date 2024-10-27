---
title: "Using Sentry with Firebase Functions"
date: "2020-08-16"
---

I integrated [Sentry](https://sentry.io/) into the front end of a couple of web applications I've been developing and I fell in love. It was so easy to get reports of unexpected errors users were encountering on the fly. So much so that I thought to myself maybe I should not catch ANY error so they automatically show up in Sentry's console. Just kidding this is not a good idea (you can catch and log errors to sentry for more graceful handling).

I was so delightful that I wanted the same for my backend. The two apps in question made use of Firebase Cloud Functions for their "backend".

Sadly configuring Sentry.io was not as simple as with my frontend (React) code.

Just look at [this nearly year old issue](https://github.com/getsentry/sentry-javascript/issues/2122) where Sentry's usage within Google Cloud Functions is discussed (underlying technology that powers Firebase Functions).

Far down there is a comment that offers a glimmer of hope and offers this setup snippet to be included in the index.ts/js of your functions root:

```js
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const sentry = require("@sentry/node");

/**
 * Set up Sentry for error reporting
 */
if (functions.config().sentry && functions.config().sentry.dsn) {
  sentry.init({ dsn: functions.config().sentry.dsn });
} else {
  console.warn(
    "/!\\ sentry.dsn environment variable not found. Skipping setting up Sentry..."
  );
}
```

This requires setting a config variable using the firebase cli:

```shell
firebase functions:config:set sentry.dsn="<DSN>"
```

You can find your DSN in the Sentry dashboard under

```
Settings>PROJECT_NAME>Client Keys>DSN
```

Sadly this does NOT enable sentry to catch unhandled exceptions, but you can log caught exceptions like this:

```javascript
const Sentry = require("@sentry/node");
...
try {
  const uid = req.query.uid as string;
  const webhookData: WebhookData = req.body;
  const result = await plaidWebhookTrigger(uid, webhookData);
  return resp.json(result);
}
catch (error) {
  sentry.captureException(error);
  return resp.status(500).json({ error })
}
```

Then you'll get a beautiful report on the Sentry dashboard and it'll go as far as to show you which exact line of code threw the exception: This solution requires you to wrap the body of each of your functions in a try/catch block so that you can report each error to sentry before rethrowing it (so that firebase also know the function failed).

## Reusable wrapper function

Instead of explicitly using a try/catch block each time you can also define a wrapper function that will take care of this for you and reduce a bit of boilerplate on each function. Here's what it might look like:

```javascript
const wrapAndReport =
  (fn) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (e) {
      Sentry.captureException(e);
      await Sentry.flush(2000);
      throw e;
    }
  };
```

Used like this:

```javascript
const myFirebaseFunction = functions.https.onRequest(
  wrapAndReport(async (req, resp) => {
    throw Error("test error");
  })
);
```

Again because you have to remember to wrap all of your Firebase Functions this solution is not as optimal as Sentry used in the browser, but it does save you from writing the same try/catch + Sentry code over and over again.
