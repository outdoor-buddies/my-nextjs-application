import { test, expect } from './auth-utils';

test.slow();

test('test user access and functionality', async ({ getUserPage }) => {
  // Authenticate as a regular user
  const userPage = await getUserPage('john@foo.com', 'changeme');

  // Navigate home
  await userPage.goto('http://localhost:3000/');

  // Confirm logged in
  await expect(
    userPage.getByRole('button', { name: 'john@foo.com' })
  ).toBeVisible({ timeout: 10000 });

  // Check navigation links
  await expect(
    userPage.getByRole('link', { name: 'Announcements' })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    userPage.getByRole('link', { name: 'Hikes' })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    userPage.getByRole('link', { name: 'Groups' })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    userPage.getByRole('link', { name: 'Profile' })
  ).toBeVisible({ timeout: 5000 });

  // Test Accessibility of these pages

  // Test Announcements page
  await userPage.goto('http://localhost:3000/announcements');

  await expect(
    userPage.getByRole('heading', { name: 'Announcements & Events' })
  ).toBeVisible({ timeout: 5000 });

  // Test Hikes page

await userPage.goto('http://localhost:3000/hikes', {
	waitUntil: 'domcontentloaded',
});

  await expect(
    userPage.getByRole('heading', { name: 'List of Hikes' })
  ).toBeVisible({ timeout: 5000 });

  // Test Groups page

  await userPage.goto('http://localhost:3000/groups');

  await expect(
    userPage.getByRole('heading', { name: 'Groups' })
  ).toBeVisible({ timeout: 10000 });

  // Test Profiles page
  await userPage.goto('http://localhost:3000/profile');

  await expect(
    userPage.getByRole('heading', { name: 'Profiles' })
  ).toBeVisible({ timeout: 5000 });

  // Test all View Details accessibility
  // Test Announcements details page
  await userPage.goto('http://localhost:3000/announcements');

  const eventCard = userPage.locator('.card').filter({
    hasText: 'Summer Hiking Meetup',
  });

  await expect(eventCard).toBeVisible({ timeout: 5000 });

  await eventCard.getByRole('button', { name: 'View Details' }).click();

  await expect(
    userPage.getByText('Summer Hiking Meetup'),
  ).toBeVisible({ timeout: 5000 });

  // Test Hikes details page
  await userPage.goto('http://localhost:3000/hikes');

  const hikeCard = userPage.locator('.card').filter({
    hasText: 'Diamond Head',
  });

  await expect(hikeCard).toBeVisible({ timeout: 5000 });

  await hikeCard.getByText('Diamond Head', { exact: true }).click();

  // Wait for the hike details navigation to finish
  await userPage.waitForURL(/\/hikes\/.+/, { timeout: 10000 });

  await expect(
    userPage.getByText('Diamond Head', { exact: true }),
  ).toBeVisible({ timeout: 5000 });

  // Test Groups details page
  await userPage.goto('http://localhost:3000/groups', {
    waitUntil: 'domcontentloaded',
  });

  await expect(
    userPage.getByRole('heading', { name: 'Groups' })
  ).toBeVisible({ timeout: 10000 });

  const groupCard = userPage.locator('.card').filter({
    hasText: 'Mathemagical Hikes',
  });

  await expect(groupCard).toBeVisible({ timeout: 5000 });

  await groupCard.getByRole('button', { name: 'View Details' }).click();

  await expect(
    userPage.getByRole('heading', { name: 'Mathemagical Hikes' }),
  ).toBeVisible({ timeout: 5000 });

  // Test Profiles details page
  await userPage.goto('http://localhost:3000/profile');

  const profileCard = userPage.locator('.card').filter({
    hasText: 'Hanako Yamada',
  });

  await expect(profileCard).toBeVisible({ timeout: 5000 });

  await profileCard.getByRole('button', { name: 'View Details' }).click();

  await expect(
    userPage.getByRole('heading', { name: 'Hanako Yamada' }),
  ).toBeVisible({ timeout: 5000 });

  // Test Hikes' search and filters
  await userPage.goto('http://localhost:3000/hikes');

  const searchBox = userPage.getByPlaceholder('Find your place');

  await searchBox.fill('Koko');
  await userPage.getByRole('button', { name: 'Search' }).click();

  await userPage.getByRole('combobox').selectOption('HARD');

  await userPage.getByPlaceholder('Max distance (miles)').fill('1');

  await expect(
    userPage.getByText('Koko Head')
  ).toBeVisible({ timeout: 5000 });

  // Test Group search and commitment filter
  await userPage.goto('http://localhost:3000/groups');

  const groupSearchBox = userPage.getByPlaceholder('Find your people');

  await groupSearchBox.fill('Mathemagical');
  await userPage.getByRole('button', { name: 'Search' }).click();

  await userPage.getByRole('combobox').selectOption('Casual');

  await expect(
    userPage.getByText('Mathemagical Hikes')
  ).toBeVisible({ timeout: 5000 });

  // Test Profile search
  await userPage.goto('http://localhost:3000/profile');

  const profileSearchBox = userPage.getByPlaceholder('Find other people');

  await profileSearchBox.fill('Hanako');
  await userPage.getByRole('button', { name: 'Search' }).click();

  await expect(
    userPage.getByText('Hanako Yamada')
  ).toBeVisible({ timeout: 5000 });

  // Test Add Profile page
  await userPage.goto('http://localhost:3000/profile/add');

  await expect(
    userPage.getByRole('heading', { name: 'Create Profile' })
  ).toBeVisible({ timeout: 5000 });

  // Ensure fields and buttons exist
  await expect(
    userPage.getByLabel('Name', { exact: true })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    userPage.getByLabel('Image URL (please use a square image)', { exact: true })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    userPage.getByLabel('Status', { exact: true })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    userPage.getByLabel('Description', { exact: true })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    userPage.getByLabel('Description Image URL', { exact: true })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    userPage.getByLabel('Group Name', { exact: true })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    userPage.getByRole('button', { name: 'Submit' })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    userPage.getByRole('button', { name: 'Reset' })
  ).toBeVisible({ timeout: 5000 });

  // Fill profile with test data
  await userPage.getByLabel('Name', { exact: true }).fill(
    'Playwright Test Profile'
  );

  await userPage.getByLabel(
    'Image URL (please use a square image)',
    { exact: true }
  ).fill('https://example.com/profile.jpg');

  await userPage.getByLabel('Status', { exact: true }).fill(
    'Profile created by Playwright.'
  );

  await userPage.getByLabel('Description', { exact: true }).fill(
    'This profile was created by the regular user Playwright test.'
  );

  await userPage.getByLabel('Description Image URL', { exact: true }).fill(
    'https://example.com/description.jpg'
  );

  await userPage.getByLabel('Group Name', { exact: true }).fill(
    'Playwright Test Group'
  );

  // Test Reset
  await userPage.getByRole('button', { name: 'Reset' }).click();

  await expect(
    userPage.getByLabel('Name', { exact: true })
  ).toHaveValue('');

  await expect(
    userPage.getByLabel(
      'Image URL (please use a square image)',
      { exact: true }
    )
  ).toHaveValue('');

  await expect(
    userPage.getByLabel('Status', { exact: true })
  ).toHaveValue('');

  await expect(
    userPage.getByLabel('Description', { exact: true })
  ).toHaveValue('');

  await expect(
    userPage.getByLabel('Description Image URL', { exact: true })
  ).toHaveValue('');

  await expect(
    userPage.getByLabel('Group Name', { exact: true })
  ).toHaveValue('');

  // Fill profile again and submit
  await userPage.getByLabel('Name', { exact: true }).fill(
    'Playwright Test Profile'
  );

  await userPage.getByLabel(
    'Image URL (please use a square image)',
    { exact: true }
  ).fill('https://example.com/profile.jpg');

  await userPage.getByLabel('Status', { exact: true }).fill(
    'Profile created by Playwright.'
  );

  await userPage.getByLabel('Description', { exact: true }).fill(
    'This profile was created by the regular user Playwright test.'
  );

  await userPage.getByLabel('Description Image URL', { exact: true }).fill(
    'https://example.com/description.jpg'
  );

  await userPage.getByLabel('Group Name', { exact: true }).fill(
    'Playwright Test Group'
  );

  await userPage.getByRole('button', { name: 'Submit' }).click();

  // Verify your profile has been added to the profiles page
  await userPage.goto('http://localhost:3000/profile', {
    waitUntil: 'domcontentloaded',
  });

  await expect(
    userPage.getByText('Playwright Test Profile', { exact: true })
  ).toBeVisible({ timeout: 5000 });

  // Open the profile details page
  const prProfileCard = userPage.locator('.card').filter({
    hasText: 'Playwright Test Profile',
  }).first();

  await expect(prProfileCard).toBeVisible({ timeout: 5000 });

  await prProfileCard.getByRole('button', { name: 'View Details' }).click();

  // Confirm profile details page loaded
  await expect(
    userPage.getByRole('heading', { name: 'Playwright Test Profile' })
  ).toBeVisible({ timeout: 5000 });

  // Test Edit Profile
  await userPage.getByRole('link', { name: 'Edit Profile' }).click();

  // Confirm Edit Profile page loaded
  await expect(
    userPage.getByRole('heading', { name: 'Edit Profile' })
  ).toBeVisible({ timeout: 5000 });

  // Test existing profile data
  await expect(
    userPage.getByLabel('Name', { exact: true })
  ).toHaveValue('Playwright Test Profile');

  await expect(
    userPage.getByLabel('Image URL', { exact: true })
  ).toHaveValue('https://example.com/profile.jpg');

  await expect(
    userPage.getByLabel('Summary', { exact: true })
  ).toHaveValue('Profile created by Playwright.');

  await expect(
    userPage.getByLabel('Description', { exact: true })
  ).toHaveValue(
    'This profile was created by the regular user Playwright test.'
  );

  await expect(
    userPage.getByLabel('Description Image URL', { exact: true })
  ).toHaveValue('https://example.com/description.jpg');

  await expect(
    userPage.getByLabel('Group Name', { exact: true })
  ).toHaveValue('Playwright Test Group');

  // Test Reset
  await userPage.getByRole('button', { name: 'Reset' }).click();

  await expect(
    userPage.getByLabel('Name', { exact: true })
  ).toHaveValue('Playwright Test Profile');

  await expect(
    userPage.getByLabel('Image URL', { exact: true })
  ).toHaveValue('https://example.com/profile.jpg');

  await expect(
    userPage.getByLabel('Summary', { exact: true })
  ).toHaveValue('Profile created by Playwright.');

  await expect(
    userPage.getByLabel('Description', { exact: true })
  ).toHaveValue(
    'This profile was created by the regular user Playwright test.'
  );

  await expect(
    userPage.getByLabel('Description Image URL', { exact: true })
  ).toHaveValue('https://example.com/description.jpg');

  await expect(
    userPage.getByLabel('Group Name', { exact: true })
  ).toHaveValue('Playwright Test Group');

  // Fill form with edited data
  await userPage.getByLabel('Name', { exact: true }).fill(
    'Playwright Edited Profile'
  );

  await userPage.getByLabel('Image URL', { exact: true }).fill(
    'https://example.com/edited-profile.jpg'
  );

  await userPage.getByLabel('Summary', { exact: true }).fill(
    'Profile edited by Playwright.'
  );

  await userPage.getByLabel('Description', { exact: true }).fill(
    'This profile was edited by the regular user Playwright test.'
  );

  await userPage.getByLabel('Description Image URL', { exact: true }).fill(
    'https://example.com/edited-description.jpg'
  );

  await userPage.getByLabel('Group Name', { exact: true }).fill(
    'Playwright Edited Group'
  );

  // Submit edited profile
  await userPage.getByRole('button', { name: 'Submit' }).click();

  // Wait for profile details page
  await userPage.waitForURL(/\/profile\/.+/, { timeout: 10000 });

  // Go back to profiles and verify the edited profile
  await userPage.goto('http://localhost:3000/profile', {
    waitUntil: 'domcontentloaded',
  });

  await expect(
    userPage.getByText('Playwright Edited Profile', { exact: true })
  ).toBeVisible({ timeout: 10000 });

  // Go to the edited profile's details page
  const editedProfileCard = userPage.locator('.card').filter({
    hasText: 'Playwright Edited Profile',
  }).first();

  await expect(editedProfileCard).toBeVisible({ timeout: 5000 });

  await editedProfileCard.getByRole('button', { name: 'View Details' }).click();

  // Confirm we are on the edited profile
  await expect(
    userPage.getByRole('heading', { name: 'Playwright Edited Profile' })
  ).toBeVisible({ timeout: 5000 });

  // Click Delete Profile
  await userPage.getByRole('button', { name: 'Delete Profile' }).click();

  await userPage.goto('http://localhost:3000/profile', {
    waitUntil: 'domcontentloaded',
  });

  // Confirm profile was deleted
  await expect(
    userPage.getByText('Playwright Edited Profile', { exact: true })
  ).not.toBeVisible({ timeout: 10000 });

  // Test Add Group page
  await userPage.goto('http://localhost:3000/groups');

  // Open Add Group page
  await userPage.getByRole('link', { name: 'Add a Group' }).click();

  await expect(
    userPage.getByRole('heading', { name: 'Create Group' })
  ).toBeVisible({ timeout: 5000 });

  // Ensure fields and buttons exist
  await expect(
    userPage.getByLabel('Name', { exact: true })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    userPage.getByLabel('Image URL (please use a square image)', { exact: true })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    userPage.getByLabel('Members', { exact: true })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    userPage.getByLabel('Max Members', { exact: true })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    userPage.getByLabel('Commitment', { exact: true })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    userPage.getByLabel('Description', { exact: true })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    userPage.getByRole('button', { name: 'Submit' })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    userPage.getByRole('button', { name: 'Reset' })
  ).toBeVisible({ timeout: 5000 });

  // Fill group with test data
  await userPage.getByLabel('Name', { exact: true }).fill('Playwright Test Group');

  await userPage.getByLabel('Image URL (please use a square image)', { exact: true }).fill(
    'https://example.com/group.jpg'
  );

  await userPage.getByLabel('Members', { exact: true }).fill('5');

  await userPage.getByLabel('Max Members').fill('10');

  await userPage.getByLabel('Commitment', { exact: true }).selectOption('Moderate');

  await userPage.getByLabel('Description', { exact: true }).fill(
    'This group was created by the regular user Playwright test.'
  );

  // Test Reset
  await userPage.getByRole('button', { name: 'Reset' }).click();

  await expect(
    userPage.getByLabel('Name', { exact: true })
  ).toHaveValue('');

  await expect(
    userPage.getByLabel('Image URL (please use a square image)', { exact: true })
  ).toHaveValue('');

  await expect(
    userPage.getByLabel('Members', { exact: true })
  ).toHaveValue('0');

  await expect(
    userPage.getByLabel('Max Members')
  ).toHaveValue('');

  await expect(
    userPage.getByLabel('Commitment', { exact: true })
  ).toHaveValue('');

  await expect(
    userPage.getByLabel('Description', { exact: true })
  ).toHaveValue('');

  // Fill group again and submit
  await userPage.getByLabel('Name', { exact: true }).fill('Playwright Test Group');
  await userPage.getByLabel('Image URL (please use a square image)', { exact: true }).fill(
    'https://example.com/group.jpg'
  );
  await userPage.getByLabel('Members', { exact: true }).fill('5');
  await userPage.getByLabel('Max Members').fill('10');
  await userPage.getByLabel('Commitment', { exact: true }).selectOption('Moderate');
  await userPage.getByLabel('Description', { exact: true }).fill(
    'This group was created by the regular user Playwright test.'
  );

  await userPage.getByRole('button', { name: 'Submit' }).click();

  await userPage.goto('http://localhost:3000/groups', {
    waitUntil: 'domcontentloaded',
  });

  const prGroupCard = userPage.locator('.card').filter({
    hasText: 'Playwright Test Group',
  });

  await expect(prGroupCard.first()).toBeVisible({ timeout: 5000 });

  // Open the group details page
  await prGroupCard.first().getByRole('button', { name: 'View Details' }).click();

  // Confirm group details page loaded
  await expect(
    userPage.getByRole('heading', { name: 'Playwright Test Group' })
  ).toBeVisible({ timeout: 5000 });

  // Open Edit Group page
  await userPage.getByRole('link', { name: 'Edit Group' }).click();

  // Confirm Edit Group page loaded
  await expect(
    userPage.getByRole('heading', { name: 'Edit Group' })
  ).toBeVisible({ timeout: 5000 });

  // Check existing group data
  await expect(
    userPage.getByLabel('Name', { exact: true })
  ).toHaveValue('Playwright Test Group');

  await expect(
    userPage.getByLabel('Image URL', { exact: true })
  ).toHaveValue('https://example.com/group.jpg');

  await expect(
    userPage.getByLabel('Members', { exact: true })
  ).toHaveValue('5');

  await expect(
    userPage.getByLabel('Maximum Members')
  ).toHaveValue('10');

  await expect(
    userPage.getByLabel('Commitment', { exact: true })
  ).toHaveValue('Moderate');

  await expect(
    userPage.getByLabel('Description', { exact: true })
  ).toHaveValue(
    'This group was created by the regular user Playwright test.'
  );

  // Test Reset
  await userPage.getByRole('button', { name: 'Reset' }).click();

  await expect(
    userPage.getByLabel('Name', { exact: true })
  ).toHaveValue('Playwright Test Group');

  await expect(
    userPage.getByLabel('Image URL', { exact: true })
  ).toHaveValue('https://example.com/group.jpg');

  await expect(
    userPage.getByLabel('Members', { exact: true })
  ).toHaveValue('5');

  await expect(
    userPage.getByLabel('Maximum Members')
  ).toHaveValue('10');

  await expect(
    userPage.getByLabel('Commitment', { exact: true })
  ).toHaveValue('Moderate');

  await expect(
    userPage.getByLabel('Description', { exact: true })
  ).toHaveValue(
    'This group was created by the regular user Playwright test.'
  );

  // Fill form with edited data
  await userPage.getByLabel('Name', { exact: true }).fill(
    'Playwright Edited Group'
  );

  await userPage.getByLabel('Image URL', { exact: true }).fill(
    'https://example.com/edited-group.jpg'
  );

  await userPage.getByLabel('Members', { exact: true }).fill('7');

  await userPage.getByLabel('Maximum Members').fill('15');

  await userPage.getByLabel('Commitment', { exact: true }).selectOption(
    'Serious'
  );

  await userPage.getByLabel('Description', { exact: true }).fill(
    'This group was edited by the regular user Playwright test.'
  );

  // Submit edited group
  await userPage.getByRole('button', { name: 'Submit' }).click();

  // Return to Groups page and verify edited group
  await userPage.goto('http://localhost:3000/groups');

  await expect(
    userPage.locator('.card').filter({
      hasText: 'Playwright Edited Group',
    }).first()
  ).toBeVisible({ timeout: 5000 });

  // Test Request to Join and Create Post
  await userPage.goto('http://localhost:3000/groups');

  const editedGroupCard = userPage.locator('.card').filter({
    hasText: 'Playwright Edited Group',
  }).first();

  await expect(editedGroupCard).toBeVisible({ timeout: 5000 });

  // Click Request to Join
  await editedGroupCard.getByRole('link', { name: 'Group Forum' }).click();

  // Confirm forum page loaded
  await expect(
    userPage.getByRole('heading', { name: 'Playwright Edited Group Forum' })
  ).toBeVisible({ timeout: 5000 });

  // Open Create Post
  await userPage.locator('a[href$="/forum/add"]').click();

  // Confirm Create Post page loaded
  await expect(
    userPage.getByRole('heading', { name: 'Create Post' })
  ).toBeVisible({ timeout: 5000 });

  // Fill post
  await userPage.getByLabel('Title').fill('Playwright Test Post');

  await userPage.getByLabel('Description', { exact: true }).fill(
    'This post was created by the regular user Playwright test.'
  );

  // Test Reset
  await userPage.getByRole('button', { name: 'Reset' }).click();

  await expect(
    userPage.getByLabel('Title')
  ).toHaveValue('');

  await expect(
    userPage.getByLabel('Description', { exact: true })
  ).toHaveValue('');

  // Fill post again
  await userPage.getByLabel('Title').fill('Playwright Test Post');

  await userPage.getByLabel('Description', { exact: true }).fill(
    'This post was created by the regular user Playwright test.'
  );

  // Submit post
  await userPage.getByRole('button', { name: 'Submit' }).click();

  // Confirm post appears in the forum
  await expect(
    userPage.getByText('Playwright Test Post').first()
  ).toBeVisible({ timeout: 5000 });

  // Test the deletion of a group
  await userPage.goto('http://localhost:3000/groups');

  const finalGroupCard = userPage.locator('.card').filter({
    hasText: 'Playwright Edited Group',
  }).first();

  await expect(finalGroupCard).toBeVisible({ timeout: 5000 });

  // Open group details
  await finalGroupCard.locator('a[href^="/groups/"]').filter({
    hasText: 'View Details',
  }).click();

  // Confirm group details page loaded
  await expect(
    userPage.getByRole('heading', { name: 'Playwright Edited Group' })
  ).toBeVisible({ timeout: 5000 });

  // Delete the group
  await userPage.getByRole('button', { name: /delete/i }).click();

  // Confirm deletion
  await userPage.waitForURL('**/groups', { timeout: 5000 });
  await expect(
    userPage.getByText('Playwright Edited Group').first()
  ).not.toBeVisible({ timeout: 5000 });
});
