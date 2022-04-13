import * as functions from 'firebase-functions';
import { getPendingReviewsList } from './adminUtils';

const listReviews = async (response: functions.Response) => {
  const reviewDocs = await getPendingReviewsList();
  const blocks = reviewDocs.docs.map((reviewDoc) => {
    const review = reviewDoc.data()!;
    return {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${review.reviewerName}* is in charge of reviewing pull request <https://git.corp.adobe.com/AnalyticsUI/analytics_web_spa/pull/${review.pr}|#${review.pr}>`,
      },
    };
  });
  response.send({
    blocks,
    response_type: 'in_channel',
  });
};

export default listReviews;
