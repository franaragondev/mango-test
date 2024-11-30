'use client';

import { useState, useRef, useLayoutEffect, useMemo } from 'react';
import styled from 'styled-components';

// Define the props for the Range component
interface RangeProps {
  min: number; // Minimum value for the range
  max: number; // Maximum value for the range
  values?: number[]; // Optional array of fixed values for snapping handles
}

// Styled components for styling the range slider
const RangeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 1px;
  background: #b7b7b7;
  margin: 20px 0;
  top: 3rem;
`;

const RangeBar = styled.div<{ left: number; width: number }>`
  position: absolute;
  left: ${({ left }) => `${left}%`};
  width: ${({ width }) => `${width}%`};
  height: 1px;
  background: black;
`;

const Handle = styled.div<{ position: number }>`
  position: absolute;
  left: ${({ position }) => `${position}%`};
  top: -0.2rem;
  width: 0.5rem;
  height: 0.5rem;
  background: black;
  border-radius: 50%;
  cursor: pointer;
  transform: scale(1.2);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.5); // Enlarge the handle when hovered
  }
`;

const ValueLabel = styled.span<{ position: number }>`
  position: absolute;
  left: ${({ position }) => `${position}%`};
  top: -1.5rem;
  font-size: 0.8rem;
  color: black;
  transform: translateX(-50%);
  user-select: none;
  cursor: pointer;
`;

const FixedValueLabel = styled.span<{ position: number }>`
  position: absolute;
  width: 5rem;
  left: ${({ position }) => `${position}%`};
  bottom: -20px;
  font-size: 0.8rem;
  color: black;
  user-select: none;
