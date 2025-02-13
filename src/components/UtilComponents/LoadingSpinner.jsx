import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingSpinner = ({ loading }) => {
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${loading ? 'block' : 'hidden'}`}>
      <ClipLoader color="#00b4d8" loading={loading} size={50} />
    </div>
  );
};

export default LoadingSpinner;