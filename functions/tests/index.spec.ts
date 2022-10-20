import * as admin from 'firebase-admin';
import { generateSundanceReviewQueue, generateReview } from '../generators';
import { reviewQueueCollection, reviewsCollection } from '../src/constants';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { getPrNumberFromUrl, isNumeric, isUrl } from '../src/handleDefault';

let testEnv: RulesTestEnvironment;
let queueDoc: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
let reviewDoc: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
const review = generateReview();
const reviewQueue = generateSundanceReviewQueue();

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

test('url parser should return correct PR number from valid url', () => {
  const num = '158';
  const url = `https://git.corp.adobe.com/AnalyticsUI/audience-publishing/pull/${num}`;
  const num2 = '1';
  const url2 = `https://github.com/deloreyj/jubilant-octo-goggles/pull/${num2}`;
  const num3 = '1037';
  const url3 = `https://git.corp.adobe.com/AnalyticsUI/analytics_web_spa/pull/${num3}`;
  const res = getPrNumberFromUrl(url);
  const res2 = getPrNumberFromUrl(url2);
  const res3 = getPrNumberFromUrl(url3);
  expect(isUrl(url)).toBe(true);
  expect(isUrl(url2)).toBe(true);
  expect(isUrl(url3)).toBe(true);
  expect(res).toBe(num);
  expect(res2).toBe(num2);
  expect(res3).toBe(num3);
});

test('isNumeric correctly tests if strings are numbers', () => {
  const str = "123";
  const str2 = "not a number";
  const str3 = "mixed/123";
  expect(isNumeric(str)).toBe(true);
  expect(isNumeric(str2)).toBe(false);
  expect(isNumeric(str3)).toBe(false);
})