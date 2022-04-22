export const generateReviewQueue = () => ({
  users: [
    {
      name: 'James',
      id: 'W4R50GH32',
      available: true,
    },
    {
      name: 'Brian',
      available: true,
      id: 'W4RU8E59T',
    },
    {
      name: 'Abigail',
      available: true,
      id: 'U01MJGBHCH0',
    },
    {
      name: 'Richard',
      available: true,
      id: 'W4RPQR9UK',
    },
    {
      name: 'Courtney',
      available: true,
      id: 'W4SG8JQFQ',
    },
    {
      name: 'Richie',
      id: 'W5M7MT58U',
      available: true,
    },
    {
      name: 'Bekah',
      id: 'U02G33TUS7J',
      available: true,
    },
    {
      name: 'Eduardo',
      id: 'WL0K9RQF2',
      available: 'true',
    },
  ],
});

export const generateReview = (overrides = {}) => ({
  pr: '15884',
  requestor: 'W4SG8JQFQ',
  requestorName: 'cofergus',
  reviewer: 'W5M7MT58U',
  reviewerName: 'Richie',
  status: 'pending',
  ...overrides,
});
