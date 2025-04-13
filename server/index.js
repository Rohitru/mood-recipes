const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Database setup
const db = new sqlite3.Database('./server/recipes.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    createTables();
  }
});

function createTables() {
  // Create tables if they don't exist
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS moods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mood_id INTEGER,
      title TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL,
      FOREIGN KEY (mood_id) REFERENCES moods(id)
    )`);

    // Insert sample moods if they don't exist
    const moods = ['Happy', 'Sad', 'Energetic', 'Tired', 'Stressed', 'Relaxed'];
    moods.forEach(mood => {
      db.run('INSERT OR IGNORE INTO moods (name) VALUES (?)', [mood]);
    });

    // Insert sample recipes for each mood
    insertSampleRecipes();
  });
}

function insertSampleRecipes() {
  const recipes = [
    {
      mood: 'Happy',
      title: 'Sunshine Pasta',
      ingredients: 'Pasta, cherry tomatoes, basil, olive oil, garlic, parmesan cheese',
      instructions: 'Cook pasta according to package. Sauté garlic in olive oil. Add halved cherry tomatoes and cook for 2 minutes. Toss with pasta, fresh basil, and top with parmesan.'
    },
    {
      mood: 'Happy',
      title: 'Colorful Fruit Smoothie Bowl',
      ingredients: 'Frozen bananas, frozen berries, yogurt, honey, granola, fresh fruit for topping',
      instructions: 'Blend frozen bananas, berries, yogurt and honey until smooth. Pour into a bowl and top with granola and fresh fruit.'
    },
    {
      mood: 'Happy',
      title: 'Rainbow Veggie Tacos',
      ingredients: 'Corn tortillas, black beans, bell peppers (red, yellow, green), corn, avocado, lime, cilantro, cumin, chili powder',
      instructions: 'Season beans with cumin and chili powder. Sauté peppers and corn. Warm tortillas. Layer beans and vegetables, top with diced avocado, cilantro, and a squeeze of lime.'
    },
    {
      mood: 'Happy',
      title: 'Mango Coconut Rice Pudding',
      ingredients: 'Jasmine rice, coconut milk, sugar, vanilla extract, fresh mango, toasted coconut flakes',
      instructions: 'Cook rice with coconut milk and sugar until creamy. Stir in vanilla. Cool slightly and top with fresh mango cubes and toasted coconut flakes.'
    },
    {
      mood: 'Sad',
      title: 'Comforting Mac and Cheese',
      ingredients: 'Macaroni, butter, flour, milk, cheddar cheese, breadcrumbs',
      instructions: 'Cook macaroni. Make a roux with butter and flour, add milk to create a béchamel. Add grated cheese. Mix with macaroni, top with breadcrumbs and bake at 350°F for 20 minutes.'
    },
    {
      mood: 'Sad',
      title: 'Warm Chocolate Pudding',
      ingredients: 'Dark chocolate, butter, sugar, eggs, flour, vanilla extract',
      instructions: 'Melt chocolate and butter. Mix eggs, sugar, and vanilla. Combine mixtures, add flour. Pour into ramekins and bake at 375°F for 12 minutes until center is still soft.'
    },
    {
      mood: 'Sad',
      title: 'Classic Chicken Noodle Soup',
      ingredients: 'Chicken broth, chicken breast, carrots, celery, onion, egg noodles, thyme, parsley, bay leaf',
      instructions: 'Simmer chicken in broth until cooked. Remove and shred. Cook diced vegetables in broth with herbs. Add noodles and cook until tender. Return chicken to soup and warm through.'
    },
    {
      mood: 'Sad',
      title: 'Creamy Mashed Potatoes',
      ingredients: 'Russet potatoes, butter, cream, garlic, salt, pepper',
      instructions: 'Boil peeled potatoes until tender. Drain and return to pot. Add warmed cream, melted butter, and roasted garlic. Mash until smooth and creamy. Season with salt and pepper.'
    },
    {
      mood: 'Energetic',
      title: 'Protein-Packed Quinoa Bowl',
      ingredients: 'Quinoa, chicken breast, mixed vegetables, olive oil, lemon juice, herbs',
      instructions: 'Cook quinoa. Grill chicken and slice. Sauté vegetables. Combine all in a bowl and dress with olive oil, lemon juice, and herbs.'
    },
    {
      mood: 'Energetic',
      title: 'Energizing Breakfast Burrito',
      ingredients: 'Eggs, black beans, avocado, salsa, whole wheat tortilla, spinach',
      instructions: 'Scramble eggs. Warm beans. Layer tortilla with eggs, beans, sliced avocado, spinach, and salsa. Roll up and enjoy.'
    },
    {
      mood: 'Energetic',
      title: 'Acai Power Bowl',
      ingredients: 'Frozen acai puree, banana, almond milk, protein powder, chia seeds, mixed berries, granola, almond butter',
      instructions: 'Blend acai, banana, almond milk and protein powder. Pour into bowl. Top with berries, granola, a drizzle of almond butter, and sprinkle of chia seeds.'
    },
    {
      mood: 'Energetic',
      title: 'Spicy Lentil Power Soup',
      ingredients: 'Red lentils, vegetable broth, onion, garlic, carrots, spinach, turmeric, cumin, cayenne pepper, lemon',
      instructions: 'Sauté onion, garlic, and spices. Add lentils, carrots, and broth. Simmer until lentils are tender. Stir in spinach until wilted. Finish with a squeeze of lemon.'
    },
    {
      mood: 'Tired',
      title: 'Quick Avocado Toast',
      ingredients: 'Bread, avocado, lemon juice, red pepper flakes, salt, olive oil',
      instructions: 'Toast bread. Mash avocado with lemon juice and salt. Spread on toast and top with a drizzle of olive oil and red pepper flakes.'
    },
    {
      mood: 'Tired',
      title: 'Simple Banana Pancakes',
      ingredients: 'Ripe banana, eggs, cinnamon, butter for cooking',
      instructions: 'Mash banana. Mix with beaten eggs and cinnamon. Cook spoonfuls in a buttered pan like pancakes, flipping when bubbles form.'
    },
    {
      mood: 'Tired',
      title: 'One-Pot Pasta',
      ingredients: 'Pasta, cherry tomatoes, spinach, garlic, olive oil, parmesan cheese, basil, red pepper flakes',
      instructions: 'Add pasta, halved tomatoes, spinach, sliced garlic, olive oil and 4 cups water to a pot. Bring to boil and cook until pasta is tender. Finish with parmesan, basil, and red pepper flakes.'
    },
    {
      mood: 'Tired',
      title: 'Microwave Baked Sweet Potato',
      ingredients: 'Sweet potato, butter, cinnamon, brown sugar, salt',
      instructions: 'Pierce sweet potato several times with a fork. Microwave on high for 5-8 minutes until tender. Split open, add butter, cinnamon, a sprinkle of brown sugar and salt.'
    },
    {
      mood: 'Stressed',
      title: 'Dark Chocolate Covered Strawberries',
      ingredients: 'Strawberries, dark chocolate, white chocolate for drizzling (optional)',
      instructions: 'Melt dark chocolate. Dip strawberries and place on parchment paper. Drizzle with melted white chocolate if desired. Refrigerate until set.'
    },
    {
      mood: 'Stressed',
      title: 'Calming Chamomile Tea Cookies',
      ingredients: 'Flour, butter, sugar, egg, chamomile tea leaves (from tea bags), vanilla extract',
      instructions: 'Cream butter and sugar. Add egg and vanilla. Mix in flour and tea leaves. Form cookies and bake at 350°F for 10-12 minutes.'
    },
    {
      mood: 'Stressed',
      title: 'Creamy Mushroom Risotto',
      ingredients: 'Arborio rice, mushrooms, white wine, vegetable broth, onion, garlic, parmesan cheese, butter, thyme',
      instructions: 'Sauté mushrooms and set aside. Cook onion and garlic in butter, add rice and toast. Add wine, then gradually add broth while stirring until rice is creamy. Fold in mushrooms, parmesan, and thyme.'
    },
    {
      mood: 'Stressed',
      title: 'Lavender Honey Latte',
      ingredients: 'Milk, espresso or strong coffee, dried culinary lavender, honey, vanilla extract',
      instructions: 'Steep lavender in hot milk for 5 minutes, then strain. Add honey and vanilla. Froth milk if possible. Pour over espresso or coffee and enjoy the calming aroma and flavor.'
    },
    {
      mood: 'Relaxed',
      title: 'Slow-Cooked Vegetable Soup',
      ingredients: 'Mixed vegetables, vegetable broth, herbs, garlic, olive oil',
      instructions: 'Sauté garlic in olive oil. Add chopped vegetables and herbs. Pour in broth and simmer for 30 minutes. Serve with crusty bread.'
    },
    {
      mood: 'Relaxed',
      title: 'Lavender Honey Lemonade',
      ingredients: 'Lemons, honey, dried culinary lavender, water',
      instructions: 'Make a lavender syrup by simmering lavender in water and honey. Strain. Mix with freshly squeezed lemon juice and cold water. Serve over ice.'
    },
    {
      mood: 'Relaxed',
      title: 'Mediterranean Mezze Platter',
      ingredients: 'Hummus, tzatziki, olives, feta cheese, cucumber slices, cherry tomatoes, pita bread, fresh herbs',
      instructions: 'Arrange all ingredients beautifully on a large platter. Drizzle olive oil over hummus and tzatziki, sprinkle with herbs. Serve at room temperature for a leisurely grazing meal.'
    },
    {
      mood: 'Relaxed',
      title: 'Chamomile Poached Pears',
      ingredients: 'Pears, chamomile tea bags, honey, vanilla bean, cinnamon stick, star anise',
      instructions: 'Simmer chamomile tea, honey, vanilla, cinnamon and star anise. Add peeled pears and poach gently until tender. Serve warm or chilled with some of the poaching liquid reduced to a syrup.'
    }
  ];

  recipes.forEach(recipe => {
    db.get('SELECT id FROM moods WHERE name = ?', [recipe.mood], (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }
      
      if (row) {
        const { title, ingredients, instructions } = recipe;
        db.run(
          'INSERT OR IGNORE INTO recipes (mood_id, title, ingredients, instructions) VALUES (?, ?, ?, ?)',
          [row.id, title, ingredients, instructions],
          function(err) {
            if (err) {
              console.error('Error inserting recipe:', err.message);
            }
          }
        );
      }
    });
  });
}

// API Routes
app.get('/api/moods', (req, res) => {
  db.all('SELECT * FROM moods', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/recipes/mood/:moodId', (req, res) => {
  const moodId = req.params.moodId;
  db.all('SELECT * FROM recipes WHERE mood_id = ?', [moodId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (rows.length === 0) {
      res.status(404).json({ message: 'No recipes found for this mood' });
      return;
    }
    
    // Return a random recipe for the mood
    const randomIndex = Math.floor(Math.random() * rows.length);
    res.json(rows[randomIndex]);
  });
});

// New endpoint for time-based recommendations
app.get('/api/recipes/time-mood', (req, res) => {
  const { time, moodId } = req.query;
  
  if (!time || !moodId) {
    return res.status(400).json({ message: 'Time and mood are required' });
  }
  
  // Parse time to get hour (assuming format is HH:MM)
  let hour;
  try {
    hour = parseInt(time.split(':')[0], 10);
    if (isNaN(hour)) {
      hour = new Date().getHours(); // Use current hour if parsing fails
    }
  } catch (e) {
    hour = new Date().getHours(); // Use current hour if any error occurs
  }
  
  // Determine meal type based on time of day
  let mealType = '';
  if (hour >= 5 && hour < 11) {
    mealType = 'breakfast';
  } else if (hour >= 11 && hour < 15) {
    mealType = 'lunch';
  } else if (hour >= 15 && hour < 18) {
    mealType = 'snack';
  } else {
    mealType = 'dinner';
  }
  
  // Get recipes for the mood
  db.all('SELECT * FROM recipes WHERE mood_id = ?', [moodId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (rows.length === 0) {
      res.status(404).json({ message: 'No recipes found for this mood' });
      return;
    }
    
    // Select a random recipe
    const randomIndex = Math.floor(Math.random() * rows.length);
    const recipe = rows[randomIndex];
    
    // Add time-specific message
    recipe.timeMessage = `This ${mealType} recipe is perfect for your ${hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'} mood!`;
    
    res.json(recipe);
  });
});

// Serve the main HTML file for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 