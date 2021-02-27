import axios, { AxiosInstance, AxiosResponse } from "axios";
import Snoowrap, { SnoowrapOptions } from "snoowrap";
import { Comment, Submission } from "snoowrap/dist/objects";
import EventSource from "eventsource";
import { CommentSearchOptions, SubmissionSearchOptions } from "./SearchOptions";

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

const streamUrl = "http://stream.pushshift.io";

const headers = {
  "Content-Type": "application/json",
  Referer: "https://www.reddit.com/",
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

  /**
   * create new SnooShift object
   * accepts SnoowrapOptions object
   * @param snoowrapOptions
   */
  constructor(snoowrapOptions: Options = defaultOptions) {
    this.snoowrapOptions = snoowrapOptions;
    this.snoowrap = new Snoowrap(snoowrapOptions);
    // create base axios object
    this.axios = axios.create({
      baseURL: baseURL,
      headers: headers,
    });
    // create elasticsearch axios object
    this.axiosElastic = axios.create({
      baseURL: elasticURL,
      headers: headers,
    });
  }

  /**
   *
   * @param type
   * @param response
   * @private
   */
  private _snooWrapper(
    type: string,
    response: AxiosResponse
  ): Comment[] | Submission[] | any[] {
    let data = [];
    if (response.data && Array.isArray(response.data.data)) {
      data = response.data.data;
    }
    const objects = [];
    for (const object of data) {
      if (this._isDeleted(object)) continue;
      objects.push(this.snoowrap._newObject(type, object));
    }
    return objects;
  }

  /**
   * checks for deleted items
   * @param object
   * @private
   */
  private _isDeleted(object: any): boolean {
    let list = ["[deleted]", "[removed]"];
    return (
      list.includes(object.body) ||
      list.includes(object.selftext) ||
      list.includes(object.author)
    );
  }

  /**
   * gets Snoowrap client
   */
  getSnoowrap(): Snoowrap {
    return this.snoowrap;
  }

  /**
   * searches for comments
   * @param search
   */
  async searchComments(
    search: CommentSearchOptions = {}
  ): Promise<Comment[] | object[]> {
    let response = await this.axios.get(commentPath, { params: search });
    return this._snooWrapper(Type.Comment, response);
  }

  /**
   * gets comment by id
   * @param id
   */
  async getComment(id: string): Promise<Comment | any> {
    let params = {
      ids: id,
      size: 1,
    };
    return (await this.searchComments(params))[0];
  }

  /**
   * searches for submissions
   * @param search
   */
  async searchSubmissions(
    search: SubmissionSearchOptions = {}
  ): Promise<Submission[] | object[]> {
    let response = await this.axios.get(submissionPath, { params: search });
    return this._snooWrapper(Type.Submission, response);
  }

  /**
   * gets submission by id
   * @param id
   */
  async getSubmission(id: string): Promise<Submission | any> {
    let params = {
      ids: id,
      size: 1,
    };
    return (await this.searchSubmissions(params))[0];
  }

  /**
   * querying comment using elasticsearch
   * @param elasticQuery
   */
  async elasticComments(elasticQuery: object) {
    const response = await this.axiosElastic.get(elasticCommentPath, {
      params: {
        source: JSON.stringify(elasticQuery),
        source_content_type: "application/json",
      },
    });
    return response.data;
  }

  /**
   * querying submissions using elasticsearch
   * @param elasticQuery
   */
  async elasticSubmissions(elasticQuery: object) {
    const response = await this.axiosElastic.get(elasticSubmissionPath, {
      params: {
        source: JSON.stringify(elasticQuery),
        source_content_type: "application/json",
      },
    });
    return response.data;
  }

  /**
   * listens to the sse live stream
   * @param params
   * @param args
   */
  static liveStream(params = {}, args = {}) {
    const qs = new URLSearchParams(params).toString();
    const url = `${streamUrl}/?${qs}`;
    return new EventSource(url, args);
  }

  /**
   * encodes number to base36 string
   * @param num
   */
  static base36Encode(num: number) {
    return num.toString(36);
  }

  /**
   * decodes base36 string to number
   * @param str
   */
  static base36Decode(str: string) {
    return parseInt(str, 36);
  }
}

export default SnooShift;
