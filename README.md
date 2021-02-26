# SnooShift
JavaScript wrapper library for [Pushshift](https://github.com/pushshift/api) with [Snoowrap](https://github.com/not-an-aardvark/snoowrap) support.

## Install
`npm install snooshift`

## Searching Comments

### Search Parameters

```javascript
import { SnooShift } from "snooshift";

// create new object
const snoo = new SnooShift();

// search parameters
// https://github.com/pushshift/api#search-parameters-for-comments

// search comments by author
const searchParams = {
  author: "eben0",
};

// send request
snoo.searchComments(searchParams).then((comments) => {
  console.log(comments);
});
```

### Get Single Comment
```javascript
// get single comment by id
snoo.getComment("gof4uys").then((comment) => {
  console.log(comment);
});
```

## Searching Submissions
```javascript
// search parameters
// https://github.com/pushshift/api#search-parameters-for-submissions

// search submissions by author
const searchParams = {
  author: "eben0",
};
snoo.searchSubmissions(searchParams).then((comments) => {
  console.log(comments);
});
```

### Get Single Submission
```javascript
// get single submission by id
snoo.searchSubmissions("lrufxe").then((submission) => {
  console.log(submission);
});
```

## Interacting with Reddit
You can reply, upvote and interact with reddit using `Snoowrap` object.
You must set up your [reddit api credentials](https://github.com/not-an-aardvark/snoowrap#examples) to do so.
```javascript
import { SnooShift } from "snooshift";

// list of supported credentials:
// https://github.com/not-an-aardvark/snoowrap#examples
const credentials = {
  userAgent: "put your user-agent string here",
  clientId: "put your client id here",
  clientSecret: "put your client secret here",
  refreshToken: "put your refresh token here",
};

const snoo = new SnooShift(credentials);

// get comment and reply/upvote/etc...
snoo.getComment("gof4uys").then((comment) => {
  comment.reply("My awesome reply").then(value);
  comment.upvote().then(value);
  comment.delete().then(value);
});
```

## Querying Elasticsearch
You can directly query the elasticsearch server if you are familiar with syntax.
```javascript
import { SnooShift } from "snooshift";

const snoo = new SnooShift();

// elasticsearch query
// this query searches for all author's data ordered by created_utc
const query = {
  query: {
    term: { author: "eben0" },
  },
  sort: {
    created_utc: "desc",
  }
};

// searches for author's comments
snoo.elasticComments(query).then((result) => {
  console.log(result.hits.hits[0]._source);
});

// searches for author's submissions
snoo.elasticSubmissions(query).then((result) => {
  console.log(result.hits.hits[0]._source);
});
```
