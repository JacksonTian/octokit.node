'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const httpx = require('httpx');

class Octokit {
  constructor(user, token) {
    this.endpoint = 'https://api.github.com';
    this.user = user;
    this.token = token;
    this.auth = new Buffer(`${ user }:${ token }`, 'utf8').toString('base64');
  }

  request(method, path, query, data) {
    var _this = this;

    return _asyncToGenerator(function* () {
      var url = _this.endpoint + path;

      if (query) {
        url += '?' + querystring.stringify(query);
      }

      var res = yield httpx.request(url, {
        method: method,
        timeout: 10000,
        headers: {
          'accept': 'application/vnd.github.v3+json',
          'user-agent': 'octokit.node',
          'authorization': `Basic ${ _this.auth }`
        },
        data: data
      });

      if (res.statusCode !== 200) {}
      console.log(res.headers);
      var body = yield httpx.read(res, 'utf8');

      if (res.headers['content-type'].indexOf('application/json') !== -1) {
        return JSON.parse(body);
      }

      return body;
    })();
  }

  get(path, query) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return yield _this2.request('GET', path, query);
    })();
  }

  post(path, data) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      return yield _this3.request('POST', path, null, data);
    })();
  }

  patch(path, data) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      return yield _this4.request('PATCH', path, null, data);
    })();
  }

  getYourRepositories(query) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      return yield _this5.get('/user/repos', query);
    })();
  }

  getUserRepositories(username, query) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      return yield _this6.get(`/users/${ username }/repos`, query);
    })();
  }

  getOrganizationRepositories(org, query) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      return yield _this7.get(`/orgs/${ org }/repos`, query);
    })();
  }

  getAllPublicRepositories(query) {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      return yield _this8.get(`/repositories`, query);
    })();
  }

  createYourRepository(data) {
    var _this9 = this;

    return _asyncToGenerator(function* () {
      // see https://developer.github.com/v3/repos/#create
      return yield _this9.post(`/user/repos`, data);
    })();
  }

  createOrgRepository(org, data) {
    var _this10 = this;

    return _asyncToGenerator(function* () {
      // see https://developer.github.com/v3/repos/#create
      return yield _this10.post(`/orgs/:org/repos`, data);
    })();
  }

  getRepository(owner, repo) {
    var _this11 = this;

    return _asyncToGenerator(function* () {
      // see https://developer.github.com/v3/repos/#get
      return yield _this11.get(`/repos/${ owner }/${ repo }`);
    })();
  }

  updateRepository(owner, repo, data) {
    var _this12 = this;

    return _asyncToGenerator(function* () {
      // see https://developer.github.com/v3/repos/#edit
      return yield _this12.patch(`/repos/${ owner }/${ repo }`, data);
    })();
  }

  getContributors(owner, repo, query) {
    var _this13 = this;

    return _asyncToGenerator(function* () {
      // see https://developer.github.com/v3/repos/#list-contributors
      return yield _this13.get(`/repos/${ owner }/${ repo }/contributors`, query);
    })();
  }

  getLanguages(owner, repo) {
    var _this14 = this;

    return _asyncToGenerator(function* () {
      // see https://developer.github.com/v3/repos/#list-languages
      return yield _this14.get(`/repos/${ owner }/${ repo }/languages`);
    })();
  }
}

module.exports = Octokit;
