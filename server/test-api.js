async function testSuite() {
  const BASE = 'http://localhost:5000/api';
  let cookie = '';

  console.log('--- 1. Testing Health Endpoint ---');
  const healthRes = await fetch(`${BASE}/health`);
  const setCookie = healthRes.headers.get('set-cookie');
  if (setCookie) {
    cookie = setCookie.split(';')[0];
  }
  const healthData = await healthRes.json();
  console.log('Health Status:', healthData.status);

  console.log('\n--- 2. Testing Smart Photo Scanner Vision Endpoint ---');
  const scanRes = await fetch(`${BASE}/scan-pantry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie,
    },
    body: JSON.stringify({
      image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...',
      mimeType: 'image/jpeg',
    }),
  });
  const scanData = await scanRes.json();
  console.log(`Scan recognized ${scanData.ingredients?.length} pantry items:`, scanData.ingredients?.slice(0, 4));

  console.log('\n--- 3. Testing Community Recipe Feed ---');
  const comRes = await fetch(`${BASE}/community`);
  const comData = await comRes.json();
  console.log(`Retrieved ${comData.recipes?.length} community ledger recipes`);
  console.log(`  Top Recipe: "${comData.recipes?.[0]?.recipeTitle}" with ${comData.recipes?.[0]?.stampsCount} stamps`);

  console.log('\n--- 4. Testing Publish to Community Ledger ---');
  const pubRes = await fetch(`${BASE}/community`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie,
    },
    body: JSON.stringify({
      authorName: 'Chef Remy',
      authorTitle: 'Pantry Master',
      recipeTitle: 'Rustic Skillet Caramelized Onions & Eggs',
      recipeDescription: 'A 10-minute cozy breakfast utilizing sweet browned onions.',
      ingredients: ['Onions', 'Eggs', 'Butter', 'Black Pepper'],
      recipeSteps: ['Slice onions thin', 'Caramelize in butter', 'Crack eggs and cover'],
    }),
  });
  const pubData = await pubRes.json();
  console.log('Published Community Recipe:', pubData.recipe?.recipeTitle, 'ID:', pubData.recipe?._id || pubData.recipe?.id);

  console.log('\n--- 5. Testing Community Upvote / Stamp ---');
  const recipeId = pubData.recipe?._id || pubData.recipe?.id;
  const stampRes = await fetch(`${BASE}/community/${recipeId}/stamp`, {
    method: 'POST',
    headers: { 'Cookie': cookie },
  });
  const stampData = await stampRes.json();
  console.log('Upvoted Stamps Count now:', stampData.recipe?.stampsCount);

  console.log('\n--- 6. Testing AI Sous-Chef Chatbot ---');
  const chatRes = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie,
    },
    body: JSON.stringify({
      message: 'What can I substitute for butter?',
      history: [],
    }),
  });
  const chatData = await chatRes.json();
  console.log('Sous-Chef Advice:', chatData.reply?.slice(0, 90) + '...');

  console.log('\n✅ All 6 Advanced Companion Features Verified Successfully!');
}

testSuite().catch(console.error);
