export default defineNuxtPlugin(() => {
  return {
    provide: {
      required: (value) => !!value || "This field is required",
      email: (value) =>
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value) ||
        "Invalid email address",
      minLength: (value, length) =>
        (value && value.length >= length) ||
        `Must be at least ${length} characters`,
    },
  };
});
