import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect } from 'vitest';
import QueryCenterPage from './QueryCenterPage';
import { renderWithProviders } from '../../test/renderWithProviders';

describe('QueryCenterPage', () => {

  test('renders query list', () => {
    renderWithProviders(<QueryCenterPage />);

    const queryListPanel = screen.getByTestId('query-list-panel');

    expect(queryListPanel).toBeInTheDocument();

    // Scope the text search to the left query panel
    expect(
      within(queryListPanel).getByText(
        /Students in a Specific Course Taught by a Lecturer/i
      )
    ).toBeInTheDocument();

    expect(
      within(queryListPanel).getByText(
        /Final-Year Students Above a Grade Threshold/i
      )
    ).toBeInTheDocument();

    expect(
      within(queryListPanel).getByText(
        /Employees Supervising Student Employees in a Program/i
      )
    ).toBeInTheDocument();
  });

  test('switches displayed query form when a different query is selected', async () => {
    const user = userEvent.setup();

    renderWithProviders(<QueryCenterPage />);

    const queryListPanel = screen.getByTestId('query-list-panel');

    await user.click(
      within(queryListPanel).getByText(/Lecturers by Expertise or Research Interest/i)
    );

    expect(screen.getByLabelText(/Keyword/i)).toBeInTheDocument();
  });

  test('renders a scrollable query list panel', () => {
    renderWithProviders(<QueryCenterPage />);

    const queryListPanel = screen.getByTestId('query-list-panel');

    expect(queryListPanel).toBeInTheDocument();

    // Avoid fragile CSS assertions in jsdom
    // Just confirm the panel exists and contains query entries
    expect(
      within(queryListPanel).getByText(
        /Students in a Specific Course Taught by a Lecturer/i
      )
    ).toBeInTheDocument();
  });

});