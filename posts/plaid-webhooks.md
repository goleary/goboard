---
title: "My experience with Plaid webhooks"
date: "2020-01-06"
---

I’ve been working on an application that makes use of Plaid to fetch users' financial transactions on their behalf. Their REST endpoint enables passing a window of time (start and end date) and returns all transactions for an account within that window. I store all of these transactions in a DB (Firebase Firestore to be exact) so that they don’t need to be fetched from Plaid every time my users access the App.

I was planning to implement a record for each user maintaing which dates their transactions had been fetch for, but then I realized Plaid offers webhooks where they will actually notify you in realtime once they have new transactions available to fetch.

It just requires building an endpoint in order to receive these requests and perform the work of fetching the transactions.

I figured this would be the perfect solution and enable me to reduce the complexity of my server code, and minimize duplicated work (storing & processing of already fetched transactions).

Complaints
Webhook requests don’t come with a unique id that allows me to ensure I haven’t already seen them. Plaid’s system will resend requests if they don’t get a 200 response within 10 seconds. I’ve noticed numerous instances of requests being resent even when my server responded within a few seconds.

I ended up creating a workaround on my end to address this situation. Two transaction webhooks are responsible for the bulk of fetching, HISTORICAL_UPDATE & INITIAL_UPDATE. These are triggered when a user first links their account. They both should only be triggered a single time for a specific account, so I just store the time when the triggered work is completed, and if this time is present I will ignore all future requests of those types.

The DEFAULT_UPDATE request comes in with a parameter, new_transactions. My hope was to use this number to only fetch that number of transactions from the Plaid endpoint. This way I can ensure minimal data transfer & I can store these transactions and perform processing on them a single time (rectify any pending expenses, check for recurring expenses etc.). The problem is, over the last couple of weeks I noticed that my system was missing numerous transactions that were showing up in my credit card statement.

After engaging plaid support they informed me that instead of using that field (new_transactions) I should pull ~500 transactions every time I get this request. Before when I got transactions I could just store them, knowing they were new. Now when I pull transactions I have to either check to see if they are new and do nothing or overwrite the stored transactions I already have.

I’ve tracked the average new_transactions since I started using webhooks and have found it to be 3.65. This means that if I fetch 500 transactions each time it gets hit I’ll end up fetching each transaction on average 137 times and restoring it or reading from my db 137 times. Obviously there are solutions to reperforming this work every time I fetch these transactions but it is a bit of a pain that their system has been engineered this way.
