/**
 * Dayal Sweets - Unified Product Catalog
 * Source of truth for products, variations, descriptions, and related recommendations.
 */

export const allProducts = [
    {
        id: 8558,
        name: 'Office Tea Combo',
        category: 'UNCATEGORIZED',
        categorySlug: 'combo',
        slug: 'office-tea-combo',
        badge: 'COMBO',
        tagline: 'Discover Every Festive Delight',
        description: 'Brighten up your workday with our Office Tea Combo—a perfect pairing of refreshing tea and delicious snacks. Ideal for team breaks, meetings, or a quick afternoon treat at the office.',
        fullDescription: 'Brighten up your workday with our Office Tea Combo—a perfect pairing of refreshing tea and delicious snacks. Ideal for team breaks, meetings, or a quick afternoon treat at the office. Handcrafted with traditional recipes and premium ingredients to ensure freshness and authentic taste in every bite.',
        ingredients: 'Finest Assam CTC tea blend, fresh whole milk, crushed green cardamom, dried ginger, pure desi ghee mathi, crunchy namkeen mix, and cashew sweets. Prepared in a 100% pure vegetarian kitchen.',
        allergens: 'Contains Dairy, Gluten, and Tree Nuts.',
        storage: 'Store snacks in an airtight container at room temperature. Consume fresh beverages immediately.',
        image: '/uploads/2026/09/Office-Tea-Combo.png',
        gallery: [
            '/uploads/2026/09/Office-Tea-Combo.png',
            '/uploads/2026/09/Tea-Time-Delight.png',
            '/uploads/2026/08/Snacks-Collection.png',
        ],
        price: 150,
        originalPrice: null,
        rating: 0.0,
        ratingCount: 0,
        inStock: true,
        diet: '100% Pure Vegetarian',
        variations: [
            { label: 'Standard Combo (Serves 2-3)', price: 150 },
            { label: 'Executive Team Box (Serves 5-6)', price: 280 },
        ],
        relatedSlugs: ['engagement-combo', 'birthday-party-combo', 'family-evening-combo', 'tea-time-delight'],
    },
    {
        id: 8556,
        name: 'Engagement Combo',
        category: 'COMBO',
        categorySlug: 'combo',
        slug: 'engagement-combo',
        badge: 'COMBO',
        tagline: 'Celebrate Your Special Moments',
        description: 'Celebrate your special day with our Engagement Combo, thoughtfully curated with rich traditional sweets and savouries.',
        fullDescription: 'Make your auspicious engagement ceremony unforgettable with Dayal Sweets Engagement Combo. Features royal Kaju Katli, saffron Motichoor laddus, roasted dry fruits, and crunchy Mathi bites packed in a bespoke luxury presentation box.',
        ingredients: 'Pure desi ghee, premium cashew nuts (Goan grade), California almonds, saffron strands, pistachio slivers, and cardamom.',
        allergens: 'Contains Tree Nuts and Dairy.',
        storage: 'Store in a cool, dry place. Best consumed within 15 days of dispatch.',
        image: '/uploads/2026/09/Engagement-Combo.png',
        gallery: [
            '/uploads/2026/09/Engagement-Combo.png',
            '/uploads/2026/08/Gifting-Hero-Visual.png',
        ],
        price: 250,
        originalPrice: 280,
        rating: 5.0,
        ratingCount: 22,
        inStock: true,
        diet: '100% Pure Vegetarian',
        variations: [
            { label: 'Standard Box', price: 250 },
            { label: 'Royal Hamper', price: 450 },
        ],
        relatedSlugs: ['office-tea-combo', 'birthday-party-combo', 'family-evening-combo', 'marwadi-ladoo'],
    },
    {
        id: 8554,
        name: 'Birthday Party Combo',
        category: 'COMBO',
        categorySlug: 'combo',
        slug: 'birthday-party-combo',
        badge: 'COMBO',
        tagline: 'Joy in Every Bite',
        description: 'Make every birthday celebration sweeter and memorable with our Birthday Party Combo! A delicious selection of crowd-pleasing sweets.',
        fullDescription: 'Delight guests of all ages with our popular Birthday Party Combo. Packed with crowd-favorite chocolate fudge brownies, spongy gulab jamuns, colorful mini laddus, and salted wafers.',
        ingredients: 'Milk mawa, rich cocoa, farm-churned butter, pure desi ghee, organic cane sugar, and cardamom.',
        allergens: 'Contains Dairy and Gluten.',
        storage: 'Keep refrigerated for optimum texture and taste.',
        image: '/uploads/2026/09/Birthday-Party-Combo.png',
        gallery: [
            '/uploads/2026/09/Birthday-Party-Combo.png',
            '/uploads/2026/07/Cakes.jpg',
        ],
        price: 200,
        originalPrice: 220,
        rating: 4.9,
        ratingCount: 30,
        inStock: true,
        diet: '100% Pure Vegetarian',
        variations: [
            { label: 'Standard (1 Box)', price: 200 },
            { label: 'Deluxe (2 Boxes)', price: 380 },
        ],
        relatedSlugs: ['office-tea-combo', 'engagement-combo', 'brownies', 'cakes'],
    },
    {
        id: 8553,
        name: 'Family Evening Combo',
        category: 'COMBO',
        categorySlug: 'combo',
        slug: 'family-evening-combo',
        badge: 'COMBO',
        tagline: 'Heartwarming Assortment',
        description: 'Enjoy a delicious evening together with our Family Evening Combo, featuring a heartwarming assortment of fresh sweets and savouries.',
        fullDescription: 'A classic evening snack assortment featuring fresh Samosas, Khasta Kachoris, Besan Laddus, and crunchy Aloo Bhujia. Made fresh daily with pure desi ghee.',
        ingredients: 'Potatoes, green peas, whole wheat flour, besan, pure desi ghee, mustard oil for savouries, cumin, and rock salt.',
        allergens: 'Contains Gluten. Prepared in a vegetarian facility.',
        storage: 'Reheat savouries in an oven for 3 minutes for maximum crispness.',
        image: '/uploads/2026/09/Family-Evening-combo.png',
        gallery: ['/uploads/2026/09/Family-Evening-combo.png'],
        price: 300,
        originalPrice: null,
        rating: 4.7,
        ratingCount: 19,
        inStock: true,
        diet: '100% Pure Vegetarian',
        variations: [
            { label: 'Family Pack (Serves 4)', price: 300 },
            { label: 'Jumbo Pack (Serves 8)', price: 550 },
        ],
        relatedSlugs: ['tea-time-delight', 'office-tea-combo', 'masala-dosa', 'himachali-special'],
    },
    {
        id: 8550,
        name: 'Tea Time Delight',
        category: 'COMBO',
        categorySlug: 'combo',
        slug: 'tea-time-delight',
        badge: 'COMBO',
        tagline: 'Classic Crispy Bites',
        description: 'Because the best conversations happen over tea and delicious snacks! Our Tea Time Delight brings together classic crispy bites.',
        fullDescription: 'The quintessential tea-time accompaniment: roasted cashews, mathi bites, namkeen mix, and sweet pedas crafted to complement hot Indian chai.',
        ingredients: 'Whole wheat, kasuri methi, pure ghee, cashew nuts, black pepper, and rock salt.',
        allergens: 'Contains Gluten and Tree Nuts.',
        storage: 'Store in an airtight container away from moisture.',
        image: '/uploads/2026/09/Tea-Time-Delight.png',
        gallery: ['/uploads/2026/09/Tea-Time-Delight.png'],
        price: 75,
        originalPrice: null,
        rating: 4.6,
        ratingCount: 14,
        inStock: true,
        diet: '100% Pure Vegetarian',
        variations: [],
        relatedSlugs: ['office-tea-combo', 'family-evening-combo', 'brownies', 'marwadi-ladoo'],
    },
    {
        id: 7540,
        name: 'Masala Dosa',
        category: 'SOUTH INDIAN',
        categorySlug: 'south-indian',
        slug: 'masala-dosa',
        badge: 'SOUTH INDIAN',
        tagline: 'Crispy Golden Perfection',
        description: 'Crispy golden dosa filled with spiced mashed potato stuffing, served piping hot with flavorful sambar and coconut chutney.',
        fullDescription: 'Authentic South Indian crispy crepe prepared from naturally fermented rice and urad dal batter, tossed on a traditional tawa with pure butter. Filled with comforting spiced potato masala, served with piping hot drumstick sambar and fresh coconut chutney.',
        ingredients: 'Parboiled rice, urad dal, fenugreek, potatoes, mustard seeds, curry leaves, ginger, turmeric, and coconut.',
        allergens: 'Contains Mustard and Coconut. 100% Gluten-free.',
        storage: 'Best consumed piping hot upon arrival.',
        image: '/uploads/2026/09/Masala-Dosa.png',
        gallery: ['/uploads/2026/09/Masala-Dosa.png'],
        price: 110,
        originalPrice: null,
        rating: 4.9,
        ratingCount: 28,
        inStock: true,
        diet: '100% Pure Vegetarian',
        variations: [
            { label: '1 Piece Regular', price: 110 },
            { label: 'Butter Special', price: 135 },
            { label: 'Paneer Masala Dosa', price: 160 },
        ],
        relatedSlugs: ['chilli-paneer', 'paneer-butter-masala', 'office-tea-combo', 'tea-time-delight'],
    },
    {
        id: 7537,
        name: 'Chilli Paneer',
        category: 'CHINESE',
        categorySlug: 'chinese',
        slug: 'chilli-paneer',
        badge: 'CHINESE',
        tagline: 'Sizzling Indo-Chinese',
        description: 'Crispy fried paneer cubes tossed with crunchy bell peppers, onions, and a spicy, tangy Indo-Chinese sauce.',
        fullDescription: 'Golden fried malai cottage cheese tossed in a wok over high flame with fresh bell peppers, shallots, garlic, green chilies, and our house-special tangy chili glaze.',
        ingredients: 'Fresh dairy paneer, capsicum, onions, dark soy sauce, chili paste, cornstarch, vinegar, and spring onions.',
        allergens: 'Contains Dairy and Soy.',
        storage: 'Consume hot.',
        image: '/uploads/2026/09/chilipanner.png',
        gallery: ['/uploads/2026/09/chilipanner.png'],
        price: 250,
        originalPrice: null,
        rating: 4.8,
        ratingCount: 35,
        inStock: true,
        diet: '100% Pure Vegetarian',
        variations: [
            { label: 'Dry (Starter)', price: 250 },
            { label: 'Gravy (Main Course)', price: 270 },
        ],
        relatedSlugs: ['paneer-butter-masala', 'masala-dosa', 'himachali-special', 'brownies'],
    },
    {
        id: 7533,
        name: 'Paneer Butter Masala',
        category: 'NORTH INDIAN',
        categorySlug: 'north-indian',
        slug: 'paneer-butter-masala',
        badge: 'NORTH INDIAN',
        tagline: 'Velvety Tomato Cream Gravy',
        description: 'Soft cottage cheese simmered in a velvety rich tomato, butter, and cashew gravy, subtly spiced with aromatic herbs.',
        fullDescription: 'Our kitchen signature curry: fresh malai paneer cubes slow-simmered in rich tomato gravy enriched with fresh churned butter, cashew paste, and fragrant kasuri methi.',
        ingredients: 'Fresh paneer, ripe tomatoes, dairy butter, fresh cream, cashews, kasuri methi, and whole garam masala.',
        allergens: 'Contains Dairy and Tree Nuts.',
        storage: 'Reheat before serving.',
        image: '/uploads/2026/09/panner.png',
        gallery: ['/uploads/2026/09/panner.png'],
        price: 165,
        originalPrice: 185,
        rating: 4.9,
        ratingCount: 42,
        inStock: true,
        diet: '100% Pure Vegetarian',
        variations: [
            { label: 'Half (Serves 1-2)', price: 165 },
            { label: 'Full (Serves 3-4)', price: 290 },
        ],
        relatedSlugs: ['himachali-special', 'chilli-paneer', 'masala-dosa', 'marwadi-ladoo'],
    },
    {
        id: 7530,
        name: 'Himachali Special',
        category: 'HIMACHALI SPECIAL',
        categorySlug: 'himachali-special',
        slug: 'himachali-special',
        badge: 'HIMACHALI SPECIAL',
        tagline: 'Authentic Mountain Feast',
        description: 'Discover the authentic taste of Himachal with our traditional special platter made using heritage mountain recipes and pure ghee.',
        fullDescription: 'An authentic royal Pahadi Dhaam platter featuring chickpea Madra cooked in slow-simmered yoghurt, Sepu Badi in spinach gravy, Mah ki Dal, Khatta, and steamed aromatic basmati rice.',
        ingredients: 'Kabuli chana, curd, urad dal badis, spinach, tamarind, mountain spices, and pure desi ghee.',
        allergens: 'Contains Dairy.',
        storage: 'Serve hot.',
        image: '/uploads/2026/08/Himachali-Special-1.png',
        gallery: ['/uploads/2026/08/Himachali-Special-1.png'],
        price: 1500,
        originalPrice: null,
        rating: 5.0,
        ratingCount: 50,
        inStock: true,
        diet: '100% Pure Vegetarian',
        variations: [],
        relatedSlugs: ['paneer-butter-masala', 'marwadi-ladoo', 'office-tea-combo', 'engagement-combo'],
    },
    {
        id: 622,
        name: 'Marwadi Ladoo',
        category: 'SWEETS',
        categorySlug: 'sweets',
        slug: 'marwadi-ladoo',
        badge: 'SWEETS',
        tagline: 'Pure Desi Ghee Richness',
        description: 'Traditional Rajasthani Marwadi Ladoo prepared with pure desi ghee and premium ingredients, offering an authentic rich taste.',
        fullDescription: 'Coarsely ground gram flour roasted patiently in pure churned desi ghee until fragrant golden brown, infused with saffron, cardamom, and toasted nuts.',
        ingredients: 'Coarse besan, pure desi ghee, sugar bura, green cardamom, almond slivers, and pistachios.',
        allergens: 'Contains Dairy and Tree Nuts.',
        storage: 'Store at room temperature in a dry container. Shelf life 30 days.',
        image: '/uploads/2026/07/Marwadi-ladoo.avif',
        gallery: ['/uploads/2026/07/Marwadi-ladoo.avif'],
        price: 120,
        originalPrice: null,
        rating: 5.0,
        ratingCount: 24,
        inStock: true,
        diet: '100% Pure Vegetarian',
        variations: [
            { label: '250g Box', price: 120 },
            { label: '500g Box', price: 240 },
            { label: '1kg Royal Box', price: 480 },
        ],
        relatedSlugs: ['office-tea-combo', 'brownies', 'engagement-combo', 'cakes'],
    },
    {
        id: 322,
        name: 'Brownies',
        category: 'BAKERY',
        categorySlug: 'bakery',
        slug: 'brownies',
        badge: 'BAKERY',
        tagline: 'Fudgy Dark Chocolate',
        description: 'Rich, moist, and fudgy brownies made with premium chocolate, freshly baked to deliver an irresistible treat for every chocolate lover.',
        fullDescription: 'Decadent chocolate brownies baked with dark Belgian cocoa and pure cream butter. Features a crackly top and ultra-fudgy center.',
        ingredients: 'Dark chocolate, unsalted butter, refined wheat flour, brown sugar, cocoa powder, and vanilla extract.',
        allergens: 'Contains Dairy and Gluten.',
        storage: 'Store in an airtight container or warm in a microwave for 15 seconds before eating.',
        image: '/uploads/2026/07/Brownies.jpg',
        gallery: ['/uploads/2026/07/Brownies.jpg'],
        price: 70,
        originalPrice: null,
        rating: 4.8,
        ratingCount: 18,
        inStock: true,
        diet: '100% Pure Vegetarian',
        variations: [
            { label: '1 Piece', price: 70 },
            { label: 'Box of 2 Pieces', price: 140 },
            { label: 'Box of 4 Pieces', price: 280 },
        ],
        relatedSlugs: ['cakes', 'office-tea-combo', 'birthday-party-combo', 'marwadi-ladoo'],
    },
    {
        id: 321,
        name: 'Cakes',
        category: 'BAKERY',
        categorySlug: 'bakery',
        slug: 'cakes',
        badge: 'BAKERY',
        tagline: 'Freshly Baked Celebration Cakes',
        description: 'Freshly baked cakes crafted with premium ingredients, offering a soft texture, rich flavor, and perfect sweetness for every celebration.',
        fullDescription: 'Eggless artisan cakes handcrafted fresh to order using finest dairy cream and sponge. Choose from Pineapple, Black Forest, Red Velvet, or Belgian Truffle.',
        ingredients: 'Refined flour, dairy cream, dark chocolate, fruit extracts, pure butter, and sugar.',
        allergens: 'Contains Dairy and Gluten.',
        storage: 'Keep refrigerated at 4°C.',
        image: '/uploads/2026/07/Cakes.jpg',
        gallery: ['/uploads/2026/07/Cakes.jpg'],
        price: 450,
        originalPrice: 499,
        rating: 4.9,
        ratingCount: 38,
        inStock: true,
        diet: '100% Pure Vegetarian',
        variations: [
            { label: '500g (Serves 4-6)', price: 450 },
            { label: '1kg (Serves 8-12)', price: 850 },
        ],
        relatedSlugs: ['brownies', 'birthday-party-combo', 'office-tea-combo', 'engagement-combo'],
    },
];

