import { SnooShift } from "snooshift";

const snoo = new SnooShift();

// search parameters
// https://github.com/pushshift/api#search-parameters-for-comments

// search comments by author
const searchParams = {
  author: "eben0",
};
snoo.searchComments(searchParams).then((comments) => {
  console.log(comments);
});

// get single comment by id
snoo.getComment("gof4uys").then((comment) => {
  console.log(comment);
});
