import axios, { AxiosInstance, AxiosResponse } from "axios";
import Snoowrap, { SnoowrapOptions } from "snoowrap";
import { Comment, Submission } from "snoowrap/dist/objects";
import EventSource from "eventsource";
import { CommentSearchOptions, SubmissionSearchOptions } from "./SearchOptions";

const streamUrl = "http://stream.pushshift.io";

export enum Type {
  Comment = "Comment",
  Submission = "Submission",
}

export declare interface Options extends SnoowrapOptions {}

const baseURL = "https://api.pushshift.io/reddit";
const commentPath = "/comment/search";
const submissionPath = "/submission/search";

const elasticURL = "https://elastic.pushshift.io";
const elasticCommentPath = "/rc/comments/_search";
const elasticSubmissionPath = "/rs/submissions/_search";

const headers = {
  "Content-Type": "application/json",
  Referer: "https://www,reddit.com/",
};

const defaultOptions: Options = {
  accessToken: "*",
  clientId: "*",
  clientSecret: "*",
  password: "*",
  refreshToken: "*",
  userAgent: "*",
  username: "*",
};

export class SnooShift {
  axios: AxiosInstance;
  axiosElastic: AxiosInstance;
  protected snoowrap: Snoowrap;
  private snoowrapOptions: Options;

  constructor(snoowrapOptions: Options = defaultOptions) {
    this.snoowrapOptions = snoowrapOptions;
    this.snoowrap = new Snoowrap(snoowrapOptions);
    this.axios = axios.create({
      baseURL: baseURL,
      headers: headers,
    });
    this.axiosElastic = axios.create({
      baseURL: elasticURL,
      headers: headers,
    });
  }

  private _snooWrapper(
    type: string,
    response: AxiosResponse
  ): Comment[] | Submission[] | any[] {
    let data = [];
    if (response.data && Array.isArray(response.data.data)) {
      data = response.data.data;
    }
    return data.map((object) => this.snoowrap._newObject(type, object));
  }

  getSnoowrap() {
    return this.snoowrap;
  }

  async searchComments(
    search: CommentSearchOptions = {}
  ): Promise<Comment[] | object[]> {
    let response = await this.axios.get(commentPath, { params: search });
    return this._snooWrapper(Type.Comment, response);
  }

  async getComment(id: string): Promise<Comment | any> {
    let params = {
      ids: id,
      size: 1,
    };
    return (await this.searchComments(params))[0];
  }

  async searchSubmissions(
    search: SubmissionSearchOptions = {}
  ): Promise<Submission[] | object[]> {
    let response = await this.axios.get(submissionPath, { params: search });
    return this._snooWrapper(Type.Submission, response);
  }

  async getSubmission(id: string): Promise<Submission | any> {
    let params = {
      ids: id,
      size: 1,
    };
    return (await this.searchSubmissions(params))[0];
  }

  async elasticComments(elasticQuery: object) {
    const response = await this.axiosElastic.get(elasticCommentPath, {
      params: {
        source: JSON.stringify(elasticQuery),
        source_content_type: "application/json",
      },
    });
    return response.data;
  }

  async elasticSubmissions(elasticQuery: object) {
    const response = await this.axiosElastic.get(elasticSubmissionPath, {
      params: {
        source: JSON.stringify(elasticQuery),
        source_content_type: "application/json",
      },
    });
    return response.data;
  }

  static liveStream(params = {}, args = {}) {
    const qs = new URLSearchParams(params).toString();
    const url = `${streamUrl}/?${qs}`;
    return new EventSource(url, args);
  }

  static base36Encode(num: number) {
    return num.toString(36);
  }

  static base10Decode(str: string) {
    return parseInt(str, 36);
  }
}

export default SnooShift;
