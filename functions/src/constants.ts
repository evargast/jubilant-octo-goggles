export const reviewQueueCollection =
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev'
    ? 'reviewQueueTest'
    : 'reviewQueue';
export const reviewsCollection =
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev'
    ? 'reviewsTest'
    : 'reviews';
