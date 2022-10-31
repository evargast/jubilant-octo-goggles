import {
  adjustAvailability,
  isAvailabilityText,
} from '../src/handleAvailability';
import * as adminUtilMock from '../src/adminUtils';
import * as admin from 'firebase-admin';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';

jest.useFakeTimers();

describe('handleAvailability tests', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let testEnv: RulesTestEnvironment;
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'sundance-prs',
    });
    if (
      !admin.apps.find((app) => app && app.options.projectId === 'sundance-prs')
    ) {
      admin.initializeApp({
        projectId: 'sundance-prs',
      });
    }
  });

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(adminUtilMock, 'changeAvailability');
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  test('accepts different text for un/available', async () => {
    expect(isAvailabilityText('-u')).toBeTruthy();
    expect(isAvailabilityText('-a')).toBeTruthy();
    expect(isAvailabilityText('u')).toBeTruthy();
    expect(isAvailabilityText('a')).toBeTruthy();
    expect(isAvailabilityText('available')).toBeTruthy();
    expect(isAvailabilityText('unavailable')).toBeTruthy();
    expect(isAvailabilityText('other')).toBeFalsy();
  });

  test('can set self unavailable', async () => {
    const userId = 'id123';
    adjustAvailability('-u', 'myName', userId, 'nonsenseURL');
    expect(adminUtilMock.changeAvailability).toHaveBeenCalledWith(
      userId,
      false
    );
  });
});