/**
 * Helper to find a product by slug or id (case-insensitive)
 */
export function findProductBySlug(slugOrId) {
    if (!slugOrId) return allProducts[0];

    const normalized = String(slugOrId).toLowerCase().trim().replace(/^\/+|\/+$/g, '');

    // Match by slug
    const bySlug = allProducts.find(
        (p) => p.slug.toLowerCase() === normalized || p.slug.toLowerCase().replace(/-/g, '') === normalized.replace(/-/g, '')
    );
    if (bySlug) return bySlug;

    // Match by id
    const byId = allProducts.find((p) => String(p.id) === normalized);
    if (byId) return byId;

    // Match by name
    const byName = allProducts.find(
        (p) => p.name.toLowerCase() === normalized.replace(/-/g, ' ')
    );
    if (byName) return byName;

    // Default fallback to first product (Office Tea Combo)
    return allProducts[0];
}

/**
 * Get related products for a given product
 */
export function getRelatedProducts(product, limit = 4) {
    if (!product) return allProducts.slice(1, 5);

    if (product.relatedSlugs && product.relatedSlugs.length > 0) {
        const matches = product.relatedSlugs
            .map((s) => allProducts.find((p) => p.slug === s))
            .filter(Boolean);

        if (matches.length >= limit) return matches.slice(0, limit);

        // Fill up to limit with other items from the same category or all products
        const remaining = allProducts.filter(
            (p) => p.id !== product.id && !matches.some((m) => m.id === p.id)
        );
        return [...matches, ...remaining].slice(0, limit);
    }

    // Default to same category or other products
    return allProducts.filter((p) => p.id !== product.id).slice(0, limit);
}
