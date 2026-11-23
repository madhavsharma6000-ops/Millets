/**
 * Imports posts 2–10 from "10 Nutrition & Healthy Food Blogs.pdf" (post 1 was added via the admin).
 * Safe to re-run: posts whose slug already exists are skipped.
 *
 *   node scripts/import-nutrition-blogs.js
 */
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const posts = [
  {
    n: 2,
    title: 'Getting Enough Protein on a Vegetarian Diet',
    category: 'Nutrition Tips',
    tags: ['protein', 'vegetarian', 'nutrition'],
    excerpt: 'Most vegetarians can meet their protein needs easily. The trick is to include a protein source in every meal, not just at dinner.',
    content: `
<p>Most vegetarians can meet their protein needs easily. The trick is to include a protein source in every meal, not just at dinner.</p>
<p>A common guideline for healthy adults is about 0.8 g of protein per kg of body weight per day. Active people, older adults and those recovering from illness may need more.</p>
<h2>Good vegetarian protein sources (approximate)</h2>
<table>
  <thead><tr><th>Food</th><th>Serving</th><th>Protein</th></tr></thead>
  <tbody>
    <tr><td>Paneer</td><td>100 g</td><td>18 g</td></tr>
    <tr><td>Cooked dal (moong, masoor, toor)</td><td>1 katori (150 g)</td><td>9 g</td></tr>
    <tr><td>Boiled chana or rajma</td><td>1 katori (150 g)</td><td>11 g</td></tr>
    <tr><td>Curd / dahi</td><td>1 cup (200 g)</td><td>7 g</td></tr>
    <tr><td>Milk</td><td>1 glass (250 ml)</td><td>8 g</td></tr>
    <tr><td>Peanuts</td><td>30 g (a handful)</td><td>7 g</td></tr>
    <tr><td>Soya chunks, cooked</td><td>1 katori</td><td>13 g</td></tr>
    <tr><td>Tofu</td><td>100 g</td><td>8 g</td></tr>
  </tbody>
</table>
<h2>Easy ways to add more</h2>
<ul>
  <li><strong>Breakfast:</strong> besan chilla, moong dal chilla, or poha with peanuts and a glass of milk.</li>
  <li><strong>Lunch:</strong> thicker dal, plus a bowl of curd.</li>
  <li><strong>Snacks:</strong> roasted chana, sprouts chaat, or a paneer tikka.</li>
  <li><strong>Dinner:</strong> rajma or chole with rice, or a paneer and vegetable stir-fry.</li>
</ul>
<p><strong>Combine for better quality.</strong> Grains and pulses together, like dal-chawal or khichdi, give a more complete set of amino acids than either alone. Traditional Indian food got this right long ago.</p>
<p>If you train hard or follow a vegan diet, a dietitian can help you check your intake.</p>`,
  },
  {
    n: 3,
    title: 'Fibre: The Quiet Hero of Gut Health',
    category: 'Gut Health',
    tags: ['fibre', 'gut health', 'digestion'],
    excerpt: "Fibre doesn't get much attention, but it does a lot. Most adults are advised to eat about 25 to 30 g a day, and many people eat far less.",
    content: `
<p>Fibre doesn't get much attention, but it does a lot. Most adults are advised to eat about 25 to 30 g a day, and many people eat far less.</p>
<h2>Two kinds of fibre</h2>
<ul>
  <li><strong>Soluble fibre</strong> dissolves in water and forms a gel. It helps manage blood sugar and cholesterol. Find it in oats, apples, isabgol, rajma and barley.</li>
  <li><strong>Insoluble fibre</strong> adds bulk and keeps digestion regular. Find it in whole wheat, bran, vegetables and the skins of fruit.</li>
</ul>
<h2>Why your gut loves it</h2>
<p>The bacteria in your gut feed on fibre. In return they produce compounds that support the gut lining and overall health. A fibre-rich diet is linked with lower risk of heart disease, type 2 diabetes and constipation.</p>
<h2>Simple swaps</h2>
<ul>
  <li>Maida bread → whole wheat or multigrain bread</li>
  <li>White rice every day → brown rice, or mix in millets a few times a week</li>
  <li>Fruit juice → the whole fruit</li>
  <li>Chips → roasted makhana or chana</li>
  <li>Peeled cucumber and apple → keep the skin on (washed well)</li>
</ul>
<p><strong>Go slow and drink water.</strong> Adding a lot of fibre suddenly can cause bloating. Increase gradually over a couple of weeks and drink plenty of water, since fibre needs it to move smoothly.</p>
<p>A plate full of colour is usually a plate full of fibre.</p>`,
  },
  {
    n: 4,
    title: 'Healthy Fats: Myths and Facts',
    category: 'Nutrition Tips',
    tags: ['fats', 'ghee', 'heart health'],
    excerpt: 'Fat is not the enemy. Your body needs it for energy, hormones, brain health and absorbing vitamins. What matters is the type and the amount.',
    content: `
<p>Fat is not the enemy. Your body needs it for energy, hormones, brain health and absorbing vitamins. What matters is the type and the amount.</p>
<h2>Myths and facts</h2>
<p><strong>Myth 1: All fat makes you fat.</strong><br>Fact: Weight gain comes from eating more energy than you use over time. Fat is calorie-dense (9 kcal per gram), so portions matter, but a moderate amount of good fat keeps meals satisfying.</p>
<p><strong>Myth 2: Ghee is always bad.</strong><br>Fact: Ghee is mostly saturated fat, so it's best in moderation, about a teaspoon or two a day within an overall balanced diet. It doesn't need to be banned.</p>
<p><strong>Myth 3: "Refined" oil is the healthiest choice.</strong><br>Fact: No single oil is perfect. Rotating oils, such as mustard, groundnut, rice bran and sesame, gives a better mix of fatty acids.</p>
<p><strong>Myth 4: Low-fat packaged foods are healthier.</strong><br>Fact: Many replace fat with sugar or starch. Read the label.</p>
<h2>Fats to enjoy</h2>
<p>Nuts, seeds (flax, chia, til), peanuts, avocado, fish, and cold-pressed oils in sensible amounts.</p>
<h2>Fats to limit</h2>
<p>Deep-fried snacks, vanaspati, reused frying oil, and baked goods made with hydrogenated fat. These can contain trans fats, which raise heart disease risk.</p>
<p><strong>Quick rule:</strong> Cook with a measured spoon, not a free pour. Snack on a handful of nuts, not a packet of namkeen.</p>`,
  },
  {
    n: 5,
    title: 'Hydration: Are You Really Drinking Enough Water?',
    category: 'Wellness Lifestyle',
    tags: ['hydration', 'water', 'wellness'],
    excerpt: 'Water is involved in almost everything your body does. Even mild dehydration can cause tiredness, headaches and poor focus.',
    content: `
<p>Water is involved in almost everything your body does: controlling temperature, moving nutrients, cushioning joints and clearing waste. Even mild dehydration can cause tiredness, headaches and poor focus.</p>
<h2>How much do you need?</h2>
<p>A common rough guide is 2 to 3 litres of total fluid a day for adults. You'll need more in hot weather, during exercise, or if you're unwell with fever or loose motions. Food counts too: fruits, vegetables, dal and buttermilk all add fluid.</p>
<p><strong>The easiest check:</strong> Look at your urine. Pale yellow usually means you're well hydrated. Dark yellow means drink more.</p>
<h2>Smart drinks</h2>
<ul>
  <li>Plain water, first and most.</li>
  <li>Chaas (buttermilk), nimbu pani with little or no sugar, and coconut water.</li>
  <li>Jeera or saunf water, if you enjoy the flavour.</li>
</ul>
<h2>Drinks to limit</h2>
<ul>
  <li>Sugary soft drinks and packaged juices, which add a lot of sugar with little nutrition.</li>
  <li>Energy drinks, which are high in caffeine and sugar.</li>
  <li>Too much tea or coffee late in the day, which can disturb sleep.</li>
</ul>
<h2>Habits that help</h2>
<ul>
  <li>Keep a bottle on your desk or in your bag and refill it.</li>
  <li>Drink a glass of water when you wake up and with every meal.</li>
  <li>Sip regularly during exercise and in the summer heat, rather than waiting until you're very thirsty.</li>
</ul>
<p><em>People with kidney or heart conditions should follow their doctor's advice on fluid intake.</em></p>`,
  },
  {
    n: 6,
    title: 'Smart Snacking: Beat the 4 PM Hunger Without the Junk',
    category: 'Healthy Snacking',
    tags: ['snacks', 'healthy snacking', 'energy'],
    excerpt: "Snacking isn't a bad habit. Done well, it keeps your energy steady and stops you from overeating at dinner.",
    content: `
<p>Snacking isn't a bad habit. Done well, it keeps your energy steady and stops you from overeating at dinner. The problem is what we reach for: biscuits, chips, samosas and sugary tea.</p>
<p><strong>What makes a good snack?</strong> Aim for some protein or fibre, ideally both. They keep you full far longer than refined carbs alone.</p>
<h2>10 snacks under 200 kcal (approximate)</h2>
<ol>
  <li>A handful of roasted chana (30 g)</li>
  <li>Sprouts chaat with onion, tomato and lemon</li>
  <li>One fruit with 8–10 almonds</li>
  <li>A bowl of curd with a little fruit</li>
  <li>Roasted makhana (1 cup) with a pinch of salt and pepper</li>
  <li>One boiled egg with a slice of whole wheat toast</li>
  <li>Cucumber and carrot sticks with hummus</li>
  <li>A small bowl of poha loaded with vegetables and peanuts</li>
  <li>A glass of chaas and a few roasted peanuts</li>
  <li>Two small idlis with sambar</li>
</ol>
<p><strong>Plan ahead.</strong> Hunger makes choices for you. Carry a snack box to college or work so you aren't stuck with the vending machine.</p>
<p><strong>Watch the extras.</strong> Namkeen, "diet" biscuits and flavoured yogurts often carry hidden salt, sugar and fat. Check the packet.</p>
<p><strong>Ask yourself first:</strong> Am I hungry, or bored, tired or thirsty? A glass of water or a short walk sometimes fixes the craving.</p>`,
  },
  {
    n: 7,
    title: 'Sugar: Spotting the Hidden Sweetness in Your Diet',
    category: 'Nutrition Tips',
    tags: ['sugar', 'food labels', 'nutrition'],
    excerpt: 'The sugar you add to chai is easy to see. The sugar inside sauces, drinks and packaged foods is not, and it adds up fast.',
    content: `
<p>The sugar you add to chai is easy to see. The sugar inside sauces, drinks and packaged foods is not, and it adds up fast.</p>
<p>The World Health Organization recommends keeping "free sugars" below 10% of daily energy, and suggests below 5% (about 25 g, or 6 teaspoons) for extra benefit. One 300 ml soft drink can contain around 30 g on its own.</p>
<h2>Where hidden sugar hides</h2>
<ul>
  <li>Packaged fruit juices and "health" drinks</li>
  <li>Flavoured yogurt and milkshakes</li>
  <li>Breakfast cereals and granola</li>
  <li>Tomato ketchup and sauces</li>
  <li>Biscuits, including many marketed as healthy</li>
  <li>Protein bars</li>
</ul>
<p><strong>Names to watch on labels:</strong> sucrose, glucose, fructose, dextrose, maltose, corn syrup, invert sugar, malt extract, honey and jaggery. They are all sugar. If one appears near the top of the ingredient list, the product is high in it.</p>
<p><strong>What about jaggery and honey?</strong> They carry tiny amounts of minerals, but your body handles them much like sugar. Use them in moderation too.</p>
<h2>Cutting back without misery</h2>
<ul>
  <li>Reduce sugar in tea or coffee by half a spoon each week. Your taste adjusts.</li>
  <li>Swap juice for whole fruit.</li>
  <li>Choose plain curd and add fruit yourself.</li>
  <li>Keep sweets for festivals and occasions, and enjoy a smaller portion slowly.</li>
</ul>
<p>You don't have to give up mithai. Just make it a treat again, not a daily habit.</p>`,
  },
  {
    n: 8,
    title: 'Millets: The Ancient Grains Making a Comeback',
    category: 'Ancient Grains',
    tags: ['millets', 'ancient grains', 'gluten-free'],
    excerpt: "Before white rice and refined wheat took over, millets were everyday food across India. They're back on plates now, and for good reason.",
    content: `
<p>Before white rice and refined wheat took over, millets were everyday food across India. They're back on plates now, and for good reason.</p>
<h2>Why millets?</h2>
<ul>
  <li>Higher in fibre than polished rice, so they digest more slowly and keep you full.</li>
  <li>Rich in minerals like iron, magnesium and calcium (ragi is especially high in calcium).</li>
  <li>Naturally gluten-free, a useful option for people who avoid gluten.</li>
  <li>Hardy crops that need less water, making them kinder to farmers and the planet.</li>
</ul>
<h2>Meet the millets</h2>
<table>
  <thead><tr><th>Millet</th><th>Hindi name</th><th>Try it as</th></tr></thead>
  <tbody>
    <tr><td>Finger millet</td><td>Ragi / nachni</td><td>Ragi dosa, ragi malt, ladoo</td></tr>
    <tr><td>Pearl millet</td><td>Bajra</td><td>Bajra roti with saag, khichdi</td></tr>
    <tr><td>Sorghum</td><td>Jowar</td><td>Jowar roti (bhakri), upma</td></tr>
    <tr><td>Foxtail millet</td><td>Kangni / kakum</td><td>Pulao, lemon rice, khichdi</td></tr>
    <tr><td>Little millet</td><td>Kutki</td><td>In place of rice with dal</td></tr>
    <tr><td>Barnyard millet</td><td>Sanwa / samak</td><td>Fasting khichdi, kheer</td></tr>
  </tbody>
</table>
<h2>How to start</h2>
<ul>
  <li>Replace rice with a millet two or three times a week.</li>
  <li>Mix ragi or jowar flour into your regular atta, starting with about a quarter.</li>
  <li>Soak millets for a few hours before cooking. They cook faster and digest more easily.</li>
</ul>
<p><strong>Keep it balanced.</strong> Millets are great, but they're still grains. Pair them with dal, vegetables and curd, just as you would rice or roti.</p>`,
  },
  {
    n: 9,
    title: 'Dairy, Calcium and Vitamin D: Building Strong Bones for Life',
    category: 'Nutrition Tips',
    tags: ['calcium', 'vitamin d', 'bone health'],
    excerpt: 'Your bones keep building strength until about your late twenties or early thirties. Calcium and vitamin D are the two nutrients that matter most.',
    content: `
<p>Your bones keep building strength until about your late twenties or early thirties. After that, the goal is to protect what you've built. Calcium and vitamin D are the two nutrients that matter most here.</p>
<h2>Calcium: where to get it</h2>
<p>Most adults need roughly 1,000 mg of calcium a day; needs vary with age and life stage.</p>
<ul>
  <li>Milk, curd, chaas and paneer are among the easiest sources. A glass of milk gives about 250–300 mg.</li>
  <li>Ragi is one of the richest plant sources.</li>
  <li>Til (sesame seeds), rajma, chana and green leafy vegetables like methi and amaranth add more.</li>
  <li>Calcium-set tofu and fortified plant milks help those who avoid dairy.</li>
</ul>
<h2>Vitamin D: the helper</h2>
<p>Vitamin D helps your body absorb calcium. Your skin makes it in sunlight, yet deficiency is very common in India because many people spend most of the day indoors.</p>
<ul>
  <li>Get some sunlight on your arms and face on most days, when safe.</li>
  <li>Food sources include egg yolks, fatty fish, and fortified milk or oil.</li>
  <li>If you feel constant tiredness or bone and muscle aches, ask your doctor about a blood test before starting supplements.</li>
</ul>
<h2>Other bone-friendly habits</h2>
<ul>
  <li>Weight-bearing exercise: walking, climbing stairs, strength training.</li>
  <li>Enough protein.</li>
  <li>Less smoking, alcohol and excess salt, all of which can weaken bones.</li>
</ul>
<p><strong>Lactose intolerant?</strong> Curd and aged paneer are often easier to digest than milk, because some of the lactose is already broken down.</p>`,
  },
  {
    n: 10,
    title: 'Iron and Anaemia: Eating to Keep Your Energy Up',
    category: 'Nutrition Tips',
    tags: ['iron', 'anaemia', 'energy'],
    excerpt: 'Feeling tired all the time, short of breath on the stairs, or unusually pale? Low iron could be one reason.',
    content: `
<p>Feeling tired all the time, short of breath on the stairs, or unusually pale? Low iron could be one reason. Anaemia is widespread in India, especially among women and adolescent girls.</p>
<p>Iron helps carry oxygen in your blood. When levels drop, every part of your body gets less of it.</p>
<h2>Two kinds of iron</h2>
<ul>
  <li><strong>Heme iron</strong> from meat, fish, chicken and eggs is absorbed well.</li>
  <li><strong>Non-heme iron</strong> from plants, such as green leafy vegetables, rajma, chana, lentils, jaggery, dates, til and poha, is absorbed less easily. You can boost it with the right pairings.</li>
</ul>
<h2>Pair it with vitamin C</h2>
<p>Vitamin C can sharply improve how much plant iron you absorb.</p>
<ul>
  <li>Squeeze lemon over dal, chana or sprouts.</li>
  <li>Eat amla, guava, orange or tomato alongside iron-rich meals.</li>
  <li>Add capsicum or tomato to your palak or methi sabzi.</li>
</ul>
<h2>Watch the blockers</h2>
<p>Tea and coffee contain compounds that reduce iron absorption. Have them an hour before or after meals instead of with them. Large amounts of calcium taken at the same meal can also interfere.</p>
<p><strong>A useful old trick:</strong> Cooking in a cast-iron kadhai can add a small amount of iron to food.</p>
<h2>When to see a doctor</h2>
<p>Diet helps, but it can't fix every case. If you have symptoms, get a simple blood test (haemoglobin and ferritin). Take iron supplements only on medical advice, since too much iron can be harmful.</p>`,
  },
]

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const readingTime = (html) => {
  const words = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@yourdomain.com').toLowerCase()
  const author = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!author) console.warn(`No user found for ${adminEmail}; posts will have no author.`)

  // Match the numbering of the existing "1. The Balanced Plate..." post.
  // Later numbers get slightly later publish times, so the series lists 10 → 1 like a normal blog.
  const base = Date.now()

  for (const post of posts) {
    const title = `${post.n}. ${post.title}`
    const slug = slugify(title)
    if (await prisma.blog.findUnique({ where: { slug } })) {
      console.log(`skip   ${title} (already exists)`)
      continue
    }
    const content = post.content.trim()
    await prisma.blog.create({
      data: {
        title,
        slug,
        metaTitle: post.title,
        metaDescription: post.excerpt,
        keywords: JSON.stringify(post.tags),
        excerpt: post.excerpt,
        content,
        featuredImage: '',
        imageAlt: post.title,
        category: post.category,
        tags: JSON.stringify(post.tags),
        authorId: author ? author.id : null,
        status: 'published',
        publishedAt: new Date(base - (11 - post.n) * 60 * 1000),
        readingTime: readingTime(content),
      },
    })
    console.log(`added  ${title}  [${post.category}]`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
