const assert = require("assert");
const { SnooShift } = require("..");

describe("SnooShift", () => {
  let s = new SnooShift();

  it("should get comment", async function () {
    let comment = await s.getComment("gof4uys");
    assert.notStrictEqual(comment, undefined);
    assert.strictEqual(comment.id, "gof4uys");
    assert.strictEqual(comment.author, "uglypenguin5");
  });

  it("should get submission", async function () {
    let sub = await s.getSubmission("lrufxe");
    assert.notStrictEqual(sub, undefined);
    assert.strictEqual(sub.id, "lrufxe");
    assert.strictEqual(sub.author, "Discord_Only_Leaks9");
  });

  it("should get submissions in test subreddit", async function () {
    let hrs48 = Math.floor((Date.now() - 60000 * 60 * 48) / 1000);
    let subs = await s.searchSubmissions({
      subreddit: "test",
      size: 25,
      after: hrs48,
    });
    assert.notStrictEqual(
      subs,
      undefined,
      "submissions should not be undefined"
    );
    assert.strictEqual(
      Array.isArray(subs),
      true,
      "submissions should be an array"
    );
    assert.strictEqual(
      subs.length > 0,
      true,
      "should find at least one submission"
    );
    let deleted = subs.filter((sub) => sub.author === "[deleted]").length > 0;
    assert.strictEqual(deleted, false, "deleted messages should not be found");
  });

  it("should get my last comment using elastic search", async function () {
    let result = await s.elasticComments({
      query: {
        term: { author: "eben0" },
      },
      sort: {
        created_utc: "desc",
      },
      size: 1,
    });
    assertElasticSearchResult(result);
    let item = result.hits.hits[0];
    let source = item._source;
    assert.strictEqual(source.author, "eben0");
    assert.strictEqual(source.author_fullname, "t2_9bvim6ae");
  });

  it("should get my last submission using elastic search", async function () {
    let result = await s.elasticSubmissions({
      query: {
        term: { author: "eben0" },
      },
      sort: {
        created_utc: "desc",
      },
      size: 1,
    });
    assertElasticSearchResult(result);
    let item = result.hits.hits[0];
    let source = item._source;
    assert.strictEqual(typeof source.is_video, "boolean");
    assert.strictEqual(source.author, "eben0");
    assert.strictEqual(source.author_fullname, "t2_9bvim6ae");
  });
});

function assertElasticSearchResult(result) {
  assert.notStrictEqual(result, undefined);
  assert.notStrictEqual(result.hits, undefined);
  assert.notStrictEqual(result.hits.hits, undefined);
  assert.notStrictEqual(result.hits.hits[0], undefined);
  assert.notStrictEqual(result.hits.hits[0]._source, undefined);
}
