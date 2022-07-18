import fetch from 'node-fetch';
import * as functions from 'firebase-functions';

const sendActionResponse = async (
  responseUrl: string,
  responseBody: Record<string, any>
) => {
  functions.logger.info(
    `sending action response to ${responseUrl}`,
    responseBody
  );
  if (
    process.env.FUNCTIONS_EMULATOR &&
    responseUrl.startsWith('https://hooks.slack.com')
  ) {
    return;
  }
  const response = await fetch(responseUrl, {
    method: 'POST',
    body: JSON.stringify(responseBody),
  });
  const responseJson = await response.json();
  functions.logger.info(responseJson);
};

export default sendActionResponse;
