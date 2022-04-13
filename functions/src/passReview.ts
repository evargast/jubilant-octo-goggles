import * as functions from 'firebase-functions';
import { assignNextReviewer, getReviewById } from './adminUtils';
import getNextReviewer from './getNextReviewer';
import sendActionResponse from './sendActionResponse';

const passReview = async (
  response: functions.Response,
  userId: string,
  reviewId: string,
  responseUrl: string
) => {
  try {
    const reviewDoc = await getReviewById(reviewId);
    const review = reviewDoc.data()!;
    const [nextReviewerId, nextReviewerName] = await getNextReviewer(
      review.requestor,
      userId
    );
    sendActionResponse(responseUrl, {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${review.reviewerName} is unavailable. <@${nextReviewerId}> is now in charge of reviewing pull request <https://git.corp.adobe.com/AnalyticsUI/analytics_web_spa/pull/${review.pr}|#${review.pr}>`,
          },
        },
      ],
      response_type: 'in_channel',
      replace_original: 'false',
    });
    await assignNextReviewer(reviewId, nextReviewerId, nextReviewerName);
    return;
  } catch (e) {
    functions.logger.error(e);
    response.send('there was an error passing your review');
    return;
  }
};

export default passReview;
