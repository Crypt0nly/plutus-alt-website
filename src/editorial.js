import './editorial.css';
import { initReveals } from './fx.js';
import { mountSwitcher } from './switcher.js';

mountSwitcher('editorial');
initReveals();

document.getElementById('year').textContent = String(new Date().getFullYear());