`;

// Main Range component
const Range = ({ min, max, values }: RangeProps) => {
  const rangeRef = useRef<HTMLDivElement>(null); // Reference to the range container

  // State to track handle positions and input values
  const [leftHandle, setLeftHandle] = useState(min); // Left handle position
  const [rightHandle, setRightHandle] = useState(max); // Right handle position
  const [leftValue, setLeftValue] = useState(min); // Editable left value
  const [rightValue, setRightValue] = useState(max); // Editable right value
  const [isEditing, setIsEditing] = useState<'left' | 'right' | null>(null); // Tracks which value is being edited
  const [isReady, setIsReady] = useState(false); // Ensures the component is rendered properly

  // Helper function to calculate the percentage position for a value
  const getPercentage = (value: number) => ((value - min) / (max - min)) * 100;

  // Calculate the percentages for the handles
  const leftPercentage = useMemo(() => getPercentage(leftHandle), [leftHandle]);
  const rightPercentage = useMemo(
    () => getPercentage(rightHandle),
    [rightHandle]
  );

  // Format numbers as currency (EUR)
  const formatNumber = (value: number) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.round(value));

  // Find the closest valid value from the array of fixed values
  const getClosestValue = (
    value: number,
    oppositeValue: number,
    isLeftHandle: boolean
  ) => {
    if (!values) return value;

    // Filter valid values based on the position of the opposite handle
    const validValues = isLeftHandle
      ? values.filter((v) => v < oppositeValue)
      : values.filter((v) => v > oppositeValue);

    // Return the closest valid value
    return validValues.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  };

  // Handle mouse down for dragging the handles
  const handleMouseDown = (handle: 'left' | 'right') => {
    return (e: React.MouseEvent) => {
      const startX = e.clientX; // Initial mouse position
      const startLeft = leftHandle; // Starting value of the left handle
      const startRight = rightHandle; // Starting value of the right handle
      const minDelta = values ? 0.1 : 10; // Minimum distance between handles

      // Handle mouse movement
      const onMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX; // Difference in mouse position
        const rangeWidth = rangeRef.current?.offsetWidth || 100; // Width of the range container
        const deltaValue = (deltaX / rangeWidth) * (max - min); // Convert mouse movement to range value

        if (handle === 'left') {
          // Update left handle position
          let newLeft = Math.min(
            Math.max(startLeft + deltaValue, min),
            rightHandle - minDelta
          );
          newLeft = Math.round(newLeft); // Round the new left position
          newLeft = getClosestValue(newLeft, rightHandle, true);
          setLeftHandle(newLeft);
          setLeftValue(newLeft);
        } else {
          // Update right handle position
          let newRight = Math.max(
            Math.min(startRight + deltaValue, max),
            leftHandle + minDelta
          );
          newRight = Math.round(newRight); // Round the new right position
          newRight = getClosestValue(newRight, leftHandle, false);
          setRightHandle(newRight);
          setRightValue(newRight);
        }
      };

      // Remove event listeners when dragging ends
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };
  };

  // Enable editing mode when a label is clicked
  const handleLabelClick = (handle: 'left' | 'right') => {
    setIsEditing(handle);
  };

  // Update input value on change
  const handleValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    handle: 'left' | 'right'
  ) => {
    const value = parseFloat(e.target.value);

    // Round the value before updating the state
    const roundedValue = Math.round(value);

    if (handle === 'left') {
      setLeftValue(roundedValue);
    } else {
      setRightValue(roundedValue);
    }
  };

  // Validate and update values when input loses focus
  const handleValueBlur = (handle: 'left' | 'right') => {
    let correctedValue = handle === 'left' ? leftValue : rightValue;

    // Round the value before updating the state
    correctedValue = Math.round(correctedValue);

    if (handle === 'left') {
      correctedValue = Math.min(
        Math.max(correctedValue, min),
        rightHandle - 10
      );
      correctedValue = getClosestValue(correctedValue, rightHandle, true);
      setLeftHandle(correctedValue);
      setLeftValue(correctedValue);
    } else {
      correctedValue = Math.max(Math.min(correctedValue, max), leftHandle + 10);
      correctedValue = getClosestValue(correctedValue, leftHandle, false);
      setRightHandle(correctedValue);
      setRightValue(correctedValue);
    }

    setIsEditing(null); // Exit editing mode
  };

  // Ensure component renders only when ready
  useLayoutEffect(() => {
    setIsReady(true);
  }, []);

  // Render the component
  if (!isReady) {
    return <RangeContainer ref={rangeRef} />;
  }

  return (
    <RangeContainer ref={rangeRef}>
      {/* Editable input fields */}
      {!values && (
        <>
          {isEditing === 'left' ? (
            <input
              type="number"
              value={leftValue}
              onChange={(e) => handleValueChange(e, 'left')}
              onBlur={() => handleValueBlur('left')}
              style={{
                position: 'absolute',
                left: `${leftPercentage}%`,
                top: '-1.5rem',
                fontSize: '0.8rem',
              }}
            />
          ) : (
            <ValueLabel
              position={leftPercentage}
              onClick={() => handleLabelClick('left')}
            >
              {formatNumber(leftHandle)}
            </ValueLabel>
          )}

          {isEditing === 'right' ? (
            <input
              type="number"
              value={rightValue}
              onChange={(e) => handleValueChange(e, 'right')}
              onBlur={() => handleValueBlur('right')}
              style={{
                position: 'absolute',
                left: `${rightPercentage}%`,
                top: '-1.5rem',
                fontSize: '0.8rem',
              }}
            />
          ) : (
            <ValueLabel
              position={rightPercentage}
              onClick={() => handleLabelClick('right')}
            >
              {formatNumber(rightHandle)}
            </ValueLabel>
          )}
        </>
      )}

      {/* Range bar between handles */}
      <RangeBar
        left={leftPercentage}
        width={rightPercentage - leftPercentage}
      />

      {/* Range handles */}
      <Handle
        position={leftPercentage}
        onMouseDown={handleMouseDown('left')}
        data-testid="left-handle"
      />
      <Handle
        data-testid="right-handle"
        position={rightPercentage}
        onMouseDown={handleMouseDown('right')}
      />

      {/* Display fixed value labels if any */}
      {values?.map((value, index) => (
        <FixedValueLabel key={index} position={getPercentage(value)}>
          {value}
        </FixedValueLabel>
      ))}
    </RangeContainer>
  );
};

export default Range;
