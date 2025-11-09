import { useState } from "react";
import { ZodSchema } from "zod";

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: ZodSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear error khi user thay đổi input
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    if (!validationSchema) return true;

    try {
      validationSchema.parse(values);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Partial<Record<keyof T, string>> = {};

      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path[0] as keyof T;
          newErrors[field] = err.message;
        });
      }

      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setValues,
    setErrors,
  };
};
