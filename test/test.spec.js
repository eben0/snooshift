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
