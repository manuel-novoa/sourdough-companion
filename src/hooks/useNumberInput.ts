import { ChangeEvent, useState, useEffect, useRef } from 'react';

interface UseNumberInputOptions {
  min?: number;
  max?: number;
  defaultValue?: number;
  allowEmpty?: boolean;
  onBlur?: (value: number | null) => void;
}

export const useNumberInput = (
  value: number,
  onChange: (value: number | null) => void,
  options: UseNumberInputOptions = {}
) => {
  const [localValue, setLocalValue] = useState(value.toString());
  const mounted = useRef(true);

  // Handle cleanup on unmount
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Update local value when external value changes
  useEffect(() => {
    if (mounted.current) {
      setLocalValue(value.toString());
    }
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!mounted.current) return;

    const inputValue = e.target.value;
    
    // Allow empty input
    if (inputValue === '') {
      setLocalValue('');
      if (options.allowEmpty) {
        onChange(null);
      }
      return;
    }

    // Only allow numbers and decimal point
    if (!/^\d*\.?\d*$/.test(inputValue)) {
      return;
    }

    // Update the local display value immediately
    setLocalValue(inputValue);

    // Only parse and update the actual value if it's a valid number
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      // Check min/max constraints
      if (options.min !== undefined && numValue < options.min) {
        onChange(options.min);
        return;
      }
      if (options.max !== undefined && numValue > options.max) {
        onChange(options.max);
        return;
      }
      
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    if (!mounted.current) return;

    let finalValue: number | null = null;

    // On blur, if the field is empty and not allowing empty values,
    // reset to the default value
    if (localValue === '' && !options.allowEmpty) {
      const defaultVal = options.defaultValue ?? 0;
      setLocalValue(defaultVal.toString());
      finalValue = defaultVal;
      onChange(defaultVal);
    } else {
      // If it's a valid number, ensure it respects min/max
      const numValue = parseFloat(localValue);
      if (!isNaN(numValue)) {
        finalValue = numValue;
        
        if (options.min !== undefined && numValue < options.min) {
          finalValue = options.min;
        } else if (options.max !== undefined && numValue > options.max) {
          finalValue = options.max;
        }

        if (finalValue !== numValue) {
          setLocalValue(finalValue.toString());
          onChange(finalValue);
        }
      }
    }

    // Call the onBlur callback if provided
    if (options.onBlur) {
      options.onBlur(finalValue);
    }
  };

  return {
    value: localValue,
    onChange: handleChange,
    onBlur: handleBlur,
  };
};