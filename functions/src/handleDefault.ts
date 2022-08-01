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

export function isNumeric(num : string){
  return !isNaN(+num)
}

const handleDefault = async (
  text: string,
  userName: string,
  userId: string,
  responseUrl: string
) => {
  // Create new review
  if (text) {
    try {
      let prUrl = '';
      let prNum = '';
      text = text.replace(/[<>]/g, '');
      if (isUrl(text)) { /* If is a full URL, can make PR from that */ 
        prNum = getPrNumberFromUrl(text);
        prUrl = text;
      } else if (isNumeric(text)) { /* If is numeric, assume is web_spa */
        prNum = text;
        prUrl = `https://git.corp.adobe.com/AnalyticsUI/analytics_web_spa/pull/${text}`;
      } else {
        prNum = 'Input not valid - supply a valid PR number or URL';
        prUrl = text;
      }
      const [nextReviewerId, nextReviewerName] = await getNextReviewer(
        userId /* requestor */
      );
      const doc = await createReview(
        nextReviewerId,
        nextReviewerName,
        prUrl,
        userId,
        userName
      );
      console.log(prNum, prUrl);
      await sendActionResponse(responseUrl, {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `<@${nextReviewerId}> is in charge of reviewing pull request <${prUrl}|#${prNum}>`,
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
                value: `${doc.id}|${prUrl}`,
                action_id: 'acknowledge',
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Pass',
                },
                value: `${doc.id}|${prUrl}`,
                action_id: 'pass',
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Claim',
                },
                value: `${doc.id}|${prUrl}`,
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
