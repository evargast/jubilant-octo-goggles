import * as functions from 'firebase-functions';
import getNextReviewer from './getNextReviewer';
import sendDefaultMessage from './sendDefaultMessage';
import sendActionResponse from './sendActionResponse';
import { createReview } from './adminUtils';

const handleDefault = async (
  response: functions.Response,
  text: string,
  userName: string,
  userId: string,
  responseUrl: string
) => {
  // Create new review
  if (text) {
    functions.logger.info(`creating review for ${userName}`);
    try {
      const [nextReviewerId, nextReviewerName] = await getNextReviewer(
        userId /* requestor */
      );
      const doc = await createReview(
        nextReviewerId,
        nextReviewerName,
        text,
        userId,
        userName
      );
      await sendActionResponse(responseUrl, {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `<@${nextReviewerId}> is in charge of reviewing pull request <https://git.corp.adobe.com/AnalyticsUI/analytics_web_spa/pull/${text}|#${text}>`,
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Acknowledge',
                },
                value: `${doc.id}|${text}`,
                action_id: 'acknowledge',
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Pass',
                },
                value: `${doc.id}|${text}`,
                action_id: 'pass',
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Claim',
                },
                value: `${doc.id}|${text}`,
                action_id: 'claim',
              },
            ],
          },
        ],
        response_type: 'in_channel',
      });
      return;
    } catch (e) {
      functions.logger.error(e);
      await sendActionResponse(responseUrl, {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'text',
              text: 'there was an error adding your review',
            },
          },
        ],
      });
      return;
    }
  }
  await sendDefaultMessage(responseUrl);
  return;
};

export default handleDefault;
