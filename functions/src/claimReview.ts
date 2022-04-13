import * as functions from 'firebase-functions';
import { acknowledgeReview, updateReviewQueue } from './adminUtils';
import sendActionResponse from './sendActionResponse';

const claimReview = async (
  response: functions.Response,
  userName: string,
  userId: string,
  reviewId: string,
  pr: string,
  responseUrl: string
) => {
  functions.logger.info(`claiming for ${userName}`);
  functions.logger.info(`response URL ${responseUrl}`);
  try {
    await acknowledgeReview(reviewId, userId, userName);
    updateReviewQueue(userId);
    await sendActionResponse(responseUrl, {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Thank you <@${userId}> for reviewing <https://git.corp.adobe.com/AnalyticsUI/analytics_web_spa/pull/${pr}|#${pr}>!`,
          },
        },
      ],
      response_type: 'in_channel',
      replace_original: 'false',
    });
    return;
  } catch (e) {
    functions.logger.error(e);
    response.send('there was an error claiming');
    return;
  }
};

export default claimReview;
