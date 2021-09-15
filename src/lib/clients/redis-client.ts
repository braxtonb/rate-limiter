import redis from 'redis';
import { promisify } from 'util';
import ApiError from '../helpers/error-handler';

type SlidingWindowRequests = Record<string, number>;
type CreatedRedisClient = ReturnType<typeof redis.createClient>;

const HOUR_IN_SECONDS = 60 * 60;

interface AsyncRedisClient extends CreatedRedisClient {
  getAsync: (arg1: string) => Promise<string | null>;
  setexAsync: (arg1: string, arg2: number, arg3: string) => Promise<string>;
}

/**
 * Redis client to implement rate limiter using a sliding window.
 *
 * The sliding window is divided into per minute slices.
 * Meaning if the sliding window spans an hour,
 * there will be at most 60 key/value pairs for each unique request IP.
 * Each Redis key is given an expiration time equal to the sliding window duration,
 * such that, once the window has passed, the number of requests made during a
 * particular minute long slice will be added back
 * to the unique request IP's capacity
 */
class RedisClient {
  private client: AsyncRedisClient;
  private REDIS_CONNECTION =
    process.env.REDIS_CONNECTION_STRING ?? 'redis//localhost:6379';
  private windowSliceRequestCapacity = 100;
  private slidingWindowDuration = HOUR_IN_SECONDS;

  constructor(capacity?: number, window?: number) {
    this.client = this._configureAsyncRedisClient(
      redis.createClient(this.REDIS_CONNECTION),
    );
    this.windowSliceRequestCapacity = capacity ?? this.windowSliceRequestCapacity;
    this.slidingWindowDuration = window ?? this.slidingWindowDuration;
  }

  private _configureAsyncRedisClient = (client: CreatedRedisClient) => {
    const asyncRedisClient: any = client;
    asyncRedisClient.getAsync = promisify(asyncRedisClient.get).bind(
      asyncRedisClient,
    );
    asyncRedisClient.setexAsync = promisify(asyncRedisClient.setex).bind(
      asyncRedisClient,
    );

    return asyncRedisClient as AsyncRedisClient;
  };

  public updateSlidingWindowRequests = async (key: string) => {
    const previousRequests = await this._getPreviousRequests(key);

    if (!previousRequests) {
      this._initSlidingWindowRequests(key);
      return;
    }

    if (!this._getRemainingCapacity(previousRequests)) {
      throw new ApiError(429, 'Too many requests', null);
    }

    this._addRequestToSlidingWindow(key, previousRequests);
  };

  private _getPreviousRequests = async (
    key: string,
  ): Promise<SlidingWindowRequests> => {
    const previousRequestsStr = await this.client.getAsync(key);
    console.log('_getPreviousRequests', previousRequestsStr);
    const previousRequests: SlidingWindowRequests = previousRequestsStr
      ? JSON.parse(previousRequestsStr)
      : null;

    return previousRequests;
  };

  // https://stackoverflow.com/a/10789415
  private _getNearestMinute = () => {
    const coeff = 1000 * 60 * 1;
    const date = new Date();
    const nearestMinute = new Date(Math.floor(date.getTime() / coeff) * coeff);

    return nearestMinute;
  };

  private _initSlidingWindowRequests = async (key: string) => {
    const nearestMinute = this._getNearestMinute().getTime();

    const slidingWindowRequest = {
      [nearestMinute]: 1,
    };

    await this.client.setexAsync(
      key,
      this.slidingWindowDuration,
      JSON.stringify(slidingWindowRequest),
    );
  };

  private _getRemainingCapacity = (
    slidingWindowRequests: SlidingWindowRequests,
  ): number => {
    const capacityUsed = Object.keys(slidingWindowRequests).reduce(
      (accu, timestamp) => accu + slidingWindowRequests[timestamp],
      0,
    );

    return Math.max(0, this.windowSliceRequestCapacity - capacityUsed);
  };

  private _addRequestToSlidingWindow = async (
    key: string,
    previousRequests: SlidingWindowRequests,
  ) => {
    const nearestMinute = this._getNearestMinute().getTime();

    const updatedRequests = {
      ...previousRequests,
      [nearestMinute]: (previousRequests?.[nearestMinute] ?? 0) + 1,
    };

    await this.client.setexAsync(
      key,
      this.slidingWindowDuration,
      JSON.stringify(updatedRequests),
    );
  };
}

export default RedisClient;
