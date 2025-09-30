// Students may optionally include form validation.
// See sprint-11/copilot-features/form-validation for an example.

import { useState } from "react";

export function useForm(defaultValues) {
  const [values, setValues] = useState(defaultValues);

  const handleChange = (event) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value });
  };

  function resetForm() {
    setValues(defaultValues);
  }

  return { values, handleChange, setValues, resetForm };
}
