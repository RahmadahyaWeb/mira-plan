export type Slot = 'breakfast' | 'lunch' | 'snack' | 'dinner'
export type Diet = 'anything' | 'vegetarian' | 'vegan'

export interface Meal {
  id: string
  name: string
  slot: Slot
  emoji: string
  kcal: number
  protein: number
  carbs: number
  fat: number
  /** strictest diet the meal fits: vegan meals also fit vegetarian and anything */
  diet: Diet
  minutes: number
  ingredients: string[]
  steps: string[]
}

type Row = [string, string, string, number, number, number, number, Diet, number, string[], string[]]

const rows: Record<Slot, Row[]> = {
  breakfast: [
    ['rainbow-oats', 'Rainbow Berry Oats', '🫐', 380, 14, 62, 9, 'vegetarian', 8, ['½ cup rolled oats', '1 cup milk', 'Handful of mixed berries', '1 tsp honey', '1 tsp chia seeds'], ['Simmer the oats in milk for 5 minutes, stirring.', 'Top with berries, chia and a swirl of honey.']],
    ['pb-banana-toast', 'Peanut Banana Toast', '🍌', 410, 15, 52, 16, 'vegan', 5, ['2 slices wholegrain bread', '1½ tbsp peanut butter', '1 banana', 'Pinch of cinnamon'], ['Toast the bread.', 'Spread peanut butter, add banana slices and cinnamon.']],
    ['veggie-scramble', 'Veggie Egg Scramble', '🍳', 360, 24, 18, 21, 'vegetarian', 10, ['3 eggs', 'Handful of spinach', '5 cherry tomatoes', '¼ bell pepper', '1 slice wholegrain toast'], ['Soften the peppers and tomatoes in a pan.', 'Add spinach, then the beaten eggs.', 'Stir gently until just set. Serve with toast.']],
    ['yogurt-parfait', 'Greek Yogurt Parfait', '🍓', 340, 22, 44, 8, 'vegetarian', 5, ['1 cup Greek yogurt', '⅓ cup granola', 'Sliced strawberries', '1 tsp honey'], ['Layer yogurt, granola and berries in a glass.', 'Finish with honey.']],
    ['avo-egg-toast', 'Avocado Toast & Egg', '🥑', 430, 18, 36, 24, 'vegetarian', 10, ['2 slices sourdough', '½ avocado', '1 egg', 'Chili flakes', 'Lemon squeeze'], ['Poach or fry the egg.', 'Mash avocado with lemon and spread on toast.', 'Top with the egg and chili flakes.']],
    ['mango-chia', 'Mango Coconut Chia Pudding', '🥭', 330, 8, 46, 13, 'vegan', 5, ['3 tbsp chia seeds', '¾ cup coconut milk drink', '½ mango', '1 tsp maple syrup'], ['Stir chia, coconut milk and maple. Chill overnight.', 'Top with diced mango in the morning.']],
    ['tofu-wrap', 'Tofu Scramble Wrap', '🌯', 420, 24, 42, 17, 'vegan', 12, ['150 g firm tofu', '1 wholewheat tortilla', 'Pinch of turmeric', 'Handful of spinach', '2 tbsp salsa'], ['Crumble tofu into a hot pan with turmeric.', 'Add spinach until wilted.', 'Wrap in the tortilla with salsa.']],
    ['salmon-bagel', 'Smoked Salmon Bagel', '🥯', 450, 27, 48, 15, 'anything', 5, ['1 wholegrain bagel', '50 g smoked salmon', '2 tbsp light cream cheese', 'Cucumber slices', 'Dill'], ['Toast the bagel halves.', 'Spread cream cheese, layer salmon, cucumber and dill.']],
    ['green-smoothie', 'Green Glow Smoothie', '🥤', 300, 12, 52, 6, 'vegan', 4, ['Big handful of spinach', '1 banana', '½ cup frozen mango', '1 cup oat milk', '1 tbsp ground flax'], ['Blend everything until smooth.', 'Add ice if you like it frosty.']],
    ['banana-pancakes', 'Fluffy Banana Pancakes', '🥞', 400, 18, 56, 11, 'vegetarian', 15, ['1 banana', '2 eggs', '⅓ cup oat flour', 'Pinch of baking powder', 'Berries to top'], ['Mash banana, whisk in eggs, flour and baking powder.', 'Cook small pancakes 2 minutes per side.', 'Stack and top with berries.']],
    ['turkey-omelette', 'Turkey Spinach Omelette', '🥚', 370, 32, 6, 23, 'anything', 10, ['3 eggs', '50 g sliced turkey', 'Handful of spinach', '1 tbsp grated cheese'], ['Pour beaten eggs into a hot pan.', 'Add turkey, spinach and cheese on one half.', 'Fold and cook until set.']],
    ['cottage-peach', 'Cottage Cheese Peach Bowl', '🍑', 310, 26, 34, 7, 'vegetarian', 3, ['1 cup cottage cheese', '1 peach', '1 tbsp pumpkin seeds', 'Drizzle of honey'], ['Spoon cottage cheese into a bowl.', 'Top with peach slices, seeds and honey.']],
    ['apple-pie-oats', 'Apple Pie Overnight Oats', '🍎', 390, 13, 66, 9, 'vegan', 5, ['½ cup rolled oats', '¾ cup soy milk', '½ grated apple', '1 tsp cinnamon', '1 tbsp raisins'], ['Mix everything in a jar.', 'Chill overnight and eat cold or warmed.']],
    ['breakfast-burrito', 'Sunny Breakfast Burrito', '🌯', 480, 28, 48, 19, 'anything', 15, ['2 eggs', '1 wholewheat tortilla', '40 g chicken sausage', '¼ cup black beans', '2 tbsp salsa'], ['Brown the sliced sausage.', 'Scramble the eggs with the beans.', 'Roll it all in the tortilla with salsa.']],
    ['chicken-congee', 'Cozy Chicken Rice Porridge', '🍚', 350, 18, 52, 7, 'anything', 25, ['⅓ cup rice', '3 cups broth', '60 g shredded chicken', 'Ginger slices', 'Spring onion'], ['Simmer rice in broth with ginger until creamy.', 'Stir in the chicken.', 'Top with spring onion.']],
    ['blueberry-muffins', 'Blueberry Protein Muffins', '🧁', 340, 20, 42, 10, 'vegetarian', 25, ['1 cup rolled oats (makes 6)', '2 eggs', '¾ cup Greek yogurt', '½ cup blueberries', '1 tsp baking powder'], ['Blend oats, eggs, yogurt and baking powder, fold in berries.', 'Spoon into 6 muffin cups and bake at 180 °C for 20 minutes.', 'Enjoy two warm, keep the rest for later.']],
  ],
  lunch: [
    ['buddha-bowl', 'Rainbow Buddha Bowl', '🥗', 520, 20, 70, 18, 'vegan', 20, ['½ cup cooked quinoa', '½ cup chickpeas', 'Red cabbage', 'Carrot ribbons', '¼ avocado', 'Tahini lemon dressing'], ['Roast the chickpeas until crisp.', 'Arrange everything in stripes over the quinoa.', 'Drizzle with dressing.']],
    ['chicken-salad', 'Grilled Chicken Salad', '🥗', 450, 40, 20, 22, 'anything', 15, ['120 g chicken breast', 'Mixed leaves', 'Cherry tomatoes', 'Cucumber', '1 tbsp olive oil vinaigrette'], ['Grill the chicken 6 minutes per side, slice.', 'Toss the veggies with vinaigrette and top with chicken.']],
    ['shawarma-wrap', 'Chickpea Shawarma Wrap', '🌯', 540, 20, 72, 18, 'vegan', 15, ['¾ cup chickpeas', 'Shawarma spice', '1 large flatbread', 'Lettuce and tomato', '2 tbsp hummus'], ['Pan-fry chickpeas with the spice for 5 minutes.', 'Spread hummus on the flatbread, fill and roll.']],
    ['tuna-poke', 'Tuna Poke Bowl', '🍣', 560, 38, 66, 14, 'anything', 15, ['100 g sushi-grade tuna', '¾ cup sushi rice', 'Edamame', 'Mango cubes', 'Soy and sesame dressing'], ['Cube the tuna and toss in dressing.', 'Pile over rice with edamame and mango.']],
    ['lentil-soup', 'Hearty Lentil Veggie Soup', '🍲', 410, 22, 60, 8, 'vegan', 30, ['½ cup red lentils', 'Carrot, celery, onion', 'Chopped tomatoes', 'Cumin', 'Crusty roll'], ['Soften the veggies, add lentils, tomatoes and water.', 'Simmer 20 minutes with cumin.', 'Serve with the roll.']],
    ['turkey-club', 'Turkey Club Sandwich', '🥪', 500, 34, 46, 18, 'anything', 8, ['3 slices wholegrain bread', '80 g turkey', '1 slice turkey bacon', 'Lettuce and tomato', 'Light mayo'], ['Toast the bread and crisp the bacon.', 'Layer into a triple-decker and slice into triangles.']],
    ['caprese-pasta', 'Caprese Pasta Salad', '🍝', 530, 19, 68, 20, 'vegetarian', 15, ['1 cup cooked pasta', 'Mini mozzarella balls', 'Cherry tomatoes', 'Basil', 'Balsamic glaze'], ['Cool the pasta under cold water.', 'Toss with mozzarella, tomatoes and basil.', 'Finish with balsamic.']],
    ['teriyaki-tofu', 'Teriyaki Tofu Rice', '🍱', 540, 24, 78, 14, 'vegan', 20, ['150 g firm tofu', '¾ cup rice', 'Broccoli florets', '2 tbsp teriyaki sauce', 'Sesame seeds'], ['Crisp tofu cubes in a pan.', 'Add broccoli and teriyaki, toss until glossy.', 'Serve over rice with sesame.']],
    ['fajita-bowl', 'Chicken Fajita Bowl', '🌮', 580, 42, 62, 17, 'anything', 20, ['120 g chicken strips', 'Peppers and onion', '½ cup rice', '¼ cup black beans', 'Salsa and lime'], ['Sear chicken with fajita spice.', 'Add peppers and onion until charred.', 'Bowl it up with rice, beans and salsa.']],
    ['halloumi-quinoa', 'Halloumi Quinoa Bowl', '🧀', 560, 26, 52, 27, 'vegetarian', 20, ['60 g halloumi', '¾ cup cooked quinoa', 'Roasted zucchini', 'Pomegranate seeds', 'Mint yogurt'], ['Grill halloumi slices until golden.', 'Pile over quinoa and zucchini.', 'Scatter pomegranate and add mint yogurt.']],
    ['gado-gado', 'Gado-Gado Peanut Salad', '🥜', 500, 21, 40, 28, 'vegan', 20, ['100 g tempeh', 'Blanched long beans and cabbage', 'Bean sprouts', 'Cucumber', '2 tbsp peanut sauce'], ['Pan-fry the tempeh until golden.', 'Arrange the veggies on a plate.', 'Spoon over peanut sauce.']],
    ['beef-noodles', 'Beef & Broccoli Noodles', '🍜', 590, 36, 66, 19, 'anything', 20, ['100 g lean beef strips', '1 nest egg noodles', 'Broccoli', 'Garlic and ginger', 'Oyster sauce'], ['Boil noodles.', 'Stir-fry beef, then broccoli with garlic and ginger.', 'Toss noodles in with the sauce.']],
    ['black-bean-bowl', 'Black Bean Burrito Bowl', '🌯', 550, 22, 84, 13, 'vegan', 15, ['¾ cup brown rice', '½ cup black beans', 'Sweetcorn', 'Pico de gallo', 'Lime'], ['Warm the beans with cumin.', 'Layer rice, beans, corn and pico.', 'Squeeze over lime.']],
    ['cauli-fried-rice', 'Egg Fried Cauli-Rice', '🍳', 420, 22, 26, 24, 'vegetarian', 15, ['2 cups riced cauliflower', '2 eggs', 'Peas and carrot', 'Soy sauce', 'Sesame oil'], ['Stir-fry the cauliflower and veg 5 minutes.', 'Push aside, scramble the eggs, then mix.', 'Season with soy and sesame oil.']],
    ['salmon-rolls', 'Salmon Sushi Rolls', '🍙', 480, 24, 72, 10, 'anything', 25, ['¾ cup sushi rice', '70 g salmon', '2 nori sheets', 'Cucumber', 'Soy sauce'], ['Spread rice over nori.', 'Add salmon and cucumber, roll tight.', 'Slice into 8 pieces.']],
    ['falafel-pita', 'Falafel Pita Pocket', '🧆', 520, 18, 66, 20, 'vegan', 15, ['4 baked falafel', '1 wholewheat pita', 'Shredded lettuce', 'Tomato and pickles', 'Tahini'], ['Warm the falafel in the oven.', 'Stuff the pita with salad and falafel.', 'Drizzle tahini.']],
  ],
  snack: [
    ['apple-almond', 'Apple & Almond Butter', '🍎', 220, 6, 26, 12, 'vegan', 2, ['1 apple', '1 tbsp almond butter'], ['Slice the apple and dip away.']],
    ['hummus-sticks', 'Hummus & Veggie Sticks', '🥕', 180, 7, 18, 9, 'vegan', 5, ['3 tbsp hummus', 'Carrot, cucumber and pepper sticks'], ['Cut the veggies into sticks.', 'Dunk into hummus.']],
    ['yogurt-honey', 'Greek Yogurt & Honey', '🍯', 170, 15, 22, 3, 'vegetarian', 2, ['¾ cup Greek yogurt', '1 tsp honey', 'Pinch of cinnamon'], ['Swirl honey and cinnamon into the yogurt.']],
    ['trail-mix', 'Trail Mix Handful', '🥜', 230, 7, 20, 15, 'vegan', 1, ['Almonds, cashews, raisins and dark choc chips (30 g)'], ['Grab a small handful.']],
    ['ricecake-pb', 'Rice Cakes & PB', '🍘', 200, 6, 22, 10, 'vegan', 2, ['2 rice cakes', '1 tbsp peanut butter', 'Banana coins'], ['Spread and top with banana.']],
    ['boiled-eggs', 'Boiled Egg Duo', '🥚', 150, 12, 1, 10, 'vegetarian', 10, ['2 eggs', 'Salt and pepper'], ['Boil the eggs 9 minutes, cool and peel.']],
    ['berry-smoothie', 'Berry Blast Smoothie', '🍓', 190, 8, 34, 3, 'vegetarian', 4, ['1 cup frozen berries', '½ cup milk', '¼ cup yogurt'], ['Blend until smooth.']],
    ['edamame', 'Salted Edamame Pop', '🫛', 190, 17, 14, 8, 'vegan', 5, ['1 cup edamame in pods', 'Sea salt'], ['Steam 4 minutes and sprinkle with salt.']],
    ['cheese-crackers', 'Cheese & Crackers', '🧀', 210, 10, 18, 11, 'vegetarian', 2, ['30 g cheddar', '5 wholegrain crackers', 'Grapes'], ['Slice the cheese and stack on crackers.']],
    ['banana-bites', 'Frozen Banana Bites', '🍌', 160, 3, 24, 7, 'vegan', 5, ['1 banana', '10 g dark chocolate'], ['Slice banana, dip in melted chocolate, freeze 1 hour.']],
    ['cottage-cup', 'Cottage Cheese Cup', '🥛', 160, 20, 8, 5, 'vegetarian', 2, ['¾ cup cottage cheese', 'Cherry tomatoes', 'Black pepper'], ['Top cottage cheese with tomatoes and pepper.']],
    ['roasted-chickpeas', 'Crunchy Roasted Chickpeas', '🫘', 170, 8, 24, 5, 'vegan', 25, ['½ cup chickpeas', 'Smoked paprika', '1 tsp olive oil'], ['Toss chickpeas with oil and paprika.', 'Roast at 200 °C for 20 minutes.']],
    ['turkey-rollups', 'Turkey Roll-Ups', '🌯', 150, 18, 4, 7, 'anything', 3, ['4 slices turkey', 'Cucumber sticks', '1 tbsp cream cheese'], ['Spread cream cheese on turkey, roll around cucumber.']],
    ['choc-strawberries', 'Dark Choc Strawberries', '🍫', 160, 2, 22, 8, 'vegan', 5, ['8 strawberries', '15 g dark chocolate'], ['Dip strawberries in melted chocolate and let set.']],
  ],
  dinner: [
    ['baked-salmon', 'Baked Salmon & Veggies', '🐟', 560, 40, 30, 30, 'anything', 25, ['140 g salmon fillet', 'Asparagus', 'Baby potatoes', 'Lemon', 'Olive oil'], ['Toss potatoes in oil and roast 10 minutes at 200 °C.', 'Add salmon and asparagus, roast 12 more.', 'Squeeze over lemon.']],
    ['chicken-stirfry', 'Rainbow Chicken Stir-Fry', '🥘', 520, 42, 48, 16, 'anything', 20, ['130 g chicken breast', 'Peppers, snap peas, carrot', '½ cup rice', 'Soy, garlic, ginger'], ['Sear the chicken strips.', 'Add veggies and stir-fry 4 minutes.', 'Splash in sauce, serve over rice.']],
    ['veggie-lasagna', 'Veggie Lasagna', '🍝', 580, 28, 62, 24, 'vegetarian', 50, ['Lasagna sheets', 'Zucchini and spinach', 'Ricotta', 'Tomato sauce', 'Mozzarella'], ['Layer sheets, sauce, veg and ricotta.', 'Top with mozzarella.', 'Bake 35 minutes at 190 °C.']],
    ['chickpea-curry', 'Coconut Chickpea Curry', '🍛', 560, 18, 70, 22, 'vegan', 25, ['¾ cup chickpeas', '¼ cup light coconut milk', 'Spinach', 'Curry paste', '½ cup basmati rice'], ['Fry curry paste, add chickpeas and coconut milk.', 'Simmer 10 minutes, stir in spinach.', 'Serve with rice.']],
    ['meatball-zoodles', 'Turkey Meatball Zoodles', '🍝', 470, 38, 24, 24, 'anything', 30, ['130 g turkey mince', '2 zucchini, spiralized', 'Marinara sauce', 'Parmesan'], ['Roll and bake the meatballs 15 minutes.', 'Warm them in marinara.', 'Serve over quickly sautéed zoodles with parmesan.']],
    ['stuffed-sweet-potato', 'Stuffed Sweet Potatoes', '🍠', 500, 18, 76, 14, 'vegan', 45, ['1 large sweet potato', '½ cup black beans', 'Corn', 'Avocado', 'Lime'], ['Bake the sweet potato 40 minutes.', 'Split and fill with beans and corn.', 'Top with avocado and lime.']],
    ['lemon-chicken-rice', 'Lemon Herb Chicken & Rice', '🍗', 590, 45, 62, 16, 'anything', 30, ['140 g chicken thigh, skinless', '¾ cup rice', 'Green beans', 'Lemon, garlic, herbs'], ['Marinate chicken in lemon, garlic and herbs.', 'Pan-roast until golden and cooked through.', 'Serve with rice and beans.']],
    ['shrimp-tacos', 'Zesty Shrimp Tacos', '🌮', 520, 32, 54, 19, 'anything', 20, ['120 g shrimp', '3 corn tortillas', 'Slaw', 'Lime crema', 'Cilantro'], ['Sear shrimp with chili and lime.', 'Fill warm tortillas with slaw and shrimp.', 'Add crema and cilantro.']],
    ['mushroom-risotto', 'Creamy Mushroom Risotto', '🍄', 560, 16, 80, 18, 'vegetarian', 35, ['½ cup arborio rice', 'Mixed mushrooms', 'Veg stock', 'Parmesan', 'Thyme'], ['Sauté mushrooms and set aside.', 'Toast rice, add stock a ladle at a time.', 'Fold in mushrooms and parmesan.']],
    ['tempeh-satay', 'Tempeh Satay & Rice', '🍢', 580, 30, 64, 22, 'vegan', 25, ['120 g tempeh', 'Satay sauce', '½ cup rice', 'Cucumber salad'], ['Skewer and grill the tempeh.', 'Brush with satay sauce.', 'Serve with rice and cucumber.']],
    ['beef-chili', 'Smoky Beef Chili', '🌶️', 540, 40, 44, 22, 'anything', 40, ['120 g lean beef mince', 'Kidney beans', 'Chopped tomatoes', 'Smoked paprika', 'Greek yogurt dollop'], ['Brown the beef with onion.', 'Add beans, tomatoes and spices, simmer 25 minutes.', 'Top with yogurt.']],
    ['margherita-flatbread', 'Margherita Flatbread', '🍕', 560, 24, 66, 22, 'vegetarian', 15, ['1 wholewheat flatbread', 'Tomato sauce', '60 g mozzarella', 'Basil', 'Side salad'], ['Spread sauce over flatbread, add mozzarella.', 'Bake 8 minutes at 220 °C.', 'Finish with basil.']],
    ['green-curry', 'Thai Green Veggie Curry', '🍲', 520, 16, 62, 24, 'vegan', 25, ['Green curry paste', 'Light coconut milk', 'Tofu, eggplant, beans', 'Thai basil', '½ cup jasmine rice'], ['Fry the paste, add coconut milk.', 'Simmer tofu and veg 10 minutes.', 'Add basil, serve with rice.']],
    ['garlic-cod', 'Garlic Butter Cod & Potatoes', '🐟', 510, 38, 46, 18, 'anything', 25, ['150 g cod', 'Baby potatoes', '1 tsp butter', 'Garlic', 'Peas'], ['Boil the potatoes.', 'Pan-fry cod in garlic butter 4 minutes per side.', 'Serve with potatoes and peas.']],
    ['ricotta-shells', 'Spinach Ricotta Shells', '🧀', 570, 28, 64, 22, 'vegetarian', 40, ['Jumbo pasta shells', 'Ricotta', 'Spinach', 'Marinara', 'Mozzarella'], ['Stuff cooked shells with ricotta and spinach.', 'Nestle in marinara, top with mozzarella.', 'Bake 20 minutes.']],
    ['lentil-bolognese', 'Lentil Bolognese', '🍝', 540, 26, 82, 10, 'vegan', 35, ['½ cup green lentils', 'Wholewheat spaghetti', 'Carrot and celery', 'Tomato passata', 'Oregano'], ['Soften the veg, add lentils and passata.', 'Simmer 25 minutes.', 'Serve over spaghetti.']],
  ],
}

export const MEALS: Meal[] = (Object.keys(rows) as Slot[]).flatMap((slot) =>
  rows[slot].map(([id, name, emoji, kcal, protein, carbs, fat, diet, minutes, ingredients, steps]) => ({
    id, name, slot, emoji, kcal, protein, carbs, fat, diet, minutes, ingredients, steps,
  })),
)

export const MEAL_BY_ID = Object.fromEntries(MEALS.map((m) => [m.id, m]))

const rank: Record<Diet, number> = { vegan: 0, vegetarian: 1, anything: 2 }
export const fitsDiet = (m: Meal, d: Diet) => rank[m.diet] <= rank[d]
