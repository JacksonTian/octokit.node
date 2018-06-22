'use strict';

const querystring = require('querystring');
const httpx = require('httpx');

const patt = /<([^>]*)>; rel="([^"]*)"/;

var parseLinks = function (link) {
  var parts = link.split(',');
  var links = {};

  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    var matched = part.match(patt);
    if (matched) {
      links[matched[2]] = matched[1];
    }
  }
  return links;
};

class Base {
  constructor(user, token) {
    this.endpoint = 'https://api.github.com';
    this.user = user;
    this.token = token;
    this.auth = Buffer.from(`${user}:${token}`, 'utf8').toString('base64');
  }

  async request(method, path, opts) {
    opts || (opts = {});
    var url = this.endpoint + path;

    var res = await httpx.request(url, {
      method: method,
      timeout: 10000,
      headers: Object.assign({
        'accept': 'application/vnd.github.v3+json',
        'user-agent': 'octokit.node',
        'authorization': `Basic ${this.auth}`
      }, opts.headers),
      data: opts.data
    });

    var body = await httpx.read(res, 'utf8');

    var contentType = res.headers['content-type'] || '';
    var parsed;
    if (contentType.includes('application/json')) {
      parsed = JSON.parse(body);
    }

    var code = res.statusCode;
    if (code >= 400) {
      var err = new Error();
      err.name = 'Github' + err.name;
      if (parsed) {
        err.message = parsed.message;
        if (parsed.documentation_url) {
          err.message += `documentation url: ${parsed.documentation_url}`;
        }
      } else {
        err.message = body;
      }

      throw err;
    }

    var link = res.headers.link;
    if (link) {
      parsed.links = parseLinks(link);
    }

    return parsed || body;
  }

  get(path, opts) {
    opts || (opts = {});

    if (opts && opts.data) {
      path += '?' + querystring.stringify(opts.data);
      opts.data = null;
    }

    return this.request('GET', path, opts);
  }

  post(path, opts) {
    return this.request('POST', path, opts);
  }

  patch(path, opts) {
    return this.request('PATCH', path, opts);
  }

  delete(path, opts) {
    return this.request('DELETE', path, opts);
  }
}

class Octokit extends Base {
  constructor(user, token) {
    super(user, token);
  }

  getYourRepositories(query) {
    return this.get('/user/repos', {
      data: query
    });
  }

  getUserRepositories(username, query) {
    return this.get(`/users/${username}/repos`, {
      data: query
    });
  }

  getOrganizationRepositories(org, query) {
    return this.get(`/orgs/${org}/repos`, {
      data: query
    });
  }

  getAllPublicRepositories(query) {
    return this.get(`/repositories`, {
      data: query
    });
  }

  createYourRepository(data) {
    // see https://developer.github.com/v3/repos/#create
    return this.post(`/user/repos`, {
      data
    });
  }

  createOrgRepository(org, data) {
    // see https://developer.github.com/v3/repos/#create
    return this.post(`/orgs/:org/repos`, {
      data
    });
  }

  getRepository(owner, repo) {
    // see https://developer.github.com/v3/repos/#get
    return this.get(`/repos/${owner}/${repo}`);
  }

  updateRepository(owner, repo, data) {
    // see https://developer.github.com/v3/repos/#edit
    return this.patch(`/repos/${owner}/${repo}`, {
      data
    });
  }

  getContributors(owner, repo, query) {
    // see https://developer.github.com/v3/repos/#list-contributors
    return this.get(`/repos/${owner}/${repo}/contributors`, {
      data: query
    });
  }

  getLanguages(owner, repo) {
    // see https://developer.github.com/v3/repos/#list-languages
    return this.get(`/repos/${owner}/${repo}/languages`);
  }

  getTeams(owner, repo) {
    // see https://developer.github.com/v3/repos/#list-teams
    return this.get(`/repos/${owner}/${repo}/teams`);
  }

  getTags(owner, repo) {
    // see https://developer.github.com/v3/repos/#list-tags
    return this.get(`/repos/${owner}/${repo}/tags`);
  }

  deleteRepository(owner, repo) {
    // see https://developer.github.com/v3/repos/#delete-a-repository
    return this.delete(`/repos/${owner}/${repo}`);
  }

  getCommitActivityStats(owner, repo) {
    return this.get(`/repos/${owner}/${repo}/stats/commit_activity`);
  }

  getContributorsStats(owner, repo) {
    return this.get(`/repos/${owner}/${repo}/stats/contributors`);
  }

  // GET /repos/:owner/:repo/stats/punch_card
  getPunchCardStats(owner, repo) {
    return this.get(`/repos/${owner}/${repo}/stats/punch_card`);
  }
}

module.exports = Octokit;
