import * as functions from 'firebase-functions';
import { ReviewerQueue } from '.';
import { getReviewQueue } from './adminUtils';

const toggleAvailability = async (
  response: functions.Response,
  userId: string
) => {
  let availability;
  const reviewerQueueDoc = await getReviewQueue(userId);
  const reviewerQueue = reviewerQueueDoc.data()! as ReviewerQueue;
  reviewerQueue.users = reviewerQueue.users.map((user) => {
    if (user.id === userId) {
      user.available = !user.available;
      availability = user.available;
    }
    return user;
  });
  await reviewerQueueDoc.ref.set(reviewerQueue);
  response.send({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Your availability has been set to ${
            availability ? 'available' : 'unavailable'
          }`,
        },
      },
    ],
    response_type: 'ephemeral',
  });
};

export default toggleAvailability;
