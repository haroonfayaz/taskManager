export const validateRequired = (value) => (value ? undefined : "Required");
export const composeValidators =
  (...validators) =>
  (value) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );

export const validateNumber = (value) =>
  !isNaN(value) && value !== "" ? undefined : "Must be a number";
