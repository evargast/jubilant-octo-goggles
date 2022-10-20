import { User } from '.';
import { getReviewQueue } from './adminUtils';

const getNextReviewer = async (requestor: string, userId?: string) => {
  const reviewerQueueDoc = await getReviewQueue(requestor);

  const reviewerQueue = reviewerQueueDoc.data()!.users as User[];
  const availableReviewers = reviewerQueue.filter(
    (reviewer) => reviewer.available
  );

  let nextReviewer =
    availableReviewers[0].id !== requestor
      ? availableReviewers[0]
      : availableReviewers[1];

  if (userId) {
    const index = availableReviewers.findIndex(
      (user: User) => user.id === userId
    );

    if (index !== -1 && index < availableReviewers.length - 1) {
      nextReviewer = availableReviewers[index + 1];
    }
  }
  return [nextReviewer.id, nextReviewer.name];
};

export default getNextReviewer;
