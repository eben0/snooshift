export declare interface CommentSearchOptions {
  q?: string;
  ids?: string;
  size?: number;
  fields?: string;
  sort?: string;
  aggs?: string[];
  author?: string;
  subreddit?: string;
  after?: number | string;
  before?: number | string;
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
  sort?: string;
  sort_type?: string;
  aggs?: string;
  author?: string;
  subreddit?: string;
  after?: number;
  before?: number;
  score?: number;
  num_comments?: number;
  over_18?: boolean;
  is_video?: boolean;
  locked?: boolean;
  stickied?: boolean;
  spoiler?: boolean;
  contest_mode?: boolean;
  frequency?: string;
  metadata?: boolean;
}
