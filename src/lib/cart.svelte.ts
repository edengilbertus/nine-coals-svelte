import { cartTotal, parseCart, updateCart, CART_STORAGE_KEY, type CartLine } from './cart';
import { dishes } from './data/menu';

export class Cart {
  lines = $state.raw<CartLine[]>([]);
  ready = $state(false);
  storageError = $state('');
  notice = $state('');
  private storage?: Storage;
  get total() { return cartTotal(this.lines); }
  get count() { return this.lines.reduce((sum, line) => sum + line.quantity, 0); }
  restore(storage?: Storage) {
    try {
      this.storage = storage ?? window.localStorage;
      this.lines = parseCart(this.storage.getItem(CART_STORAGE_KEY));
    } catch { this.storageError = 'Your basket works for this visit, but cannot be saved on this device.'; }
    this.ready = true;
  }
  private persist() {
    try { this.storage?.setItem(CART_STORAGE_KEY, JSON.stringify(this.lines)); }
    catch { this.storageError = 'Your basket works for this visit, but cannot be saved on this device.'; }
  }
  add(dishId: string) {
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return;
    const quantity = this.lines.find(line => line.dishId === dishId)?.quantity ?? 0;
    this.setQuantity(dishId, quantity + 1);
    this.notice = `${dish.name} added to your order.`;
  }
  setQuantity(dishId: string, quantity: number) { this.lines = updateCart(this.lines, dishId, quantity); this.persist(); }
  remove(dishId: string) { this.setQuantity(dishId, 0); }
  clear() { this.lines = []; this.notice = ''; this.persist(); }
}
