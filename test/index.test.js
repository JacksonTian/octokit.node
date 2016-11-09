'use strict';

const expect = require('expect.js');
// readonly token
const token = 'da7a7e990db5c2c635ab9a0706cb09eb3d792724';
const Octokit = require('../');

describe('repositories', function () {
  var octokit = new Octokit('JacksonTian', token);

  it('List your repositories should ok', function* () {
    var repositories = yield octokit.getYourRepositories();
    expect(repositories).to.be.an(Array);
    expect(repositories.length).to.be.above(10);
    expect(repositories).to.have.property('links');
  });

  it('List user repositories should ok', function* () {
    var user = 'JacksonTian';
    var repositories = yield octokit.getUserRepositories(user);
    expect(repositories).to.be.an(Array);
    expect(repositories.length).to.be.above(10);
    expect(repositories).to.have.property('links');
  });

  it('List organization repositories should ok', function* () {
    var org = 'alibaba';
    var repositories = yield octokit.getOrganizationRepositories(org);
    expect(repositories).to.be.an(Array);
    expect(repositories.length).to.be.above(10);
    expect(repositories).to.have.property('links');
  });

  it('List all public repositories should ok', function* () {
    var repositories = yield octokit.getAllPublicRepositories();
    expect(repositories).to.be.an(Array);
    expect(repositories.length).to.be.above(10);
    expect(repositories).to.have.property('links');
  });

  it('Get repository should ok', function* () {
    var repo = yield octokit.getRepository('JacksonTian', 'eventproxy');
    expect(repo.name).to.be('eventproxy');
  });

  it('List contributors should ok', function* () {
    var contributors = yield octokit.getContributors('JacksonTian', 'eventproxy');
    expect(contributors).to.be.an(Array);
    expect(contributors.length).to.be.above(10);
  });

  it('List languages should ok', function* () {
    var languages = yield octokit.getLanguages('JacksonTian', 'eventproxy');
    expect(languages).to.be.ok();
    expect(languages).to.have.keys('JavaScript', 'HTML', 'CSS', 'Makefile');
  });

  it('List tags should ok', function* () {
    var tags = yield octokit.getTags('JacksonTian', 'eventproxy');
    expect(tags).to.be.ok();
    expect(tags).to.be.an(Array);
  });
});
