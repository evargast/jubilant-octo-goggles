import * as admin from 'firebase-admin';
import { generateReviewQueue, generateReview } from '../generators';
import { reviewQueueCollection, reviewsCollection } from '../src/constants';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { getPrNumberFromUrl, isUrl } from '../src/handleDefault';

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

test('url parser should return correct PR number', () => {
  const num = '158';
  const url = `https://git.corp.adobe.com/AnalyticsUI/audience-publishing/pull/${num}`;
  const num2 = '1';
  const url2 = `https://github.com/deloreyj/jubilant-octo-goggles/pull/${num2}`;
  const res = getPrNumberFromUrl(url);
  const res2 = getPrNumberFromUrl(url2);
  expect(res).toBe(num);
  expect(res2).toBe(num2);
});

test('isUrl should return true for valid url', () => {
  const url = 'https://git.corp.adobe.com/AnalyticsUI/audience-publishing/pull/158';
  const url2 = 'http://git.corp.adobe.com/AnalycitcsUI/web-spa/pull/158';
  expect(isUrl(url)).toBe(true);
  expect(isUrl(url2)).toBe(true);
});