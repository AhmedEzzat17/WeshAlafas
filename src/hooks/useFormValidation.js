/**
 * useFormValidation.js – Client-side form validation hook
 * ========================================================
 * 
 * Validates form fields BEFORE submitting to the API.
 * Returns per-field errors and an isValid flag.
 * 
 * WHY: Reduces unnecessary API calls for obviously invalid inputs
 * and provides instant feedback to users.
 * 
 * USAGE:
 *   const { errors, validate, setServerErrors, clearErrors } = useFormValidation();
 *   
 *   const onSubmit = () => {
 *     if (!validate(formData, loginRules)) return;
 *     // ... call API
 *   };
 */

import { useState, useCallback } from "react";

/**
 * Built-in validation rules.
 * Each rule is a function that returns an error message or null.
 */
const validators = {
  required: (value, fieldLabel) => {
    if (!value || (typeof value === "string" && !value.trim())) {
      return `${fieldLabel} is required`;
    }
    return null;
  },

  email: (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  },

  minLength: (value, _label, min) => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  phone: (value) => {
    if (value && !/^[\d+\-() ]{7,20}$/.test(value)) {
      return "Please enter a valid phone number";
    }
    return null;
  },

  match: (value, _label, _min, matchValue, matchLabel) => {
    if (value !== matchValue) {
      return `Does not match ${matchLabel}`;
    }
    return null;
  },
};

/**
 * Pre-built validation rule sets for common forms.
 * Each key maps to an array of { rule, label, ...params }.
 */
export const loginRules = {
  email: [
    { rule: "required", label: "Email" },
    { rule: "email" },
  ],
  password: [
    { rule: "required", label: "Password" },
    { rule: "minLength", label: "Password", min: 6 },
  ],
};

export const registerRules = (formData) => ({
  name: [
    { rule: "required", label: "Name" },
    { rule: "minLength", label: "Name", min: 2 },
  ],
  email: [
    { rule: "required", label: "Email" },
    { rule: "email" },
  ],
  phone: [
    { rule: "required", label: "Phone" },
    { rule: "phone" },
  ],
  password: [
    { rule: "required", label: "Password" },
    { rule: "minLength", label: "Password", min: 6 },
  ],
  password_confirmation: [
    { rule: "required", label: "Password confirmation" },
    {
      rule: "match",
      label: "Password confirmation",
      matchValue: formData.password,
      matchLabel: "password",
    },
  ],
});

export default function useFormValidation() {
  const [errors, setErrors] = useState({});

  /**
   * Validate formData against a rules object.
   * rules can be an object or a function that receives formData.
   * @returns {boolean} true if valid
   */
  const validate = useCallback((formData, rules) => {
    const resolvedRules = typeof rules === "function" ? rules(formData) : rules;
    const newErrors = {};

    Object.entries(resolvedRules).forEach(([field, fieldRules]) => {
      for (const rule of fieldRules) {
        const validator = validators[rule.rule];
        if (!validator) continue;

        const errorMsg = validator(
          formData[field],
          rule.label || field,
          rule.min,
          rule.matchValue,
          rule.matchLabel
        );

        if (errorMsg) {
          newErrors[field] = errorMsg;
          break; // Stop at first error per field
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  /**
   * Merge server-side validation errors (from 422 response)
   * into the errors state.
   */
  const setServerErrors = useCallback((serverErrors) => {
    setErrors((prev) => ({ ...prev, ...serverErrors }));
  }, []);

  /** Clear a specific field error (useful onFocus) */
  const clearFieldError = useCallback((field) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  /** Clear all errors */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return { errors, validate, setServerErrors, clearFieldError, clearErrors };
}
