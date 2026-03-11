import { screen } from '@testing-library/react';
import ResultsTable from './ResultsTable';
import { renderWithProviders } from '../../test/renderWithProviders';

describe('ResultsTable', () => {
  test('renders headers and rows', () => {
    renderWithProviders(
      <ResultsTable
        rows={[
          { full_name: 'Alice Ndlovu', average_score: 78.5 },
          { full_name: 'Brian Moyo', average_score: 74.2 },
        ]}
      />
);

    expect(screen.getByText('full_name')).toBeInTheDocument();
    expect(screen.getByText('average_score')).toBeInTheDocument();
    expect(screen.getByText('Alice Ndlovu')).toBeInTheDocument();
    expect(screen.getByText('Brian Moyo')).toBeInTheDocument();
  });
});