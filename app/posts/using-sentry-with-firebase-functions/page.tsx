/* eslint-disable react/no-unescaped-entities */
const Post: React.FC = () => {
  return (
    <div className="max-w-4xl m-auto text-md py-6">
      <h1 className="text-3xl">Using Sentry with Firebase Functions</h1>
      <sub>Aug 16, 2020</sub>
      <p>
        I integrated Sentry into the front end of a couple of web applications
        I've been developing and I fell in love. It was so easy to get reports
        of unexpected errors users were encountering on the fly. So much so that
        I thought to myself maybe I should not catch ANY error so they
        automatically show up in Sentry's console. Just kidding this is not a
        good idea (you can catch and log errors to sentry for more graceful
        handling).
      </p>
      <p>
        I was so delightful that I wanted the same for my backend. The two apps
        in question made use of Firebase Cloud Functions for their "backend".
      </p>
      <p>
        Sadly configuring Sentry.io was not as simple as with my frontend
        (React) code.
      </p>
      <p>
        Just look at{" "}
        <a
          href="https://github.com/getsentry/sentry-javascript/issues/2122"
          target="_blank"
          className="text-blue-600 hover:text-blue-500"
        >
          this nearly year old issue
        </a>{" "}
        where Sentry's usage within Google Cloud Functions is discussed
        (underlying technology that powers Firebase Functions).
      </p>
      <p>
        Far down there is a comment that offers a glimmer of hope and offers
        this setup snippet to be included in the index.ts/js of your functions
        root:
      </p>
      <pre className="bg-slate-200 py-3 px-4 rounded my-2">
        <code>{`const admin = require("firebase-admin");
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
`}</code>
      </pre>
      <p>This requires setting a config variable using the firebase cli:</p>
      <pre className="bg-slate-200 py-3 px-4 rounded my-2">
        <code>{`firebase functions:config:set sentry.dsn="<DSN>"`}</code>
      </pre>
      <p>
        {` You can find your DSN in the Sentry dashboard under Settings>PROJECT_NAME>Client Keys>DSN.`}
      </p>
      <pre className="bg-slate-200 py-3 px-4 rounded my-2">
        <code>{`const Sentry = require("@sentry/node");
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
}`}</code>
      </pre>
      Then you'll get a beautiful report on the Sentry dashboard and it'll go as
      far as to show you which exact line of code threw the exception: This
      solution requires you to wrap the body of each of your functions in a
      try/catch block so that you can report each error to sentry before
      rethrowing it (so that firebase also know the function failed).
      <h2 className="py-6 text-2xl">Reusable wrapper function</h2>
      <p>
        Instead of explicitly using a try/catch block each time you can also
        define a wrapper function that will take care of this for you and reduce
        a bit of boilerplate on each function. Here's what it might look like:
      </p>
      <pre className="bg-slate-200 py-3 px-4 rounded my-2">
        <code>{`const wrapAndReport = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch (e) {
    Sentry.captureException(e);
    await Sentry.flush(2000);
    throw e;
  }
};`}</code>
      </pre>
      <p>Used like this:</p>
      <pre className="bg-slate-200 py-3 px-4 rounded my-2">
        <code>{`const myFirebaseFunction = functions.https.onRequest(
  wrapAndReport(async (req, resp) => {
    throw Error("test error");
  })
);`}</code>
      </pre>
      <p>
        Again because you have to remember to wrap all of your Firebase
        Functions this solution is not as optimal as Sentry used in the browser,
        but it does save you from writing the same try/catch + Sentry code over
        and over again.
      </p>
    </div>
  );
};
export default Post;
