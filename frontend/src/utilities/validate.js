export function validateUserSignUpForm(formData) {
  if (!formData.username.trim()) {
    return "Name is required";
  }

  if (!formData.usn.trim()) {
    return "USN is required";
  } else if (
    !/^\d{1}[a-zA-Z]{2}\d{2}[a-zA-Z]{2}\d{3}$/.test(formData.usn.trim())
  ) {
    return "Enter a valid USN (e.g., 1SI22CS001)";
  }

  if (!formData.email.trim()) {
    return "Email is required";
  } else if (
    !formData.email.startsWith(formData.usn.toLowerCase()) ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.ac\.in$/.test(formData.email)
  ) {
    return "Enter college email (Starts with your USN)";
  }

  if (!formData.password) {
    return "Password is required";
  } else if (formData.password.length < 6) {
    return "Password must be at least 6 characters";
  }

  if (!formData.batch.trim()) {
    return "Lab Batch is required";
  } else if (!/^[a-zA-Z]{1}\d{1}$/.test(formData.batch.trim())) {
    return "Invalid Lab Batch (e.g., A1, B2)";
  }

  if (!formData.year) {
    return "Year is required";
  }

  if (!formData.branch) {
    return "Branch is required";
  }

  return null;
}

export function validateUserSignInForm(formData) {
  if (!formData.usn.trim()) {
    return "USN is required";
  } else if (
    !/^\d{1}[a-zA-Z]{2}\d{2}[a-zA-Z]{2}\d{3}$/.test(formData.usn.trim())
  ) {
    return "Enter a valid USN (e.g., 1SI22CS001)";
  }

  if (!formData.password) {
    return "Password is required";
  } else if (formData.password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
}

export function validateAdminSignInForm(formData) {
  if (!formData.email.trim()) {
    return "Email is required";
  } else if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.ac\.in$/.test(formData.email)
  ) {
    return "Enter your College Email (name.clg.ac.in)";
  }

  if (!formData.password) {
    return "Password is required";
  } else if (formData.password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
}

export function validateAdminSignUpForm(formData) {
  if (!formData.username.trim()) {
    return "Name is required";
  }
  if (!formData.email.trim()) {
    return "Email is required";
  } else if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.ac\.in$/.test(formData.email)
  ) {
    return "Enter your College Email (name.clg.ac.in)";
  }

  if (!formData.password) {
    return "Password is required";
  } else if (formData.password.length < 6) {
    return "Password must be at least 6 characters";
  }

  if (!formData.department) {
    return "Department is required";
  }

  return null;
}
