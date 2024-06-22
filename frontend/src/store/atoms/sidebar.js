// In a file within your store/atoms directory, e.g., sidebarState.js
import { atom } from 'recoil';

export const sidebarState = atom({
  key: 'sidebarState', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});