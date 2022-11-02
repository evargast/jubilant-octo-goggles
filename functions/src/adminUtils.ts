import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { User } from '.';
import { reviewQueueCollection, reviewsCollection } from './constants';

const updateReviewQueue = async (userId: string) => {
  functions.logger.info(`putting ${userId} back in the queue`);
  try {
    const reviewQueueDoc = await getReviewQueue(userId);
    const reviewQueue = reviewQueueDoc.data()!.users as User[];
    const index = reviewQueue.findIndex((user) => user.id === userId);
    reviewQueue.push(reviewQueue.splice(index, 1)[0]);
    await admin
      .firestore()
      .collection(reviewQueueCollection)
      .doc(reviewQueueDoc.id)
      .update({ users: reviewQueue });
  } catch (e) {
    functions.logger.error(e);
    throw e;
  }
};

const getPendingReviewsForUser = (userId: string) => {
  return admin
    .firestore()
    .collection(reviewsCollection)
    .where('reviewer', '==', userId)
    .where('status', '==', 'pending')
    .get();
};

const getPendingReviewsList = () => {
  return admin
    .firestore()
    .collection(reviewsCollection)
    .where('status', '==', 'pending')
    .get();
};

const getReviewById = (reviewId: string) => {
  return admin.firestore().collection(reviewsCollection).doc(reviewId).get();
};

const getReviewQueue = async (requestorId: string) => {
  const queues = await admin
    .firestore()
    .collection(reviewQueueCollection)
    .get();
  const requestorsTeamQueue = queues.docs.find((doc) => {
    const queue = doc.data();
    return queue.users.some((queueItem: any) => queueItem.id === requestorId);
  });
  return requestorsTeamQueue!;
};

const acknowledgeReview = (
  reviewId: string,
  userId: string,
  userName: string
) => {
  return admin.firestore().collection(reviewsCollection).doc(reviewId).update({
    status: 'acknowledged',
    reviewer: userId,
    reviewerName: userName,
  });
};

const createReview = (
  nextReviewerId: string,
  nextReviewerName: string,
  text: string,
  userId: string,
  userName: string
) => {
  functions.logger.info(`creating review for ${userName}`);
  return admin.firestore().collection(reviewsCollection).add({
    reviewer: nextReviewerId,
    reviewerName: nextReviewerName,
    status: 'pending',
    pr: text,
    requestor: userId,
    requestorName: userName,
  });
};

const changeAvailability = async (userId: string, available: boolean) => {
  functions.logger.info(`changing ${userId} availability to ${available}`);
  try {
    const reviewQueueDoc = await getReviewQueue(userId);
    const reviewQueue = reviewQueueDoc.data()!.users as User[];
    const index = reviewQueue.findIndex((user) => user.id === userId);
    reviewQueue[index].available = available;
    await admin
      .firestore()
      .collection(reviewQueueCollection)
      .doc(reviewQueueDoc.id)
      .update({ users: reviewQueue });
  } catch (e) {
    functions.logger.error(e);
    throw e;
  }
};

const assignNextReviewer = (
  reviewId: string,
  nextReviewerId: string,
  nextReviewerName: string
) => {
  return admin.firestore().collection(reviewsCollection).doc(reviewId).update({
    reviewer: nextReviewerId,
    reviewerName: nextReviewerName,
  });
};

export {
  updateReviewQueue,
  getPendingReviewsForUser,
  getPendingReviewsList,
  getReviewById,
  getReviewQueue,
  acknowledgeReview,
  createReview,
  assignNextReviewer,
  changeAvailability,
};
