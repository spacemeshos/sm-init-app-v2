export const blur = (value: string | 'none') => {
  const val = value === 'none' ? 'none' : `blur(${value})`;
  return `backdrop-filter: ${val};
  -webkit-backdrop-filter: ${val};`;
};

