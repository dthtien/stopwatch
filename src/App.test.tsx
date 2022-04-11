import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';

test('renders correctly', () => {
  const { queryByText, getByText, getByTestId } = render(<App />);
  expect(getByText('Stopwatch')).toBeVisible();
  expect(getByText('Initial')).toBeVisible();
  expect(getByText('00:00:00:000')).toBeVisible();
  expect(getByText('Start')).toBeVisible();

  // Running...
  fireEvent.click(getByText('Start'));
  expect(queryByText('00:00:00:000')).not.toBeInTheDocument();
  expect(queryByText('Start')).not.toBeInTheDocument();
  expect(getByText('Running...')).toBeVisible();
  expect(getByText('Stop')).toBeVisible();
  expect(getByText('Lap')).toBeVisible();

  // Lap
  fireEvent.click(getByText('Lap'));
  expect(getByTestId('laps')).toBeVisible();
  expect(queryByText('Laps:')).toBeInTheDocument();
  expect(getByTestId('lap-1')).toBeVisible();
  fireEvent.click(getByText('Lap'));
  expect(getByTestId('lap-2')).toBeVisible();
  fireEvent.click(getByText('Stop'));

  expect(queryByText('Running...')).not.toBeInTheDocument();
  expect(getByText('Stopped')).toBeVisible();
  expect(getByText('Resume')).toBeVisible();
  expect(getByText('Reset')).toBeVisible();

  fireEvent.click(getByText('Resume'));
  expect(getByText('Running...')).toBeVisible();
  expect(queryByText('Resume')).not.toBeInTheDocument();
  expect(queryByText('Reset')).not.toBeInTheDocument();

  fireEvent.click(getByText('Stop'));
  fireEvent.click(getByText('Reset'));
  expect(getByText('Stopwatch')).toBeVisible();
  expect(getByText('Initial')).toBeVisible();
  expect(getByText('00:00:00:000')).toBeVisible();
  expect(getByText('Start')).toBeVisible();
});
