import { fetchRovers } from './api';

const originalFetch = fetch;

describe('api', () => {
  
  afterEach(() => {
    jest.resetAllMocks();
    global.fetch = originalFetch;
  });

  describe('fetchRovers', () => {
    it('returns the list of rovers', async () => {
      const body = { rovers: 'rover list' };
      const response = new Response(JSON.stringify(body), { status: 200 });
      global.fetch = jest.fn().mockResolvedValue(response);

      const result = await fetchRovers();

      expect(result).toEqual(body.rovers);
    })
  })
})