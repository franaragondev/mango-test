import { getFixedValues } from '@/services/mockAPI';
import Range from '@/components/Range';

const Exercise2 = async () => {
  const values = await getFixedValues();

  return (
    <div className="container">
      <h1>Exercise 2: Fixed Values Range</h1>
      <p>
        Range Values: {values[0]} - {values[values.length - 1]}
      </p>
      {/* Pass the fixed values to the Range component */}
      <Range min={values[0]} max={values[values.length - 1]} values={values} />
    </div>
  );
};

export default Exercise2;
