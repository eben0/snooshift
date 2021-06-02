export declare interface CommentSearchOptions {
  q?: string;
  ids?: string;
  size?: number;
  fields?: string;
  sort?: string;
  aggs?: string[];
  author?: string;
  subreddit?: string;
  after?: number;
  frequency?: string;
  metadata?: boolean;
}

export declare interface SubmissionSearchOptions {
  q?: string;
  "q:not"?: string;
  ids?: string;
  title?: string;
  "title:not"?: string;
  selftext?: string;
  "selftext:not"?: string;
  size?: number;
  fields?: string;
  sort?: "asc" | "desc";
  sort_type?: "score" | "num_comments" | "created_utc";
  aggs?: string;
  author?: string;
  subreddit?: string;
  after?: number | string;
  before?: number | string;
  score?: number | string;
  num_comments?: number | string;
  over_18?: boolean;
  is_video?: boolean;
  locked?: boolean;
  stickied?: boolean;
  spoiler?: boolean;
  contest_mode?: boolean;
  frequency?: "second" | "minute" | "hour" | "day";
  metadata?: boolean;
}
