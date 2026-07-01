import { MenuCategory } from "@/types"

export const menuCategories: MenuCategory[] = [
  {
    id: "mixed-grills",
    name: "Mixed Grills",
    nameAr: "مشاوي مشكلة",
    items: [
      {
        name: "Kebab",
        description: "Minced Australian lamb with spices",
        price: 42,
        sizes: [
          { label: "Meal", price: 42 },
          { label: "1/2 KG", price: 70 },
          { label: "1 KG", price: 130 },
        ],
      },
      {
        name: "Eggplant Kebab",
        description: "Minced Australian lamb meat with spices and eggplant slices",
        price: 42,
        sizes: [
          { label: "Meal", price: 42 },
          { label: "1/2 KG", price: 70 },
          { label: "1 KG", price: 130 },
        ],
      },
      {
        name: "Kebab Khashkhash",
        description: "Kebab with tomato sauce",
        price: 42,
        sizes: [
          { label: "Meal", price: 42 },
          { label: "1/2 KG", price: 70 },
          { label: "1 KG", price: 130 },
        ],
      },
      {
        name: "Chicken Kebab",
        description: "Minced chicken breast with spices",
        price: 36,
        sizes: [
          { label: "Meal", price: 36 },
          { label: "1/2 KG", price: 60 },
          { label: "1 KG", price: 110 },
        ],
      },
      {
        name: "Skewer Kibbeh",
        description: "Minced Australian lamb meat with bulgur, red, green peppers, and nuts",
        price: 44,
        sizes: [
          { label: "Meal", price: 44 },
          { label: "1/2 KG", price: 75 },
          { label: "1 KG", price: 130 },
        ],
      },
      {
        name: "Mixed Grill",
        description: "Meat kebab, tikka, chicken kebab, and shish tawook",
        price: 48,
        sizes: [
          { label: "Meal", price: 48 },
          { label: "1/2 KG", price: 80 },
          { label: "1 KG", price: 145 },
        ],
      },
      {
        name: "Shish Tawook",
        description: "Chicken breast skewers marinated with our special spices",
        price: 36,
        sizes: [
          { label: "Meal", price: 36 },
          { label: "1/2 KG", price: 65 },
          { label: "1 KG", price: 120 },
        ],
      },
      {
        name: "Tikka",
        description: "Tender Australian lamb meat skewers with black pepper",
        price: 52,
        sizes: [
          { label: "Meal", price: 52 },
          { label: "1/2 KG", price: 85 },
          { label: "1 KG", price: 170 },
        ],
      },
      {
        name: "Lamb Chops",
        description: "Australian lamb ribs with black pepper",
        price: 58,
        sizes: [
          { label: "Meal", price: 58 },
          { label: "1/2 KG", price: 90 },
          { label: "1 KG", price: 175 },
        ],
      },
      {
        name: "Arayes",
        description: "Fresh grilled bread stuffed with lamb meat and vegetables",
        price: 42,
        sizes: [
          { label: "Meal", price: 42 },
          { label: "1/2 KG", price: 70 },
          { label: "1 KG", price: 130 },
        ],
      },
      {
        name: "Seabream Fish",
        description: "Fresh supreme fish marinated with spices",
        price: 60,
        sizes: [
          { label: "1/2 Whole", price: 36 },
          { label: "1 Whole", price: 65 },
        ],
      },
      {
        name: "Charcoal Chicken",
        description: "Fresh chicken marinated with spices",
        price: 36,
        sizes: [
          { label: "1/2 Whole", price: 36 },
          { label: "1 Whole", price: 65 },
        ],
      },
    ],
  },
  {
    id: "soups",
    name: "Soups",
    nameAr: "الشوربات",
    items: [
      {
        name: "Lentil Soup",
        nameAr: "شوربة عدس",
        description: "Flavorful soup made with lentils, potatoes, carrots, onions, and spices",
        price: 12,
      },
      {
        name: "Vegetables Soup",
        nameAr: "شوربة خضار",
        description: "Mix vegetables with vermicelli and spices",
        price: 18,
      },
      {
        name: "Mushroom Soup",
        nameAr: "شوربة مشروم",
        description: "Creamy mushroom soup with onions, garlic, potatoes, cooking cream, and spices",
        price: 20,
      },
      {
        name: "Chicken Soup",
        nameAr: "شوربة دجاج",
        description: "Chicken breast with onions, garlic, vegetables, and spices",
        price: 18,
      },
    ],
  },
  {
    id: "hot-appetizers",
    name: "Hot Appetizers",
    nameAr: "المقبلات الساخنة",
    items: [
      {
        name: "Hummus with Meat",
        description: "Creamy blend of chickpeas with meat and pine nuts",
        price: 32,
      },
      {
        name: "Batata Harra",
        description: "Fried potato, garlic, coriander, chili paste, and lemon juice",
        price: 24,
      },
      {
        name: "Chicken Liver",
        description: "Fresh chicken liver cooked with onions, garlic, lemon, coriander, and pomegranate molasses",
        price: 28,
      },
      {
        name: "Mushroom Mafrakah",
        description: "Mushrooms cooked with meat, onions, and olive oil",
        price: 32,
      },
      {
        name: "Cheese Barak",
        description: "(4pcs) Fried barak dough stuffed with cheese",
        price: 24,
      },
      {
        name: "French Fries",
        price: 16,
      },
    ],
  },
  {
    id: "cold-appetizers",
    name: "Cold Appetizers",
    nameAr: "المقبلات الباردة",
    items: [
      {
        name: "Hummus",
        description: "Creamy blend of chickpeas, tahini, lemon juice, and olive oil",
        price: 14,
      },
      {
        name: "Mutabbal",
        description: "Grilled eggplant, tahini, yoghurt, and olive oil",
        price: 14,
      },
      {
        name: "Baba Ghanouj",
        description: "Grilled eggplant, tomatoes, green pepper, lemon, and olive oil",
        price: 14,
      },
      {
        name: "Muhammara",
        description: "Red pepper, onion, bell pepper, tomatoes and olive oil",
        price: 16,
      },
      {
        name: "Mazaya Hummus",
        description: "Our special mix of hummus with muhammara",
        price: 18,
      },
      {
        name: "Beiruti Hummus",
        description: "Blended chickpeas, garlic, parsley with olive oil",
        price: 18,
      },
      {
        name: "Vine Leaves with Oil",
        description: "Vine leaves stuffed with rice, parsley, onions, tomatoes, lemon, pomegranate molasses and olive oil",
        price: 28,
      },
      {
        name: "Mixed Mazaya Platter",
        description: "Hummus, mutabbal, baba ghanouj, and muhammara",
        price: 45,
      },
    ],
  },
  {
    id: "pasta",
    name: "Pasta Menu",
    nameAr: "قائمة باستا",
    items: [
      {
        name: "Spaghetti Bolognese",
        description: "Spaghetti pasta with Bolognese sauce, minced beef and parmesan cheese",
        price: 36,
      },
      {
        name: "Penne Arrabbiata",
        description: "Penne pasta with tomato sauce, olive oil, basil, spices, and parmesan",
        price: 36,
      },
      {
        name: "Fettuccini Alfredo",
        description: "Fettuccini pasta, chicken breast, mushrooms, alfredo sauce, parmesan cheese",
        price: 38,
      },
      {
        name: "Bechamel Pasta",
        description: "Pasta with bechamel sauce, mushrooms, chicken and mozzarella cheese baked in oven",
        price: 42,
      },
      {
        name: "Pink Pasta",
        description: "Pasta, chicken, mushroom pink sauce, basil, and mozzarella cheese",
        price: 42,
      },
      {
        name: "Shrimp Pasta",
        description: "Pasta, shrimp, onions, garlic, cream sauce, and spices",
        price: 52,
      },
    ],
  },
  {
    id: "sandwiches",
    name: "Sandwiches",
    nameAr: "السندويشات",
    items: [
      {
        name: "Philadelphia",
        description: "Beef fillet slices, bell peppers, onions, mushrooms, soy sauce and mozzarella cheese",
        price: 32,
      },
      {
        name: "Quesadillas",
        description: "Chicken breast slices, vegetables, guacamole sauce & mozzarella cheese served in tortilla bread",
        price: 30,
      },
      {
        name: "Chicken Fajita",
        description: "Chicken breast slices, bell peppers, soy sauce and mozzarella cheese",
        price: 24,
      },
      {
        name: "Francesco",
        description: "Chicken breast slice, corn, lettuce, mayonnaise and mozzarella cheese",
        price: 24,
      },
      {
        name: "Sujuk",
        description: "Minced lamb meat, sujuk spices, tomatoes, pickles, and garlic sauce",
        price: 24,
      },
      {
        name: "Beef Burger",
        description: "Beef patty, lettuce, tomatoes, onions, pickles, mayonnaise, cheddar cheese",
        price: 32,
      },
      {
        name: "Chicken Burger",
        description: "Chicken patty, lettuce, tomatoes, onions, pickles, cocktail sauce",
        price: 28,
      },
    ],
  },
  {
    id: "salads",
    name: "Salads Menu",
    nameAr: "قائمة السلطات",
    items: [
      {
        name: "Tabbouleh",
        description: "Chopped parsley, bulgur, tomatoes, mint, onion, lemon, and olive oil",
        price: 18,
      },
      {
        name: "Rocca Salad",
        description: "Fresh rocca leaves, tomatoes, onions, pomegranate, walnuts, lemon, and olive oil",
        price: 18,
      },
      {
        name: "Fattoush",
        description: "Lettuce, tomatoes, cucumber, toasted bread, lemon, sumac, pomegranate molasses, and olive oil",
        price: 18,
      },
      {
        name: "Oriental Salad",
        description: "Lettuce, tomatoes, cucumber, mint, onion, lemon, and olive oil",
        price: 18,
      },
      {
        name: "Tuna Salad",
        description: "Tuna, lettuce, corn, lemon, and olive oil",
        price: 20,
      },
      {
        name: "Greek Salad",
        description: "Feta cheese, cucumber, olives, and tomatoes with olive oil",
        price: 20,
      },
      {
        name: "Caesar Salad",
        description: "Chicken seasoned breast, lettuce, toasted bread bites, caesar sauce, parmesan cheese",
        price: 28,
      },
    ],
  },
  {
    id: "kibbeh",
    name: "Kibbeh Menu",
    nameAr: "قائمة الكبب",
    items: [
      {
        name: "Fried Kibbeh",
        nameAr: "كبة مقلية",
        description: "Fried kibbeh dough stuffed with minced meat and nuts",
        price: 6,
        isBestSeller: true,
      },
      {
        name: "Charcoal-Grilled Kibbeh",
        nameAr: "كبة على الفحم",
        description: "Kibbeh dough stuffed with meat, fat, pomegranate, and nuts",
        price: 9,
      },
      {
        name: "Kibbeh Bil-Saniyeh",
        nameAr: "كبة بالصينية",
        description: "Kibbeh dough, meat, and nuts, cooked in the oven",
        price: 42,
        sizes: [
          { label: "Meal", price: 42 },
          { label: "1 KG", price: 120 },
        ],
      },
      {
        name: "Kibbeh Bil-Laban (6 pcs)",
        nameAr: "كبة باللبن",
        description: "Fried kibbeh cooked with yoghurt",
        price: 38,
      },
    ],
  },
  {
    id: "juices",
    name: "Juices",
    nameAr: "العصائر",
    items: [
      { name: "Lemon", nameAr: "ليمون", price: 18 },
      { name: "Fruit Cocktail", nameAr: "كوكتيل فواكه", price: 24 },
      { name: "Lemon & Mint", nameAr: "ليمون ونعناع", price: 18 },
      { name: "Apple", nameAr: "تفاح", price: 20 },
      { name: "Orange", nameAr: "برتقال", price: 18 },
      { name: "Avocado", nameAr: "أفوكادو", price: 24 },
      { name: "Mango", nameAr: "مانجو", price: 18 },
      { name: "Carrot", nameAr: "جزر", price: 18 },
      { name: "Pineapple", nameAr: "أناناس", price: 18 },
      { name: "Pomegranate", nameAr: "رمان", price: 24 },
    ],
  },
  {
    id: "hot-beverages",
    name: "Hot Beverages",
    nameAr: "المشروبات الساخنة",
    items: [
      { name: "Tea", nameAr: "شاي", price: 6 },
      { name: "Green Tea", nameAr: "شاي أخضر", price: 6 },
      { name: "Tea with Milk", nameAr: "شاي بالحليب", price: 8 },
      { name: "Turkish Coffee", nameAr: "قهوة تركية", price: 12 },
      { name: "Espresso", nameAr: "إسبريسو", price: 16 },
      { name: "Cappuccino", nameAr: "كابتشينو", price: 18 },
    ],
  },
  {
    id: "cold-beverages",
    name: "Cold Beverages",
    nameAr: "المشروبات الباردة",
    items: [
      { name: "Small Water", nameAr: "ماء صغير", price: 3 },
      { name: "Pepsi / Pepsi Diet", price: 6 },
      { name: "Black Pepsi", nameAr: "بيبسي أسود", price: 6 },
      { name: "Meranda", nameAr: "ميرندا", price: 6 },
      { name: "Mountain Dew", nameAr: "موتن ديو", price: 6 },
      { name: "7UP", price: 6 },
      { name: "Ayran", nameAr: "عيران", price: 8 },
    ],
  },
  {
    id: "platters-mansaf",
    name: "Platters & Mansaf",
    nameAr: "الصواني والمناسف",
    items: [
      {
        name: "Chicken Kabseh",
        description: "Chicken served with cooked rice, vegetables, spices, and nuts",
        price: 140,
        sizes: [
          { label: "2 Whole Chickens", price: 140 },
          { label: "4 Whole Chickens", price: 240 },
          { label: "6 Whole Chickens", price: 360 },
        ],
      },
      {
        name: "Freekeh with Chicken",
        description: "Chicken served with freekeh (roasted green wheat) cooked in the Syrian way and nuts",
        price: 140,
        sizes: [
          { label: "2 Whole Chickens", price: 140 },
          { label: "4 Whole Chickens", price: 240 },
          { label: "6 Whole Chickens", price: 360 },
        ],
      },
      {
        name: "Chicken Mandi",
        description: "Chicken served with mandi rice and nuts",
        price: 130,
        sizes: [
          { label: "2 Whole Chickens", price: 130 },
          { label: "4 Whole Chickens", price: 240 },
          { label: "5 Whole Chickens", price: 360 },
        ],
      },
      {
        name: "Chicken Mathbi",
        description: "Grilled chicken on charcoal served with mandi rice and nuts",
        price: 140,
        sizes: [
          { label: "2 Whole Chickens", price: 140 },
          { label: "4 Whole Chickens", price: 240 },
          { label: "6 Whole Chickens", price: 360 },
        ],
      },
      {
        name: "Chicken Biryani",
        description: "Chicken served with biryani rice and nuts",
        price: 130,
        sizes: [
          { label: "2 Whole Chickens", price: 130 },
          { label: "4 Whole Chickens", price: 240 },
          { label: "6 Whole Chickens", price: 360 },
        ],
      },
      {
        name: "Fish Sayadia",
        description: "Seabream fish served with cooked rice in special spices and nuts",
        price: 220,
        sizes: [
          { label: "4 Fishes", price: 220 },
          { label: "8 Fishes", price: 400 },
        ],
      },
      {
        name: "Oriental Rice with Meat",
        description: "Lamb meat served with cooked rice, onions, minced lamb meat and oriental spices and nuts",
        price: 220,
        sizes: [
          { label: "1/4 Lamb", price: 220 },
          { label: "1/2 Lamb", price: 380 },
          { label: "Full Lamb", price: 600 },
        ],
      },
      {
        name: "Meat Kabseh",
        description: "Lamb meat served with cooked rice, vegetables, special kabseh spices and nuts",
        price: 240,
        sizes: [
          { label: "1/4 Lamb", price: 240 },
          { label: "1/2 Lamb", price: 400 },
          { label: "Full Lamb", price: 650 },
        ],
      },
      {
        name: "Freekeh with Meat",
        description: "Lamb meat served with roasted green wheat and nuts cooked in the Syrian way",
        price: 240,
        sizes: [
          { label: "1/4 Lamb", price: 240 },
          { label: "1/2 Lamb", price: 400 },
          { label: "Full Lamb", price: 650 },
        ],
      },
      {
        name: "Meat Mandi",
        description: "Lamb meat served with mandi rice and nuts",
        price: 200,
        sizes: [
          { label: "1/4 Lamb", price: 200 },
          { label: "1/2 Lamb", price: 360 },
          { label: "Full Lamb", price: 550 },
        ],
      },
    ],
  },
  {
    id: "daily-dishes",
    name: "Daily Dishes",
    nameAr: "الأطباق اليومية",
    items: [
      {
        name: "Meat Slices & Potatoes",
        nameAr: "شرائح لحم مع بطاطا",
        description: "Beef slices cooked with crispy fried potatoes with lemon and garlic sauce",
        price: 48,
      },
      {
        name: "Grape Leaves with Meat",
        nameAr: "ورق عنب مع لحم",
        description: "Grape leaves stuffed with rice and minced meat cooked with lamb meat and lemon juice",
        price: 48,
      },
      {
        name: "Shami Ozzi",
        nameAr: "شامي عزي",
        description: "Spiced rice with lamb meat and peas wrapped in thin layers of dough and baked to a golden crispy perfection (2 pcs)",
        price: 42,
      },
      {
        name: "Molokhia & Chicken",
        nameAr: "ملوخية مع دجاج",
        description: "Flavorful molokhia leaves cooked with chicken",
        price: 36,
      },
      {
        name: "Molokhia & Meat",
        nameAr: "ملوخية مع لحم",
        description: "Flavorful molokhia leaves cooked with meat",
        price: 42,
      },
      {
        name: "White Beans",
        nameAr: "فاصوليا بيضاء",
        description: "White beans cooked with tomato sauce with onions and spices and lamb meat",
        price: 42,
      },
      {
        name: "Okra",
        nameAr: "بامية",
        description: "Okra cooked with garlic, spices and lamb meat",
        price: 42,
      },
      {
        name: "Beef Stroganoff",
        nameAr: "ستروغانوف لحم",
        description: "Thinly sliced beef, sauteed and simmered in a creamy, tangy sauce and mushroom",
        price: 48,
      },
      {
        name: "Cordon Bleu",
        nameAr: "كوردون بلو",
        description: "Breaded & fried chicken breast filled with cheese, turkey, served with bechamel sauce",
        price: 52,
      },
    ],
  },
]
