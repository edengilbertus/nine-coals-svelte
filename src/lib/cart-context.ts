import { createContext } from 'svelte';
import type { Cart } from './cart.svelte';
export const [getCart, setCart] = createContext<Cart>();
