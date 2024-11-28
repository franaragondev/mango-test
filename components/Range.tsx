'use client';

import { useState, useRef, useLayoutEffect, useMemo } from 'react';
import styled from 'styled-components';

interface RangeProps {
  min: number;
  max: number;
  values?: number[]; // Optional prop for fixed values range
}

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
    transform: scale(1.5);
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
  left: ${({ position }) => `${position}%`};
  bottom: -20px;
  font-size: 0.8rem;
  color: black;
  user-select: none;
`;

const Range = ({ min, max, values }: RangeProps) => {
  const rangeRef = useRef<HTMLDivElement>(null);

  const [leftHandle, setLeftHandle] = useState(min);
  const [rightHandle, setRightHandle] = useState(max);
  const [leftValue, setLeftValue] = useState(min);
  const [rightValue, setRightValue] = useState(max);
  const [isEditing, setIsEditing] = useState<'left' | 'right' | null>(null); // To manage which value is being edited
  const [isReady, setIsReady] = useState(false);

  const getPercentage = (value: number) => ((value - min) / (max - min)) * 100;

  const leftPercentage = useMemo(() => getPercentage(leftHandle), [leftHandle]);
  const rightPercentage = useMemo(
    () => getPercentage(rightHandle),
    [rightHandle]
  );

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.round(value));

  const handleMouseDown = (handle: 'left' | 'right') => {
    return (e: React.MouseEvent) => {
      document.body.style.cursor = 'grabbing';

      const startX = e.clientX;
      const startLeft = leftHandle;
      const startRight = rightHandle;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const rangeWidth = rangeRef.current?.offsetWidth || 100;
        const deltaPercentage = (deltaX / rangeWidth) * (max - min);

        if (handle === 'left') {
          setLeftHandle(
            Math.min(
              Math.max(startLeft + deltaPercentage, min),
              rightHandle - 10
            )
          );
          setLeftValue(
            Math.round(
              Math.min(
                Math.max(startLeft + deltaPercentage, min),
                rightHandle - 10
              )
            )
          );
        } else {
          setRightHandle(
            Math.max(
              Math.min(startRight + deltaPercentage, max),
              leftHandle + 10
            )
          );
          setRightValue(
            Math.round(
              Math.max(
                Math.min(startRight + deltaPercentage, max),
                leftHandle + 10
              )
            )
          );
        }
      };

      const onMouseUp = () => {
        document.body.style.cursor = 'grab';

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };
  };

  const handleLabelClick = (handle: 'left' | 'right') => {
    setIsEditing(handle);
  };

  const handleValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    handle: 'left' | 'right'
  ) => {
    const value = parseFloat(e.target.value);
    if (handle === 'left') {
      setLeftValue(value);
    } else {
      setRightValue(value);
    }
  };

  const handleValueBlur = (handle: 'left' | 'right') => {
    if (handle === 'left') {
      const correctedLeft = Math.min(
        Math.max(leftValue, min),
        rightHandle - 10
      );
      setLeftHandle(correctedLeft);
      setLeftValue(correctedLeft);
    } else {
      const correctedRight = Math.max(
        Math.min(rightValue, max),
        leftHandle + 10
      );
      setRightHandle(correctedRight);
      setRightValue(correctedRight);
    }
    setIsEditing(null);
  };

  useLayoutEffect(() => {
    setIsReady(true); // Set to true once the component is ready to be displayed
  }, []);

  if (!isReady) {
    // Return an empty container while the component is being prepared
    return <RangeContainer ref={rangeRef} />;
  }

  return (
    <RangeContainer ref={rangeRef}>
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

      <RangeBar
        left={leftPercentage}
        width={rightPercentage - leftPercentage}
      />

      <Handle
        data-testid="left-handle"
        position={leftPercentage}
        onMouseDown={handleMouseDown('left')}
      />
      <Handle
        position={rightPercentage}
        data-testid="right-handle"
        onMouseDown={handleMouseDown('right')}
      />

      {values?.map((value, index) => (
        <FixedValueLabel key={index} position={getPercentage(value)}>
          {formatNumber(value)}
        </FixedValueLabel>
      ))}
    </RangeContainer>
  );
};

export default Range;
