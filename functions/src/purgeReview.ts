import * as functions from 'firebase-functions';
import { getPendingReviewsList } from './adminUtils';

const purgeReview = async (response: functions.Response) => {
  try {
    const reviewDocs = await getPendingReviewsList();
    await Promise.all(
      reviewDocs.docs.map((reviewDoc) => reviewDoc.ref.delete())
    );
    response.send('purged');
    return;
  } catch (e) {
    functions.logger.error(e);
    response.send('there was an error purging');
    return;
  }
};

export default purgeReview;
