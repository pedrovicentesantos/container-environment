const R = require('ramda');
const sinon = require('sinon');
const faker = require('faker');
const { TvShow } = require('_domain/tv-show');
const TopRatedTvShows = require('./top-rated-tv-shows');

describe('top-rated-tv-shows usecase test', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('#topRated test', () => {
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

    context('When there is data in database', () => {
      it('should return top X tv shows from repository', async () => {
        const savedTvShows = createTvShows(1);
        const tvShowRepository = ({
          orderBy: sandbox.stub().resolves(savedTvShows),
        });
        const usecase = TopRatedTvShows({ tvShowRepository });

        const result = await usecase.topRated(1);

        expect(result).to.deep.equal(savedTvShows);
        expect(result.length).to.equal(1);
      });
    });

    context('When there is no data in database', () => {
      it('should return an empty array', async () => {
        const tvShowRepository = ({
          orderBy: sandbox.stub().resolves([]),
        });
        const usecase = TopRatedTvShows({ tvShowRepository });

        const result = await usecase.topRated(1);

        expect(result).to.deep.equal([]);
        expect(result.length).to.equal(0);
      });
    });
  });
});
