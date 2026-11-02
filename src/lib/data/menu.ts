export type Bed = { id: string; name: string; temperature: string; description: string; color: string; ink: string };
export type Dish = { id: string; name: string; bedId: string; price: number; description: string; image?: string; signature?: boolean };
export const beds: Bed[] = [
  { id: 'roar', name: 'Roar', temperature: 'about 450°C', description: 'Right under the fire basket. Big cuts, seared hard.', color: '#ff4d1a', ink: '#2b0e09' },
  { id: 'sear', name: 'Sear', temperature: '400°C', description: 'Just off the basket. Chops and the côte, fat rendered crisp.', color: '#ec4f24', ink: '#140603' },
  { id: 'blaze', name: 'Blaze', temperature: '350°C', description: 'Steady heat for birds that need time.', color: '#ffb347', ink: '#2b0e09' },
  { id: 'glow', name: 'Glow', temperature: '300°C', description: 'Gentle enough for fish, cooked in iron cages.', color: '#8fa6bd', ink: '#0d0c0b' },
  { id: 'smoulder', name: 'Smoulder', temperature: '250°C', description: 'More smoke than flame. Boerewors hung high, then finished in iron.', color: '#2b0e09', ink: '#ece9e4' },
  { id: 'hearth', name: 'Hearth', temperature: '220°C', description: 'Bread on the grid, flatbread on the stone.', color: '#d9c3a5', ink: '#2b0e09' },
  { id: 'ember', name: 'Ember', temperature: '180°C', description: 'Vegetables right on the coals until they blacken and soften.', color: '#3d4a33', ink: '#ece9e4' },
  { id: 'ash', name: 'Ash', temperature: '140°C', description: 'Potatoes and squash buried at three, dug out at service.', color: '#9a948c', ink: '#141110' },
  { id: 'last-light', name: 'Last light', temperature: '100°C', description: "The fire's last heat, for fruit and the chocolate tart.", color: '#181513', ink: '#ffb347' }
];
export const dishes: Dish[] = [
  { id: 'tomahawk', name: 'Tomahawk', bedId: 'roar', price: 890, description: '1.2kg for two, thirty days on the bone. Charred on Roar, rested in iron with rosemary and fire-cut chips.', image: '/cutouts/tomahawk-skillet.webp', signature: true },
  { id: 'picanha', name: 'Picanha', bedId: 'roar', price: 285, description: 'Fat cap rendered over the hottest coals, pickled chilli.' },
  { id: 'lamb-chops', name: 'Lamb chops', bedId: 'sear', price: 265, description: 'Karoo lamb chops seared hard on Sear, fat rendered crisp, burnt lemon.', image: '/cutouts/lamb-chops.webp', signature: true },
  { id: 'rack-of-lamb', name: 'Rack of lamb', bedId: 'sear', price: 395, description: 'A whole rack, rosemary and salt, carved at the table. Best with a glass of Swartland red.', image: '/cutouts/lamb-rack.webp', signature: true },
  { id: 'rib-eye', name: 'Rib-eye', bedId: 'sear', price: 395, description: '400g, sliced off the bone, bone-marrow butter.' },
  { id: 'fire-chicken', name: 'Fire chicken', bedId: 'blaze', price: 245, description: 'A whole bird turning on the spit over Blaze, basted every four minutes until the skin cracks.', image: '/cutouts/chicken-grill.webp', signature: true },
  { id: 'line-fish', name: 'Line fish', bedId: 'glow', price: 265, description: "Today's catch rubbed with chilli and spice, cooked in an iron cage, finished with lime.", image: '/cutouts/spiced-fish.webp', signature: true },
  { id: 'trout', name: 'Trout', bedId: 'glow', price: 245, description: 'Fillet seared skin-down, warm greens.' },
  { id: 'boerewors', name: 'Boerewors', bedId: 'smoulder', price: 145, description: 'Our own coil, hung in the smoke, then finished in iron. Tomato smoor.', image: '/cutouts/sausage-pan.webp', signature: true },
  { id: 'fire-bread', name: 'Fire bread', bedId: 'hearth', price: 55, description: 'Roosterkoek dough baked on the grid until the crust blisters. Whipped fat and salt.', image: '/cutouts/bread.webp', signature: true },
  { id: 'flatbread', name: 'Flatbread', bedId: 'hearth', price: 65, description: "Blistered, toum and za’atar." },
  { id: 'peppers', name: 'Peppers', bedId: 'ember', price: 95, description: 'Whole peppers blackened on the coals, peeled and dressed warm with olive oil.', image: '/cutouts/peppers-roasted.webp', signature: true },
  { id: 'mielies', name: 'Mielies', bedId: 'ember', price: 75, description: 'Corn straight on the coals until it chars, smoked butter and chilli salt.', image: '/cutouts/corn-charred.webp', signature: true },
  { id: 'ash-potato', name: 'Ash potato', bedId: 'ash', price: 65, description: 'Buried in hot ash at three, split open at service with cultured butter.', image: '/cutouts/potato.webp', signature: true },
  { id: 'butternut', name: 'Butternut', bedId: 'ash', price: 85, description: 'Brown butter and sage.' },
  { id: 'coal-baked-pineapple', name: 'Coal-baked pineapple', bedId: 'last-light', price: 95, description: 'Rum caramel, coconut ice cream.' },
  { id: 'chocolate-tart', name: 'Chocolate tart', bedId: 'last-light', price: 105, description: 'Dark chocolate set over the dying coals until it takes the smoke. Sea salt, crème fraîche.', image: '/cutouts/chocolate-tart.webp', signature: true }
];
export const signatures = dishes.filter(dish => dish.signature);
export const formatPrice = (value: number): string => `R ${value.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}`;
