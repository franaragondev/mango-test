import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Range from './Range';

// Test 1: Renders the component with default values
test('renders range component with default values', () => {
  render(<Range min={0} max={100} />);

  expect(screen.getByText('0,00 €')).toBeInTheDocument();
  expect(screen.getByText('100,00 €')).toBeInTheDocument();
});

// Test 2: Verifies that range values update when handles are moved
test('updates range values when handles are moved', () => {
  render(<Range min={0} max={100} />);

  const leftHandle = screen.getByTestId('left-handle');
  const rightHandle = screen.getByTestId('right-handle');

  // Simulate mouse movement on the left handle
  fireEvent.mouseDown(leftHandle, { clientX: 100 });
  act(() => {
    fireEvent.mouseMove(document, { clientX: 295 });
  });
  fireEvent.mouseUp(document);

  expect(screen.getByText('90,00 €')).toBeInTheDocument(); // Left handle value should update

  // Simulate mouse movement on the right handle
  fireEvent.mouseDown(rightHandle, { clientX: 200 });
  act(() => {
    fireEvent.mouseMove(document, { clientX: 295 });
  });
  fireEvent.mouseUp(document);

  expect(screen.getByText('90,00 €')).toBeInTheDocument(); // Right handle value should update
});

// Test 3: Verifies input field update behavior
test('updates values correctly when input field is used', () => {
  render(<Range min={0} max={100} />);

  fireEvent.click(screen.getByText('0,00 €'));

  const leftInput = screen.getByDisplayValue('0');
  fireEvent.change(leftInput, { target: { value: '30' } });
  fireEvent.blur(leftInput);

  expect(screen.getByText('30,00 €')).toBeInTheDocument(); // Check updated left value
});

// Test 4: Verifies correct behavior for the right value input
test('updates right value correctly when input field is used', () => {
  render(<Range min={0} max={100} />);

  fireEvent.click(screen.getByText('100,00 €'));

  const rightInput = screen.getByDisplayValue('100');
  fireEvent.change(rightInput, { target: { value: '75' } });
  fireEvent.blur(rightInput);

  expect(screen.getByText('75,00 €')).toBeInTheDocument(); // Check updated right value
});

// Test 5: Verifies that left value cannot exceed right value
test('left value cannot exceed right value', () => {
  render(<Range min={0} max={100} />);

  // Try to move the left handle beyond the right handle
  fireEvent.mouseDown(screen.getByTestId('left-handle'), { clientX: 100 });
  act(() => {
    fireEvent.mouseMove(document, { clientX: 120 });
  });
  fireEvent.mouseUp(document);

  expect(screen.getByText('20,00 €')).toBeInTheDocument(); // Left value should not exceed right value
});

// Test 6: Verifies that fixed values are displayed correctly
test('displays fixed values correctly', () => {
  const fixedValues = [10, 50, 75];
  render(<Range min={0} max={100} values={fixedValues} />);

  expect(screen.getByText('10,00 €')).toBeInTheDocument();
  expect(screen.getByText('50,00 €')).toBeInTheDocument();
  expect(screen.getByText('75,00 €')).toBeInTheDocument();
});

// Test 7: Verifies interaction with left value label
test('can interact with the left value label and change it', () => {
  render(<Range min={0} max={100} />);

  // Click on the left value label to edit
  fireEvent.click(screen.getByText('0,00 €'));

  const leftInput = screen.getByDisplayValue('0');
  fireEvent.change(leftInput, { target: { value: '40' } });
  fireEvent.blur(leftInput);

  expect(screen.getByText('40,00 €')).toBeInTheDocument(); // Verify updated left value
});

// Test 8: Verifies interaction with right value label
test('can interact with the right value label and change it', () => {
  render(<Range min={0} max={100} />);

  // Click on the right value label to edit
  fireEvent.click(screen.getByText('100,00 €'));

  const rightInput = screen.getByDisplayValue('100');
  fireEvent.change(rightInput, { target: { value: '60' } });
  fireEvent.blur(rightInput);

  expect(screen.getByText('60,00 €')).toBeInTheDocument(); // Verify updated right value
});

// Test 9: Verifies cursor change on hover over handle
test('cursor changes to indicate dragging when hovering over handle', () => {
  render(<Range min={0} max={100} />);

  const leftHandle = screen.getByTestId('left-handle');
  const rightHandle = screen.getByTestId('right-handle');

  // Hover over the left handle and check the cursor style
  fireEvent.mouseOver(leftHandle);
  expect(leftHandle).toHaveStyle('cursor: pointer');

  // Hover over the right handle and check the cursor style
  fireEvent.mouseOver(rightHandle);
  expect(rightHandle).toHaveStyle('cursor: pointer');
});

// Test 10: Verifies correct cursor behavior when dragging
test('cursor changes to indicate dragging when dragging a handle', () => {
  render(<Range min={0} max={100} />);

  const leftHandle = screen.getByTestId('left-handle');
  const rightHandle = screen.getByTestId('right-handle');

  // Simulate mouse down and mouse move to check cursor style during dragging on left handle
  fireEvent.mouseDown(leftHandle, { clientX: 100 });
  act(() => {
    fireEvent.mouseMove(document, { clientX: 150 });
  });
  expect(document.body.style.cursor).toBe('grabbing'); // Check cursor style during dragging of left handle
  fireEvent.mouseUp(document);

  // Simulate mouse down and mouse move to check cursor style during dragging on right handle
  fireEvent.mouseDown(rightHandle, { clientX: 200 });
  act(() => {
    fireEvent.mouseMove(document, { clientX: 250 });
  });
  expect(document.body.style.cursor).toBe('grabbing'); // Check cursor style during dragging of right handle
  fireEvent.mouseUp(document);
});
