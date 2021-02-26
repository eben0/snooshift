import { SnooShift } from "snooshift";

const snoo = new SnooShift();

// search parameters
// https://github.com/pushshift/api#search-parameters-for-submissions

// search submissions by author
const searchParams = {
  author: "eben0",
};
snoo.searchSubmissions(searchParams).then((comments) => {
  console.log(comments);
});

// get single submission by id
snoo.searchSubmissions("lrufxe").then((submission) => {
  console.log(submission);
});
