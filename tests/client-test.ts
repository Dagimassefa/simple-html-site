import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';

describe('Client-side search functionality', () => {
    let searchInput: HTMLInputElement;
    let results: HTMLUListElement;

    beforeEach(() => {
        document.body.innerHTML = `
            <input id="search-input" type="text" />
            <ul id="results"></ul>
        `;
        require('../script');
        searchInput = document.getElementById('search-input') as HTMLInputElement;
        results = document.getElementById('results') as HTMLUListElement;
    });

    it('Should call fetch when typing in search input', async () => {
        global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) })) as jest.Mock;
        fireEvent.keyUp(searchInput, { target: { value: 'Test' } });
        expect(global.fetch).toHaveBeenCalled();
    });
});