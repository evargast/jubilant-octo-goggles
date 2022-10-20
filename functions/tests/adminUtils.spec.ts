import * as admin from 'firebase-admin';
import {
  generateSundanceReviewQueue,
  generateAltaReviewQueue,
  generateReview,
} from '../generators';
import { reviewQueueCollection, reviewsCollection } from '../src/constants';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { getReviewQueue } from '../src/adminUtils';

let testEnv: RulesTestEnvironment;
let sundanceQueueDoc: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
let altaQueueDoc: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
let reviewDoc: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
const review = generateReview();
const sundanceQueue = generateSundanceReviewQueue();
const altaQueue = generateAltaReviewQueue();

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

  sundanceQueueDoc = admin
    .firestore()
    .collection(reviewQueueCollection)
    .doc('Sundance');
  altaQueueDoc = admin
    .firestore()
    .collection(reviewQueueCollection)
    .doc('Alta');
  reviewDoc = admin.firestore().collection(reviewsCollection).doc('testReview');
});

beforeEach(async () => {
  await sundanceQueueDoc.set(sundanceQueue);
  await altaQueueDoc.set(altaQueue);
  await reviewDoc.set(review);
});

afterEach(async () => {
  await testEnv.clearFirestore();
});

test.only('should get the correct reviewQueue for requestor', async () => {
  let queue = await getReviewQueue(sundanceQueue.users[0].id);
  expect(queue.id).toEqual('Sundance');
  queue = await getReviewQueue(altaQueue.users[0].id);
  expect(queue.id).toEqual('Alta');
});
