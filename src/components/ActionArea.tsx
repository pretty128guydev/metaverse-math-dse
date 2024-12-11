import React from 'react';
import Button from './Button';

const ActionArea: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Buttons */}
      <div className="flex justify-between mb-4">
        <Button text="Edit" />
        <Button text="Submit" />
        <Button text="Generate Question" />
      </div>

      {/* Action Areas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-blue-600 rounded-lg bg-white shadow-md p-4">
          <h3 className="text-lg font-bold">C</h3>
        </div>
        <div className="border-2 border-blue-600 rounded-lg bg-white shadow-md p-4">
          <h3 className="text-lg font-bold">D</h3>
        </div>
      </div>
    </div>
  );
};

export default ActionArea;
