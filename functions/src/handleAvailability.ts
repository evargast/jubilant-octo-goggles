import { changeAvailability } from './adminUtils';
import sendActionResponse from './sendActionResponse';

const isAvailabilityText = (text: string) => {
  return isMakeAvailable(text) || isMakeUnavailable(text);
};

const isMakeAvailable = (text: string) => {
  return ['a', '-a', 'available'].includes(text);
};

const isMakeUnavailable = (text: string) => {
  return ['u', '-u', 'unavailable'].includes(text);
};

const adjustAvailability = async (
  text: string,
  userName: string,
  userId: string,
  responseUrl: string
) => {
  if (isMakeAvailable(text)) {
    await changeAvailability(userId, true);
    await sendActionResponse(responseUrl, {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<@${userId}> is now available for reviews`,
          },
        },
      ],
      response_type: 'ephemeral',
    });
  } else if (isMakeUnavailable(text)) {
    await changeAvailability(userId, false);
    await sendActionResponse(responseUrl, {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<@${userId}> is now unavailable, until further notice. ${userName}, remember to set yourself available when you return!`,
          },
        },
      ],
      response_type: 'ephemeral',
    });
  }
};

export { isAvailabilityText, adjustAvailability };
