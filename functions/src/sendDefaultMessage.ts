import sendActionResponse from './sendActionResponse';

const sendDefaultMessage = async (responseUrl: string) => {
  await sendActionResponse(responseUrl, {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `I'm sorry, I don't understand. Please try one of the following:

*ack* - acknowledge your review
*list* - list pending reviews
*purge* - purge all pending reviews
*<pr number>* - add a review for the given pull request`,
        },
      },
    ],
    response_type: 'ephemeral',
  });
};

export default sendDefaultMessage;
