import { SnooShift } from "snooshift";

// you need to set up your reddit api credentials
// if you want to interact with Reddit API.

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
