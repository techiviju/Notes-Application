import React from 'react';
import PropTypes from 'prop-types';

const sizes = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-2',
};

const Spinner = ({ size = 'md' }) => (
  <div className={`animate-spin rounded-full ${sizes[size]} border-primary-200 border-t-primary-600`} />
);

export default React.memo(Spinner);

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};


 