// node search_test.js

import needle from 'needle';

const BASE_URL = 'https://gab-vercel.vercel.app/alumni';

const testCases = [
    { description: 'Show all alumni (no filters)', endpoint: `${BASE_URL}/alumni` },
    { description: 'Search (sorted by last name)', endpoint: `${BASE_URL}/search` },
    { description: 'Search by name', endpoint: `${BASE_URL}/search?name=Jane` },
    { description: 'Search by name', endpoint: `${BASE_URL}/search?name=Nick` },
    { description: 'Search by name', endpoint: `${BASE_URL}/search?name=Jane` },
    { description: 'Search by degree', endpoint: `${BASE_URL}/search?degree=Computer Science` },
    { description: 'Search by graduation year', endpoint: `${BASE_URL}/search?graduation_year=2018` },
    { description: 'Search by current job title', endpoint: `${BASE_URL}/search?current_job_title=Engineer` },
    { description: 'Search by company', endpoint: `${BASE_URL}/search?company=Google` },
    { description: 'Search by skills', endpoint: `${BASE_URL}/search?skills=JavaScript` },
    { description: 'Search by skills', endpoint: `${BASE_URL}/search?skills=Python` },
    { description: 'Search by multiple fields', endpoint: `${BASE_URL}/search?name=Jane&degree=Math&graduation_year=2019&skills=Python` },
    { description: 'Search by multiple fields', endpoint: `${BASE_URL}/search?name=Jane&graduation_year=2018&skills=Python` }
  ];

async function runTests() {
  for (const testCase of testCases) {
    try {
      const response = await needle('get', testCase.endpoint);
      console.log(`\nTest: ${testCase.description}`);
      console.log('Status:', response.statusCode);
      console.log('Response:', response.body);
    } catch (error) {
      console.error(`\nTest: ${testCase.description}`);
      console.error('Error:', error.message);
    }
  }
}

runTests();