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
  },
  size: 1,
};

// searches for author's comments
snoo.elasticComments(query).then((result) => {
  console.log(result.hits.hits[0]._source);
});

// searches for author's submissions
snoo.elasticSubmissions(query).then((result) => {
  console.log(result.hits.hits[0]._source);
});
