import * as functions from 'firebase-functions';
import getNextReviewer from './getNextReviewer';
import sendDefaultMessage from './sendDefaultMessage';
import sendActionResponse from './sendActionResponse';
import { createReview } from './adminUtils';

export const getPrNumberFromUrl = (url: string) => {
  return url.split('/').pop() ?? '';
};

export const isUrl = (text: string) => {
  let url;

  try {
    url = new URL(text);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};

const handleDefault = async (
  response: functions.Response,
  text: string,
  userName: string,
  userId: string,
  responseUrl: string
) => {
  // Create new review
  if (text) {
    try {
      let url = '';
      let pr = '';
      if (isUrl(text)) {
        pr = getPrNumberFromUrl(text);
        url = text;
      } else {
        pr = text;
        url = `https://git.corp.adobe.com/AnalyticsUI/analytics_web_spa/pull/${text}`;
      }
      const [nextReviewerId, nextReviewerName] = await getNextReviewer(
        userId /* requestor */
      );
      const doc = await createReview(
        nextReviewerId,
        nextReviewerName,
        url,
        userId,
        userName
      );
      await sendActionResponse(responseUrl, {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `<@${nextReviewerId}> is in charge of reviewing pull request <${url}|#${pr}>`,
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
                value: `${doc.id}|${url}`,
                action_id: 'acknowledge',
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Pass',
                },
                value: `${doc.id}|${url}`,
                action_id: 'pass',
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Claim',
                },
                value: `${doc.id}|${url}`,
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
