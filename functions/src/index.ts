import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import handleDefault from './handleDefault';
import passReview from './passReview';
import claimReview from './claimReview';
import sendActionResponse from './sendActionResponse';
admin.initializeApp();

export interface User {
  available: boolean;
  id: string;
  name: string;
}

export interface ReviewerQueue {
  users: User[];
}

let baseUrl = 'https://us-central1-sundance-prs.cloudfunctions.net';
if (process.env.FUNCTIONS_EMULATOR) {
  baseUrl = 'http://localhost:5001/sundance-prs/us-central1';
}
// TODO don't allow assigning reviews to yourself ✅
// TODO don't allow assigning multiple reviews to one person
// TODO add a list function ✅
// TODO add a purge function ✅
// TODO lock purge function down to only me
// TODO link to the review page ✅
// TODO @mention the assignee ✅
// TODO add person unavailable time ✅
// TODO pass [pr number]
// TODO claim a review
// TODO have ack post back to channel ✅
export const pullRequest = functions.https.onRequest(
  async (request, response) => {
    sendActionResponse(`${baseUrl}/pullRequestInternal`, request.body);
    response.send({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Working on it!',
          },
        },
      ],
      response_type: 'ephemeral',
    });
  }
);

export const pullRequestInternal = functions.https.onRequest(
  async (request, response) => {
    functions.logger.info('Hello logs!', { structuredData: true });
    const {
      text,
      user_id: userId,
      user_name: userName,
      response_url: responseUrl,
    } = JSON.parse(request.body);
    functions.logger.info('request body', userId, userName, responseUrl, text);
    handleDefault(response, text, userName, userId, responseUrl);
  }
);

export const handleAction = functions.https.onRequest(
  async (request, response) => {
    sendActionResponse(`${baseUrl}/handleActionInternal`, request.body);
    response.send('Working on it!');
  }
);

export const handleActionInternal = functions.https.onRequest(
  async (request, response) => {
    functions.logger.info('request body', request.body);
    const { payload: payloadString } = JSON.parse(request.body);
    functions.logger.info('payload', payloadString);
    functions.logger.info('payload', payloadString.response_url);
    const payload = JSON.parse(payloadString);
    const {
      user: { id: userId, name: userName },
      actions,
      response_url: responseUrl,
    } = payload;
    const { action_id: actionId, value } = actions[0];
    const [reviewId, pr] = value.split('|');
    switch (actionId) {
      case 'pass':
        await passReview(response, userId, reviewId, responseUrl);
        break;
      case 'claim':
      case 'acknowledge':
        await claimReview(
          response,
          userName,
          userId,
          reviewId,
          pr,
          responseUrl
        );
        break;
      default:
        functions.logger.info(`unknown action ${actionId}`);
        response.send('unknown action');
        break;
    }
  }
);
