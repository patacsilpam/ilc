export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateAuthInput(data: { email?: string; password?: string; display_name?: string }): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Please provide a valid email address';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (data.display_name !== undefined && data.display_name.trim().length === 0) {
    errors.display_name = 'Display name cannot be empty';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateFeedbackInput(data: { merchant_name?: string; rating?: number; comment?: string }): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.merchant_name || data.merchant_name.trim().length === 0) {
    errors.merchant_name = 'Merchant or location name is required';
  }

  if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5 || !Number.isInteger(data.rating)) {
    errors.rating = 'Rating must be an integer between 1 and 5 stars';
  }

  if (!data.comment || data.comment.trim().length < 5) {
    errors.comment = 'Feedback comment must be at least 5 characters long';
  } else if (data.comment.length > 2000) {
    errors.comment = 'Feedback comment cannot exceed 2000 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateVideoInput(data: {
  title?: string;
  description?: string;
  media_path?: string;
  thumbnail_path?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'Description is required';
  }

  if (!data.media_path || data.media_path.trim().length === 0) {
    errors.media_path = 'Video media file or URL is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateWelcomeGiftInput(data: {
  title?: string;
  description?: string;
  validity_days?: number;
  redemption_instructions?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Gift title is required';
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'Description is required';
  }

  if (typeof data.validity_days !== 'number' || data.validity_days <= 0) {
    errors.validity_days = 'Validity days must be a positive integer';
  }

  if (!data.redemption_instructions || data.redemption_instructions.trim().length === 0) {
    errors.redemption_instructions = 'Redemption instructions are required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLocationInput(data: {
  name?: string;
  latitude?: number;
  longitude?: number;
  radius_meters?: number;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Location name is required';
  }

  if (typeof data.latitude !== 'number' || data.latitude < -90 || data.latitude > 90) {
    errors.latitude = 'Latitude must be between -90 and 90';
  }

  if (typeof data.longitude !== 'number' || data.longitude < -180 || data.longitude > 180) {
    errors.longitude = 'Longitude must be between -180 and 180';
  }

  if (typeof data.radius_meters !== 'number' || data.radius_meters <= 0) {
    errors.radius_meters = 'Radius must be a positive number of meters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
