import { getRangeValues } from '@/services/mockAPI';
import Range from '@/components/Range';

const Exercise1 = async () => {
  const { min, max } = await getRangeValues();

  return (
    <div className="container">
      <h1>Exercise 1: Normal Range</h1>
      <p>
        Range Values: {min} - {max}
      </p>
      {/* Pass the min and max values to the Range component */}
      <Range min={min} max={max} />
    </div>
  );
};

export default Exercise1;
