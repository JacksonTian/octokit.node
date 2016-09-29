'use strict';

const httpx = require('httpx');

class Octokit {
  constructor(user, token) {
    this.endpoint = 'https://api.github.com';
    this.user = user;
    this.token = token;
    this.auth = new Buffer(`${user}:${token}`, 'utf8').toString('base64');
  }

  async request(method, path, query, data) {
    var url = this.endpoint + path;

    if (query) {
      url += '?' + querystring.stringify(query);
    }

    var res = await httpx.request(url, {
      method: method,
      timeout: 10000,
      headers: {
        'accept': 'application/vnd.github.v3+json',
        'user-agent': 'octokit.node',
        'authorization': `Basic ${this.auth}`
      },
      data: data
    });

    if (res.statusCode !== 200) {

    }
    console.log(res.headers);
    var body = await httpx.read(res, 'utf8');

    if (res.headers['content-type'].indexOf('application/json') !== -1) {
      return JSON.parse(body);
    }

    return body;
  }

  async get(path, query) {
    return await this.request('GET', path, query);
  }

  async post(path, data) {
    return await this.request('POST', path, null, data);
  }

  async patch(path, data) {
    return await this.request('PATCH', path, null, data);
  }

  async delete(path) {
    return await this.request('DELETE', path);
  }

  async getYourRepositories(query) {
    return await this.get('/user/repos', query);
  }

  async getUserRepositories(username, query) {
    return await this.get(`/users/${username}/repos`, query);
  }

  async getOrganizationRepositories(org, query) {
    return await this.get(`/orgs/${org}/repos`, query);
  }

  async getAllPublicRepositories(query) {
    return await this.get(`/repositories`, query);
  }

  async createYourRepository(data) {
    // see https://developer.github.com/v3/repos/#create
    return await this.post(`/user/repos`, data);
  }

  async createOrgRepository(org, data) {
    // see https://developer.github.com/v3/repos/#create
    return await this.post(`/orgs/:org/repos`, data);
  }

  async getRepository(owner, repo) {
    // see https://developer.github.com/v3/repos/#get
    return await this.get(`/repos/${owner}/${repo}`);
  }

  async updateRepository(owner, repo, data) {
    // see https://developer.github.com/v3/repos/#edit
    return await this.patch(`/repos/${owner}/${repo}`, data);
  }

  async getContributors(owner, repo, query) {
    // see https://developer.github.com/v3/repos/#list-contributors
    return await this.get(`/repos/${owner}/${repo}/contributors`, query);
  }

  async getLanguages(owner, repo) {
    // see https://developer.github.com/v3/repos/#list-languages
    return await this.get(`/repos/${owner}/${repo}/languages`);
  }

  async getTeams(owner, repo) {
    // see https://developer.github.com/v3/repos/#list-teams
    return await this.get(`/repos/${owner}/${repo}/teams`);
  }

  async getTags(owner, repo) {
    // see https://developer.github.com/v3/repos/#list-tags
    return await this.get(`/repos/${owner}/${repo}/tags`);
  }

  async deleteRepository(owner, repo) {
    // see https://developer.github.com/v3/repos/#delete-a-repository
    return await this.delete(`/repos/${owner}/${repo}`);
  }
}

module.exports = Octokit;
