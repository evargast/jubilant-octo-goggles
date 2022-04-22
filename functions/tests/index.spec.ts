import * as admin from 'firebase-admin';
import { generateReviewQueue, generateReview } from '../generators';
import { reviewQueueCollection, reviewsCollection } from '../src/constants';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import claimReview from '../src/claimReview';

let testEnv: RulesTestEnvironment;
let queueDoc: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
let reviewDoc: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
const review = generateReview();
const reviewQueue = generateReviewQueue();

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'sundance-prs',
  });
  if (
    !admin.apps.find((app) => app && app.options.projectId === 'sundance-prs')
  ) {
    admin.initializeApp({
      projectId: 'sundance-prs',
    });
  }

  queueDoc = admin
    .firestore()
    .collection(reviewQueueCollection)
    .doc('Sundance');
  reviewDoc = admin.firestore().collection(reviewsCollection).doc('testReview');
});

beforeEach(async () => {
  await queueDoc.set(reviewQueue);
  await reviewDoc.set(review);
});

afterEach(async () => {
  await testEnv.clearFirestore();
});

test('reviewQueueCollection is set to reviewQueueTest in test environment', () => {
  expect(reviewQueueCollection).toBe('reviewQueueTest');
});

test('reviewsCollection is set to reviewsTest in test environment', () => {
  expect(reviewsCollection).toBe('reviewsTest');
});

test('firestore should have data', async () => {
  const snapshot = await queueDoc.get();
  expect(snapshot.exists).toBe(true);
});
