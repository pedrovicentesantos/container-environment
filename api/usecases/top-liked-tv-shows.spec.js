const R = require('ramda');
const sinon = require('sinon');
const faker = require('faker');
const { TvShow } = require('_domain/tv-show');
const TopLikedTvShows = require('./top-liked-tv-shows');

describe('top-liked-tv-shows usecase test', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('#topLiked test', () => {
    const randomInt = (min, max) => faker.datatype.number({
      min,
      max,
      precision: 1,
    });
    const createTvShow = () => TvShow({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      rating: randomInt(1, 10),
      likes: randomInt(1, 200),
    });
    const createTvShows = R.pipe(
      R.times(createTvShow),
      R.uniqBy(R.path(['likes', 'amount']))
    );

    context('When there are tv shows in cache', () => {
      it('should return cached tv shows', async () => {
        const savedTvShows = JSON.stringify(createTvShows(5));
        const cache = ({
          get: sandbox.stub().resolves(savedTvShows),
        });
        const tvShowRepository = ({
          orderBy: sandbox.stub().returns(),
        });
        const usecase = TopLikedTvShows({ tvShowRepository, cache });

        const result = await usecase.topLiked();

        expect(result).to.deep.equal(JSON.parse(savedTvShows));
        expect(cache.get).to.have.been.calledOnceWith('TOP_LIKED_TV_SHOWS');
        expect(tvShowRepository.orderBy).to.not.have.been.called;
      });
    });

    context('When there are no tv shows in cache', () => {
      it('should return tv shows from repository', async () => {
        const savedTvShows = createTvShows(5);
        const cache = ({
          get: sandbox.stub().resolves(null),
          put: sandbox.stub().resolves(savedTvShows),
        });
        const tvShowRepository = ({
          orderBy: sandbox.stub().resolves(savedTvShows),
        });
        const usecase = TopLikedTvShows({ tvShowRepository, cache });

        const result = await usecase.topLiked();

        expect(result).to.deep.equal(savedTvShows);
        expect(cache.get).to.have.been.calledOnceWith('TOP_LIKED_TV_SHOWS');
        expect(tvShowRepository.orderBy).to.have.been.calledOnceWith('likes.amount', 5);
        expect(cache.put).to.have.been.calledOnceWith('TOP_LIKED_TV_SHOWS', JSON.stringify(savedTvShows), 60);
      });
    });
  });
});
