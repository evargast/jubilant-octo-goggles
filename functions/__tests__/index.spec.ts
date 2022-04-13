import { reviewQueueCollection, reviewsCollection } from '../src/constants';

test('reviewQueueCollection is set to reviewQueueTest in test environment', () => {
  expect(reviewQueueCollection).toBe('reviewQueueTest');
});

test('reviewsCollection is set to reviewsTest in test environment', () => {
  expect(reviewsCollection).toBe('reviewsTest');
});


