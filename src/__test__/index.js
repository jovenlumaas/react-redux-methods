import { createStateSelector } from '../index';
test('createStateSelector', () => {
  expect(
    createStateSelector(
      {
        name: {
          firstName: 'Joven',
          lastName: 'Lumaa-s',
        },
      },
      {
        getName: (s) => s.name,
      },
    ),
  ).toBe({
    firstName: 'Joven',
    lastName: 'Lumaa-s',
  });
});
