document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const timeInput = document.getElementById('current-time');
  const useCurrentTimeBtn = document.getElementById('use-current-time');
  const moodSelector = document.getElementById('mood-selector');
  const recipeContainer = document.getElementById('recipe-container');
  const recipeTitle = document.getElementById('recipe-title');
  const recipeIngredients = document.getElementById('recipe-ingredients');
  const recipeInstructions = document.getElementById('recipe-instructions');
  const timeMessage = document.getElementById('time-message');
  const newRecipeBtn = document.getElementById('new-recipe-btn');
  const changeMoodBtn = document.getElementById('change-mood-btn');

  // State
  let currentMoodId = null;
  let isLoading = false;
  let lastRequestTime = 0;
  const requestThrottle = 500; // ms
  
  // Mood emoji mapping
  const moodEmojis = {
    'Happy': '😊',
    'Sad': '😔',
    'Energetic': '⚡',
    'Tired': '😴',
    'Stressed': '😰',
    'Relaxed': '😌'
  };

  // Set current time as default
  function setCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeInput.value = `${hours}:${minutes}`;
  }

  // Set current time initially
  setCurrentTime();

  // Add event listener for the "Now" button
  useCurrentTimeBtn.addEventListener('click', setCurrentTime);

  // Fetch moods from API with caching
  async function fetchMoods() {
    try {
      // Show subtle loading indicator
      moodSelector.innerHTML = '<div class="p-4 text-center text-purple-300">Loading moods...</div>';
      
      const response = await fetch('/api/moods');
      if (!response.ok) {
        throw new Error('Failed to fetch moods');
      }
      
      const moods = await response.json();
      // Store in sessionStorage for quick access
      sessionStorage.setItem('moods', JSON.stringify(moods));
      renderMoodButtons(moods);
    } catch (error) {
      console.error('Error fetching moods:', error);
      // Try to get from cache
      const cachedMoods = sessionStorage.getItem('moods');
      if (cachedMoods) {
        renderMoodButtons(JSON.parse(cachedMoods));
      } else {
        moodSelector.innerHTML = '<p class="text-red-400">Failed to load moods. Please try again later.</p>';
      }
    }
  }

  // Render mood buttons with minimal animations
  function renderMoodButtons(moods) {
    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    moodSelector.innerHTML = '';
    
    // Instead of animating each button separately, we'll animate the container
    moods.forEach(mood => {
      const button = document.createElement('button');
      button.className = 'mood-btn transform-gpu';
      button.dataset.moodId = mood.id;
      
      const emoji = moodEmojis[mood.name] || '🍽️';
      
      button.innerHTML = `
        <span class="mood-icon">${emoji}</span>
        <span class="font-medium">${mood.name}</span>
      `;
      
      button.addEventListener('click', () => selectMood(mood.id));
      fragment.appendChild(button);
    });
    
    moodSelector.appendChild(fragment);
    
    // Efficiently add visible class to the container instead of each button
    requestAnimationFrame(() => {
      moodSelector.classList.add('buttons-loaded');
    });
  }

  // Handle mood selection with debounce
  function selectMood(moodId) {
    if (isLoading) return; // Prevent multiple clicks
    console.log("tesat");
    
    currentMoodId = moodId;
    
    // Update UI to show selected mood
    const allButtons = moodSelector.querySelectorAll('.mood-btn');
    allButtons.forEach(btn => {
      if (parseInt(btn.dataset.moodId) === moodId) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
    
    // Reset lastRequestTime to ensure we can fetch a recipe
    lastRequestTime = 0;
    
    // Fetch recipe for the selected mood with time
    fetchRecipeByMoodAndTime(moodId);
  }

  // Fetch recipe by mood and time with throttle
  async function fetchRecipeByMoodAndTime(moodId) {
    // Prevent duplicate requests during loading
    if (isLoading) return;
    isLoading = true;
    
    // Show loading animation - smaller and more efficient
    recipeContainer.innerHTML = `
      <div class="flex items-center justify-center p-6">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    `;
    recipeContainer.classList.remove('hidden');
    
    try {
      let currentTime = timeInput.value || '12:00'; // Default to noon if no time specified
      
      // Ensure time is in HH:MM format
      if (!currentTime.includes(':')) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        currentTime = `${hours}:${minutes}`;
      }
      
      const response = await fetch(`/api/recipes/time-mood?moodId=${moodId}&time=${encodeURIComponent(currentTime)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          showNoRecipesMessage();
          return;
        }
        throw new Error('Failed to fetch recipe');
      }
      
      const recipe = await response.json();
      
      // Update last request time after successful fetch
      lastRequestTime = Date.now();
      
      // Use more efficient DOM creation
      createRecipeCard(recipe);
      
    } catch (error) {
      console.error('Error fetching recipe:', error);
      recipeContainer.innerHTML = '<p class="text-red-400 mt-4">Failed to load recipe. Please try again later.</p>';
    } finally {
      isLoading = false;
      recipeContainer.classList.remove('hidden');
    }
  }

  // More efficient recipe card creation
  function createRecipeCard(recipe) {
    // Use template literal for performance
    recipeContainer.innerHTML = `
      <div class="recipe-card border-t border-b border-gray-700 py-4 mb-4 transform-gpu">
        <h3 id="recipe-title" class="text-xl font-bold text-purple-400 mb-2">${recipe.title}</h3>
        <p id="time-message" class="text-sm text-purple-300 italic mb-3">${recipe.timeMessage || ''}</p>
        <div class="mb-4">
          <h4 class="font-semibold text-gray-300 mb-1">Ingredients:</h4>
          <p id="recipe-ingredients" class="text-gray-400">${recipe.ingredients}</p>
        </div>
        <div>
          <h4 class="font-semibold text-gray-300 mb-1">Instructions:</h4>
          <p id="recipe-instructions" class="text-gray-400">${recipe.instructions}</p>
        </div>
      </div>
      <button id="new-recipe-btn" class="w-full py-2 px-4 bg-purple-800 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-300 ease-in-out mb-2 btn-shine">Give me another recipe</button>
      <button id="change-mood-btn" class="w-full py-2 px-4 bg-gray-700 text-gray-200 font-semibold rounded-md hover:bg-gray-600 transition duration-300 ease-in-out">Change my mood</button>
    `;
    
    // Add event listeners
    document.getElementById('new-recipe-btn').addEventListener('click', () => {
      if (currentMoodId) {
        // Reset the throttle timer when explicitly requesting a new recipe
        lastRequestTime = 0; 
        fetchRecipeByMoodAndTime(currentMoodId);
      }
    });
    document.getElementById('change-mood-btn').addEventListener('click', resetMoodSelection);
    
    // Use IntersectionObserver to check if container is visible
    checkVisibilityAndScroll();
  }

  // Check if container is visible and scroll if needed
  function checkVisibilityAndScroll() {
    // Use IntersectionObserver for better performance
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (!entry.isIntersecting) {
        recipeContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, { threshold: 0.1 });
    
    observer.observe(recipeContainer);
    
    // Disconnect after checking
    setTimeout(() => observer.disconnect(), 1000);
  }

  // Show message when no recipes are found
  function showNoRecipesMessage() {
    recipeContainer.innerHTML = `
      <div class="text-center py-6">
        <p class="text-gray-400 mb-4">No recipes found for this mood yet.</p>
        <button id="change-mood-btn" class="py-2 px-4 bg-purple-800 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-300 ease-in-out">
          Select a different mood
        </button>
      </div>
    `;
    
    recipeContainer.classList.remove('hidden');
    document.getElementById('change-mood-btn').addEventListener('click', resetMoodSelection);
    isLoading = false;
  }

  // Reset mood selection with improved animations
  function resetMoodSelection() {
    currentMoodId = null;
    
    // Clear selected state from all mood buttons
    const allButtons = moodSelector.querySelectorAll('.mood-btn');
    allButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Use CSS transitions for smoother animations
    recipeContainer.classList.add('fade-out');
    
    setTimeout(() => {
      recipeContainer.classList.add('hidden');
      recipeContainer.classList.remove('fade-out');
    }, 300);
  }

  // Debounced event listener for time input changes
  let timeInputTimeout;
  timeInput.addEventListener('change', () => {
    clearTimeout(timeInputTimeout);
    timeInputTimeout = setTimeout(() => {
      if (currentMoodId && !isLoading) {
        fetchRecipeByMoodAndTime(currentMoodId);
      }
    }, 300);
  });

  // Add optimized CSS transitions
  const style = document.createElement('style');
  style.textContent = `
    .buttons-loaded .mood-btn {
      opacity: 1;
      transform: translateY(0);
    }
    
    .mood-btn {
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.3s ease-out, transform 0.3s ease-out, background-color 0.2s;
    }
    
    .fade-out {
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    }
    
    .transform-gpu {
      will-change: transform;
      transform: translateZ(0);
    }
  `;
  document.head.appendChild(style);

  // Initialize the app
  fetchMoods();
}); 