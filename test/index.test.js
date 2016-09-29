'use strict';

const expect = require('expect.js');
const token = 'da7a7e990db5c2c635ab9a0706cb09eb3d792724';
const Octokit = require('../');

describe('repositories', function () {
  var octokit = new Octokit('JacksonTian', token);

  it('List your repositories should ok', function* () {
    var repositories = yield octokit.getYourRepositories();
    expect(repositories.length).to.be.above(10);
  });

  it('List user repositories should ok', function* () {
    var user = 'JacksonTian';
    var repositories = yield octokit.getUserRepositories(user);
    expect(repositories.length).to.be.above(10);
  });

  it('List organization repositories should ok', function* () {
    var org = 'alibaba';
    var repositories = yield octokit.getOrganizationRepositories(org);
    expect(repositories.length).to.be.above(10);
  });

  it('List all public repositories should ok', function* () {
    var org = 'alibaba';
    var repositories = yield octokit.getAllPublicRepositories();
    expect(repositories.length).to.be.above(10);
  });

  it('Get repository should ok', function* () {
    var repo = yield octokit.getRepository('JacksonTian', 'eventproxy');
    expect(repo.name).to.be('eventproxy');
  });

  it('List contributors should ok', function* () {
    var contributors = yield octokit.getContributors('JacksonTian', 'eventproxy');
    expect(contributors.length).to.be.above(10);
  });

  it('List languages should ok', function* () {
    var languages = yield octokit.getLanguages('JacksonTian', 'eventproxy');
    expect(languages).to.be.ok();
  });

  it('List tags should ok', function* () {
    var tags = yield octokit.getTags('JacksonTian', 'eventproxy');
    expect(tags).to.be.ok();
  });

});
