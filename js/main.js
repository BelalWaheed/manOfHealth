import { AppState } from './state/AppState.js';
import { renderView } from './views/router.js';

document.addEventListener('DOMContentLoaded', () => {

    AppState.load();


    if (AppState.currentUser) {
        renderView(AppState.currentUser.role);
    } else {
        renderView('Auth');
    }
});
