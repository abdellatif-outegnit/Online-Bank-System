

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { apiFetch } from '../../utils/functions/ApiFunction';
import Transaction from './Transaction';

vi.mock('../../utils/functions/ApiFunction', () => ({
    apiFetch: vi.fn(),
}));

vi.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: () => null,
}));

describe('transaction component', () => {

    beforeEach(() => {
        vi.mocked(apiFetch).mockResolvedValue({
            ok: true,
            json: async () => ({
                pagesNumber: 3,
                transactions: [],
                totalCount: 0,
                totalIncome: 0,
                totalExpense: 0,
            }),
        });
    });

    test('goes correctly to the next page when clicking on the next button', async () => {
        render(<Transaction />);

        const nextButton = screen.getByTestId('next-button');
        await waitFor(() => expect(nextButton).toBeEnabled());

        fireEvent.click(nextButton);

        const pageIndicator = screen.getByTestId('page-indicator');
        expect(pageIndicator).toHaveTextContent('2');
    });

    test('goes correctly to the previous page when clicking on the previous button', async () => {
        render(<Transaction />);

        const nextButton = screen.getByTestId('next-button');
        await waitFor(() => expect(nextButton).toBeEnabled());

        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(screen.getByTestId('page-indicator')).toHaveTextContent('2');
        });

        const previousButton = screen.getByTestId('previous-button');
        
        await waitFor(() => expect(previousButton).toBeEnabled());

        fireEvent.click(previousButton);

        await waitFor(() => {
            expect(screen.getByTestId('page-indicator')).toHaveTextContent('1');
        });
    });
});