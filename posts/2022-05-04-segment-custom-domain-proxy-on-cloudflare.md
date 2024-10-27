---
title: "Set up a Segment custom domain proxy using Cloudflare"
date: "2022-05-04"
---

One issue with using a tool like [Segment](https://segment.com) to track pageviews/user actions on the web is that more and more users are using browsers/extensions that block requests to 3rd party domains. This makes it hard to understand how many users are visiting your site and what they are doing on your site.

Segment offers a way to get around this. They allow you to set up a custom domain proxy for their resources/APIs. Instead of serving analytics.js from a Segment domain you can serve it from your own (sub)domain. This way your website will only have to communicate with your "backend" hosted on the same (sub)domain and the requests can be routed to Segment. This lessens the likliehood that these requests will be blocked.

Segment provides [instructions on how to set this up using Amazon CloudFront](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/custom-proxy/#cloudfront), but what if your using Cloudflare?

The setup on Cloudflare is pretty simple, but I wasn't able to find a guide anywhere and had to piece information together from multiple sources in order to get things working. Here's the guide I wish I had.

## Instructions

The trick is to use a [Cloudflare Worker](https://workers.cloudflare.com/). They have [an example](https://developers.cloudflare.com/workers/examples/bulk-origin-proxy) that gets you most of the way there.

### Create Cloudflare Worker

- goto the Cloudflare dashboard
- click on "Workers"
- click "Create a Service"
- give it a name like "analytics"
- click "Create service"
- click "Quick edit"
- paste in code from [example](https://developers.cloudflare.com/workers/examples/bulk-origin-proxy)
- update `ORIGINS` object to use your desired hosts (sub/domains)
- click "Save and Deploy"

Here's an example of what the worker code would look like for my website:

```js
/**
 * An object with different URLs to fetch
 * @param {Object} ORIGINS
 */
// TODO: update this object to use your desired subdomains
const ORIGINS = {
  "analytics-cdn.goleary.com": "cdn.segment.com",
  "analytics-api.goleary.com": "api.segment.io",
};

function handleRequest(request) {
  const url = new URL(request.url);
  // Check if incoming hostname is a key in the ORIGINS object
  if (url.hostname in ORIGINS) {
    const target = ORIGINS[url.hostname];
    url.hostname = target;
    // If it is, proxy request to that third party origin
    return fetch(url.toString(), request);
  }

  // Otherwise, process request as normal
  return fetch(request);
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
```

### Add Triggers to your Cloudflare Worker

- open the service you created in the previous step
- click "Triggers"
- add two routes like this: `analytics-cdn.goleary.com/*` & `analytics-api.goleary.com/*`
- DO NOT forget the trailing `*`. You need to make sure all requests to these subdomains are routed through your Worker.

### Add placeholder AAAA records for these subdomains

- Goto the DNS section of your website's dashboard
- Add two AAAA records:
- `AAAA analytics-api 100::`
- `AAAA analytics-cdn 100::`
- ensure that the two records above were created with the Cloudflare proxy turned on

`100::` is not a routable IP, but this record enables Cloudflare to handle the traffic directed at these subdomains and correctly route it to the Worker that we created.

## What next?

With all of this setup you should be good to go!

As called out in the [the Segment instructions](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/custom-proxy/#set-up), at this point you'll need to reach out to Segment in order to get the custom domain proxy feature turned on for your account. Waiting on them to respond will take far longer than the steps laid out above.
