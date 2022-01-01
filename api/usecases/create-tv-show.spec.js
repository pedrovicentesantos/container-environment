const sinon = require('sinon');
const faker = require('faker');
const { resolve } = require('_api/commons');
const { TvShow } = require('_domain/tv-show');
const CreateTvShow = require('./create-tv-show');

describe('create-tv-show usecase test', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('#create test', () => {
    context('When given a tv show', () => {
      it('should add it to the repository', async () => {
        const tvShow = TvShow({
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          rating: faker.datatype.number({ min: 1, max: 10 }),
        });
        const tvShowRepository = ({
          add: sandbox.stub().callsFake(resolve),
        });
        const useCase = CreateTvShow({ tvShowRepository });

        const result = await useCase.create(tvShow);

        expect(result).to.deep.equal(tvShow);
        expect(tvShowRepository.add).to.have.been.calledOnceWith(tvShow);
      });
    });
  });
});
