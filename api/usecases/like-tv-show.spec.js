const sinon = require('sinon');
const { v4: uuid } = require('uuid');
const faker = require('faker');
const { TvShow } = require('_domain/tv-show');
const LikeTvShow = require('./like-tv-show');

describe('like-tv-show usecase test', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('#like test', () => {
    context('When given a tv show', () => {
      it('should add a like to the tv show', async () => {
        const id = uuid();
        const savedTvShow = TvShow({
          id,
          likes: 1,
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          rating: faker.datatype.number({ min: 1, max: 10 }),
        });
        const tvShowRepository = ({
          increment: sandbox.stub().resolves(savedTvShow),
        });
        const usecase = LikeTvShow({ tvShowRepository });

        const result = await usecase.like(id);

        expect(result).to.deep.equal(savedTvShow);
        expect(tvShowRepository.increment)
          .to
          .have
          .been
          .calledOnceWith(id, 'likes.amount');
      });
    });
  });
});
