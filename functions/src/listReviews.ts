import * as functions from 'firebase-functions';
import { getPendingReviewsList } from './adminUtils';
import { getPrNumberFromUrl } from './handleDefault';

const listReviews = async (response: functions.Response) => {
  const reviewDocs = await getPendingReviewsList();
  const blocks = reviewDocs.docs.map((reviewDoc) => {
    const review = reviewDoc.data()!;
    return {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${review.reviewerName}* is in charge of reviewing pull request <${review.pr}|#${getPrNumberFromUrl(review.pr)}>`,
      },
    };
  });
  response.send({
    blocks,
    response_type: 'in_channel',
  });
};

export default listReviews;
