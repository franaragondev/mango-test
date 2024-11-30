import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Range from './Range';

// Test 1: Verifies that the component renders correctly with the default values
test('renders range component with default values', () => {
  render(<Range min={0} max={100} />);

  // Verifies that the initial values of the sliders are in the DOM
  expect(screen.getByText('0,00 €')).toBeInTheDocument();
  expect(screen.getByText('100,00 €')).toBeInTheDocument();
});

// Test 2: Verifies that the values update when the sliders are moved
test('updates range values when handles are moved', async () => {
  render(<Range min={0} max={100} />);

  const leftHandle = screen.getByTestId('left-handle');
  const rightHandle = screen.getByTestId('right-handle');

  // Simulates the mouseDown event on the left handle
  fireEvent.mouseDown(leftHandle);
  act(() => {
    fireEvent.mouseMove(document, { clientX: 295 }); // Simulates the mouse movement
  });
  fireEvent.mouseUp(document); // Ends the movement

  // Waits for the label value to update
  await screen.findByText('90,00 €');
  expect(screen.getByText('90,00 €')).toBeInTheDocument();

  // Simulates moving the right handle
  fireEvent.mouseDown(rightHandle);
  act(() => {
    fireEvent.mouseMove(document, { clientX: 795 });
  });
  fireEvent.mouseUp(document); // Ends the movement

  await screen.findByText('90,00 €');
  expect(screen.getByText('90,00 €')).toBeInTheDocument();
});

// Test 3: Verifies the behavior when the left input value is changed
test('updates left value correctly when input field is used', async () => {
  render(<Range min={0} max={100} />);

  // Clicks on the left value label to edit it
  fireEvent.click(screen.getByText('0,00 €'));

  const leftInput = screen.getByDisplayValue('0'); // Gets the input field
  fireEvent.change(leftInput, { target: { value: '30' } }); // Changes the value
  fireEvent.blur(leftInput); // Blurs the input to update the value

  // Verifies that the changed value is updated correctly
  await screen.findByText('30,00 €');
  expect(screen.getByText('30,00 €')).toBeInTheDocument();
});

// Test 4: Verifies the behavior of the right input value
test('updates right value correctly when input field is used', async () => {
  render(<Range min={0} max={100} />);

  // Clicks on the right value label to edit it
  fireEvent.click(screen.getByText('100,00 €'));

  const rightInput = screen.getByDisplayValue('100'); // Gets the input field
  fireEvent.change(rightInput, { target: { value: '80' } }); // Changes the value
  fireEvent.blur(rightInput); // Blurs the input to update the value

  // Verifies that the changed value is updated correctly
  await screen.findByText('80,00 €');
  expect(screen.getByText('80,00 €')).toBeInTheDocument();
});

// Test 5: Verifies the behavior when clicking on the labels to edit
test('allows editing of values when labels are clicked', async () => {
  render(<Range min={0} max={100} />);

  const leftLabel = screen.getByText('0,00 €');
  const rightLabel = screen.getByText('100,00 €');

  // Clicks on the left label to edit
  fireEvent.click(leftLabel);
  expect(screen.getByDisplayValue('0')).toBeInTheDocument();

  // Clicks on the right label to edit
  fireEvent.click(rightLabel);
  expect(screen.getByDisplayValue('100')).toBeInTheDocument();
});
