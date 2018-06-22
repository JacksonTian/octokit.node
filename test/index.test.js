'use strict';

const expect = require('expect.js');
// readonly token
const token = 'da7a7e990db5c2c635ab9a0706cb09eb3d792724';
const Octokit = require('../');

describe('repositories', function () {
  var octokit = new Octokit('JacksonTian', token);

  it('List your repositories should ok', async function () {
    var repositories = await octokit.getYourRepositories();
    expect(repositories).to.be.an(Array);
    expect(repositories.length).to.be.above(10);
    expect(repositories).to.have.property('links');
  });

  it('List user repositories should ok', async function () {
    var user = 'JacksonTian';
    var repositories = await octokit.getUserRepositories(user);
    expect(repositories).to.be.an(Array);
    expect(repositories.length).to.be.above(10);
    expect(repositories).to.have.property('links');
  });

  it('List organization repositories should ok', async function () {
    var org = 'alibaba';
    var repositories = await octokit.getOrganizationRepositories(org);
    expect(repositories).to.be.an(Array);
    expect(repositories.length).to.be.above(10);
    expect(repositories).to.have.property('links');
  });

  it('List all public repositories should ok', async function () {
    var repositories = await octokit.getAllPublicRepositories();
    expect(repositories).to.be.an(Array);
    expect(repositories.length).to.be.above(10);
    expect(repositories).to.have.property('links');
  });

  it('Get repository should ok', async function () {
    var repo = await octokit.getRepository('JacksonTian', 'eventproxy');
    expect(repo.name).to.be('eventproxy');
  });

  it('List contributors should ok', async function () {
    var contributors = await octokit.getContributors('JacksonTian', 'eventproxy');
    expect(contributors).to.be.an(Array);
    expect(contributors.length).to.be.above(10);
  });

  it('List languages should ok', async function () {
    var languages = await octokit.getLanguages('JacksonTian', 'eventproxy');
    expect(languages).to.be.ok();
    expect(languages).to.have.keys('JavaScript', 'HTML', 'CSS', 'Makefile');
  });

  it('List tags should ok', async function () {
    var tags = await octokit.getTags('JacksonTian', 'eventproxy');
    expect(tags).to.be.ok();
    expect(tags).to.be.an(Array);
  });

  xit('List referrers should ok', async function () {
    var owner = 'ant-design';
    var repo = 'ant-design';
    var path = `/repos/${owner}/${repo}/traffic/popular/referrers`;
    var referrers = await octokit.get(path, {
      headers: {
        'accept': 'application/vnd.github.spiderman-preview'
      }
    });
    expect(referrers).to.be.ok();
    expect(referrers).to.be.an(Array);
  });

  xit('List paths should ok', async function () {
    var owner = 'alibaba';
    var repo = 'weex';
    var path = `/repos/${owner}/${repo}/traffic/popular/paths`;
    var paths = await octokit.get(path, {
      headers: {
        'accept': 'application/vnd.github.spiderman-preview'
      }
    });
    expect(paths).to.be.ok();
    expect(paths).to.be.an(Array);
  });

  it(`Get the contents of a repository's license should ok`, async function () {
    var owner = 'alibaba';
    var repo = 'pouch';
    var path = `/repos/${owner}/${repo}/license`;
    var result = await octokit.get(path, {
      headers: {
        //'accept': 'application/vnd.github.spiderman-preview'
      }
    });
    expect(result).to.be.ok();
    expect(result.license).to.be.ok();
    var license = result.license;
    expect(license.name).to.be('Apache License 2.0');
  });

  it(`Get a repository's license should ok`, async function () {
    var owner = 'alibaba';
    var repo = 'pouch';
    var path = `/repos/${owner}/${repo}`;
    var result = await octokit.get(path, {
      headers: {
        'accept': 'application/vnd.github.drax-preview+json'
      }
    });
    expect(result).to.be.ok();
    expect(result.license).to.be.ok();
    var license = result.license;
    expect(license.name).to.be('Apache License 2.0');
  });
});
