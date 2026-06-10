'use client';

import { useState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { updateProfile } from '@/app/api/profile/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Upload, User, Link as LinkIcon, FileText, X, Pencil } from 'lucide-react';

interface ProfileFormProps {
  profile?: {
    full_name: string;
    title: string;
    short_bio: string;
    email: string;
    phone: string;
    location: string;
    avatar_url: string;
    website_logo: string;
    github_url: string;
    linkedin_url: string;
    website_url: string;
    bio_1: string;
    bio_2: string;
    bio_3: string;
  };
}

const defaultProfile = {
  full_name: '',
  title: '',
  short_bio: '',
  email: '',
  phone: '',
  location: '',
  avatar_url: '/default-avatar.png',
  website_logo: '',
  github_url: '',
  linkedin_url: '',
  website_url: '',
  bio_1: '',
  bio_2: '',
  bio_3: '',
};

// ============ SANITIZATION & VALIDATION UTILS ============

// Sanitize input to prevent XSS and injection attacks
function sanitizeInput(input: string | undefined | null): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\//g, '\\')
    .trim();
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

// Validate phone format (international support)
function isValidPhone(phone: string): boolean {
  // Supports formats like: +33 6 12 34 56 78, +1-234-567-8900, (123) 456-7890, etc.
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
  const digitsOnly = phone.replace(/\D/g, '');
  return phoneRegex.test(phone.trim()) && digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

// Validate URL format
function isValidURL(url: string): boolean {
  if (!url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Count characters including whitespace and symbols
function countChars(text: string): number {
  return text.length;
}

// Validate the entire form
function validateForm(formData: FormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields - must be full (not empty after trim)
  const fullName = (formData.get('full_name') as string || '').trim();
  if (!fullName) errors.push('Le nom complet est requis.');

  const title = (formData.get('title') as string || '').trim();
  if (!title) errors.push('Le titre / poste est requis.');

  const shortBio = (formData.get('short_bio') as string || '').trim();
  if (!shortBio) errors.push('La bio courte est requise.');

  const location = (formData.get('location') as string || '').trim();
  if (!location) errors.push('La localisation est requise.');

  // Email - required + valid format
  const email = (formData.get('email') as string || '').trim();
  if (!email) {
    errors.push("L'email est requis.");
  } else if (!isValidEmail(email)) {
    errors.push("L'email n'est pas valide (ex: nom@domaine.com).");
  }

  // Phone - required + valid format
  const phone = (formData.get('phone') as string || '').trim();
  if (!phone) {
    errors.push('Le téléphone est requis.');
  } else if (!isValidPhone(phone)) {
    errors.push('Le numéro de téléphone n\'est pas valide (min 7 chiffres, max 15).');
  }

  // Links - required + valid URL format
  const githubUrl = (formData.get('github_url') as string || '').trim();
  if (!githubUrl) {
    errors.push('Le lien GitHub est requis.');
  } else if (!isValidURL(githubUrl)) {
    errors.push('Le lien GitHub doit être une URL valide (https://...).');
  }

  const linkedinUrl = (formData.get('linkedin_url') as string || '').trim();
  if (!linkedinUrl) {
    errors.push('Le lien LinkedIn est requis.');
  } else if (!isValidURL(linkedinUrl)) {
    errors.push('Le lien LinkedIn doit être une URL valide (https://...).');
  }

  const websiteUrl = (formData.get('website_url') as string || '').trim();
  if (!websiteUrl) {
    errors.push('Le lien du site web est requis.');
  } else if (!isValidURL(websiteUrl)) {
    errors.push('Le lien du site web doit être une URL valide (https://...).');
  }

  // Bio fields - required + max 180 chars (including whitespace & symbols)
  const bio1 = (formData.get('bio_1') as string || '').trim();
  if (!bio1) {
    errors.push('La bio 1 est requise.');
  } else if (countChars(bio1) > 180) {
    errors.push('La bio 1 ne doit pas dépasser 180 caractères (espaces et symboles inclus).');
  }

  const bio2 = (formData.get('bio_2') as string || '').trim();
  if (!bio2) {
    errors.push('La bio 2 est requise.');
  } else if (countChars(bio2) > 180) {
    errors.push('La bio 2 ne doit pas dépasser 180 caractères (espaces et symboles inclus).');
  }

  const bio3 = (formData.get('bio_3') as string || '').trim();
  if (!bio3) {
    errors.push('La bio 3 est requise.');
  } else if (countChars(bio3) > 180) {
    errors.push('La bio 3 ne doit pas dépasser 180 caractères (espaces et symboles inclus).');
  }

  return { isValid: errors.length === 0, errors };
}

// Sanitize form data before submission
function sanitizeFormData(rawFormData: FormData): FormData {
  const sanitized = new FormData();

  const fieldsToSanitize = [
    'full_name', 'title', 'short_bio', 'email', 'phone', 'location',
    'github_url', 'linkedin_url', 'website_url', 'bio_1', 'bio_2', 'bio_3'
  ];

  fieldsToSanitize.forEach((field) => {
    const value = rawFormData.get(field);
    if (value !== null) {
      sanitized.append(field, sanitizeInput(value as string));
    }
  });

  // Pass through non-text fields
  const avatarUrl = rawFormData.get('avatar_url');
  if (avatarUrl !== null) sanitized.append('avatar_url', avatarUrl as string);

  const websiteLogo = rawFormData.get('website_logo');
  if (websiteLogo !== null) sanitized.append('website_logo', websiteLogo as string);

  return sanitized;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-auto h-12 text-base font-semibold"
      style={{ backgroundColor: 'green' }}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Mise à jour...
        </>
      ) : (
        'Mettre à jour le profil'
      )}
    </Button>
  );
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const safeProfile = profile ?? defaultProfile;
  const [formState, setFormState] = useState(safeProfile);
  const [avatarPreview, setAvatarPreview] = useState(safeProfile.avatar_url);
  const [logoPreview, setLogoPreview] = useState(safeProfile.website_logo);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Field-level error states
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Close on click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      setIsOpen(false);
    }
  };

  // Real-time field validation
  const validateField = (name: string, value: string): string => {
    const trimmed = value.trim();

    switch (name) {
      case 'full_name':
        return !trimmed ? 'Le nom complet est requis.' : '';
      case 'title':
        return !trimmed ? 'Le titre / poste est requis.' : '';
      case 'short_bio':
        return !trimmed ? 'La bio courte est requise.' : '';
      case 'location':
        return !trimmed ? 'La localisation est requise.' : '';
      case 'email':
        if (!trimmed) return "L'email est requis.";
        if (!isValidEmail(trimmed)) return "L'email n'est pas valide (ex: nom@domaine.com).";
        return '';
      case 'phone':
        if (!trimmed) return 'Le téléphone est requis.';
        if (!isValidPhone(trimmed)) return 'Numéro invalide (min 7 chiffres).';
        return '';
      case 'github_url':
        if (!trimmed) return 'Le lien GitHub est requis.';
        if (!isValidURL(trimmed)) return 'URL invalide (https://...).';
        return '';
      case 'linkedin_url':
        if (!trimmed) return 'Le lien LinkedIn est requis.';
        if (!isValidURL(trimmed)) return 'URL invalide (https://...).';
        return '';
      case 'website_url':
        if (!trimmed) return 'Le lien du site web est requis.';
        if (!isValidURL(trimmed)) return 'URL invalide (https://...).';
        return '';
      case 'bio_1':
      case 'bio_2':
      case 'bio_3':
        if (!trimmed) return 'Ce champ est requis.';
        if (countChars(trimmed) > 180) return 'Max 180 caractères.';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Update form state
    setFormState(prev => ({ ...prev, [name]: value }));

    // Mark as touched
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate in real-time
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'logo'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview locale immédiate
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'avatar') {
        setAvatarPreview(reader.result as string);
      } else {
        setLogoPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Upload vers Cloudinary
    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', type === 'avatar' ? 'avatars' : 'logos');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();

      if (data.url) {
        setFormState(prev => ({
          ...prev,
          [type === 'avatar' ? 'avatar_url' : 'website_logo']: data.url
        }));
        toast.success(`${type === 'avatar' ? 'Avatar' : 'Logo'} uploadé !`);
      }
    } catch {
      toast.error("Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (rawFormData: FormData) => {
    // 1. Validate form
    const { isValid, errors } = validateForm(rawFormData);

    if (!isValid) {
      errors.forEach(err => toast.error(err));

      // Mark all fields as touched to show errors
      const allTouched: Record<string, boolean> = {};
      const allFields = ['full_name', 'title', 'short_bio', 'location', 'email', 'phone',
                        'github_url', 'linkedin_url', 'website_url', 'bio_1', 'bio_2', 'bio_3'];
      allFields.forEach(f => { allTouched[f] = true; });
      setTouched(allTouched);

      // Set field errors
      const newErrors: Record<string, string> = {};
      allFields.forEach(field => {
        const value = (rawFormData.get(field) as string) || '';
        newErrors[field] = validateField(field, value);
      });
      setFieldErrors(newErrors);

      return;
    }

    // 2. Sanitize inputs for security
    const sanitizedFormData = sanitizeFormData(rawFormData);

    // 3. Append image URLs
    sanitizedFormData.append('avatar_url', formState.avatar_url);
    sanitizedFormData.append('website_logo', formState.website_logo);

    // 4. Submit
    const result = await updateProfile(sanitizedFormData);

    if (result.success) {
      toast.success(result.message);
      setIsOpen(false);
      // Reset touched/errors
      setTouched({});
      setFieldErrors({});
    } else {
      toast.error(result.message);
    }
  };

  // Helper to show error state
  const getFieldError = (name: string): string | undefined => {
    return touched[name] ? fieldErrors[name] : undefined;
  };

  const inputErrorClass = "border-red-500 focus-visible:ring-red-500";

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 h-auto text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        style={{ width: '180px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', left: 0 }}
      >
        <Pencil className="h-4 w-4" />
        Update Profil
      </Button>

      {/* Modal Overlay - Fixed Bottom */}
      {isOpen && (
        <div 
          ref={modalRef}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          {/* Modal Content - Fixed Bottom Sheet Style */}
          <div 
            className="bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl w-full overflow-hidden flex flex-col"
            style={{ 
              animation: 'slideUp 0.3s ease-out',
              maxHeight: '85vh',
              maxWidth: '80%'
            }}
          >
            {/* Modal Header - Fixed */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Pencil className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Modifier le profil</h2>
                  <p className="text-sm text-muted-foreground">Mettez à jour vos informations</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
              <form action={handleSubmit} className="space-y-6">
                {/* Images Section */}
                <Card className="border-2 border-dashed border-gray-200 dark:border-zinc-700 hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Upload className="h-5 w-5" />
                      Images du profil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Avatar */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Photo de profil</Label>
                      <div className="relative group flex justify-center sm:justify-start">
                        <div
                          className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-md"
                          onClick={() => avatarInputRef.current?.click()}
                        >
                          {avatarPreview ? (
                            <Image
                              src={avatarPreview}
                              alt="Avatar preview"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <User className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                            <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                        </div>
                        <input
                          ref={avatarInputRef}
                          type="file"
                          name="avatar"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, 'avatar')}
                        />
                      </div>
                      {isUploading && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Upload en cours...
                        </p>
                      )}
                    </div>

                    {/* Website Logo */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Logo du site</Label>
                      <div className="relative group flex justify-center sm:justify-start">
                        <div
                          className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-md bg-white"
                          onClick={() => logoInputRef.current?.click()}
                        >
                          {logoPreview ? (
                            <Image
                              src={logoPreview}
                              alt="Logo preview"
                              fill
                              className="object-contain p-2 sm:p-3"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <LinkIcon className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                            <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                        </div>
                        <input
                          ref={logoInputRef}
                          type="file"
                          name="website_logo"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, 'logo')}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Section Informations */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <User className="h-5 w-5" />
                      Informations personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-sm">Nom complet *</Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          value={formState.full_name}
                          onChange={handleInputChange}
                          onBlur={(e) => {
                            setTouched(prev => ({ ...prev, full_name: true }));
                            setFieldErrors(prev => ({ ...prev, full_name: validateField('full_name', e.target.value) }));
                          }}
                          required
                          className={`h-11 ${getFieldError('full_name') ? inputErrorClass : ''}`}
                          placeholder="Votre nom complet"
                        />
                        {getFieldError('full_name') && (
                          <p className="text-xs text-red-500 mt-1">{getFieldError('full_name')}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm">Titre / Poste *</Label>
                        <Input
                          id="title"
                          name="title"
                          value={formState.title}
                          onChange={handleInputChange}
                          onBlur={(e) => {
                            setTouched(prev => ({ ...prev, title: true }));
                            setFieldErrors(prev => ({ ...prev, title: validateField('title', e.target.value) }));
                          }}
                          required
                          className={`h-11 ${getFieldError('title') ? inputErrorClass : ''}`}
                          placeholder="Votre poste"
                        />
                        {getFieldError('title') && (
                          <p className="text-xs text-red-500 mt-1">{getFieldError('title')}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="short_bio" className="text-sm">Bio courte *</Label>
                        <Input
                          id="short_bio"
                          name="short_bio"
                          value={formState.short_bio}
                          onChange={handleInputChange}
                          onBlur={(e) => {
                            setTouched(prev => ({ ...prev, short_bio: true }));
                            setFieldErrors(prev => ({ ...prev, short_bio: validateField('short_bio', e.target.value) }));
                          }}
                          required
                          type="text"
                          className={`h-11 ${getFieldError('short_bio') ? inputErrorClass : ''}`}
                          placeholder="Une courte description de vous..."
                        />
                        {getFieldError('short_bio') && (
                          <p className="text-xs text-red-500 mt-1">{getFieldError('short_bio')}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm">Localisation *</Label>
                        <Input
                          id="location"
                          name="location"
                          value={formState.location}
                          onChange={handleInputChange}
                          onBlur={(e) => {
                            setTouched(prev => ({ ...prev, location: true }));
                            setFieldErrors(prev => ({ ...prev, location: validateField('location', e.target.value) }));
                          }}
                          required
                          className={`h-11 ${getFieldError('location') ? inputErrorClass : ''}`}
                          placeholder="Ville, Pays"
                        />
                        {getFieldError('location') && (
                          <p className="text-xs text-red-500 mt-1">{getFieldError('location')}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleInputChange}
                          onBlur={(e) => {
                            setTouched(prev => ({ ...prev, email: true }));
                            setFieldErrors(prev => ({ ...prev, email: validateField('email', e.target.value) }));
                          }}
                          required
                          className={`h-11 ${getFieldError('email') ? inputErrorClass : ''}`}
                          placeholder="email@exemple.com"
                        />
                        {getFieldError('email') && (
                          <p className="text-xs text-red-500 mt-1">{getFieldError('email')}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm">Téléphone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formState.phone}
                          onChange={handleInputChange}
                          onBlur={(e) => {
                            setTouched(prev => ({ ...prev, phone: true }));
                            setFieldErrors(prev => ({ ...prev, phone: validateField('phone', e.target.value) }));
                          }}
                          required
                          className={`h-11 ${getFieldError('phone') ? inputErrorClass : ''}`}
                          placeholder="+33 6 12 34 56 78"
                        />
                        {getFieldError('phone') && (
                          <p className="text-xs text-red-500 mt-1">{getFieldError('phone')}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Section Liens */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <LinkIcon className="h-5 w-5" />
                      Liens *
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="github_url" className="text-sm">GitHub *</Label>
                      <Input
                        id="github_url"
                        name="github_url"
                        type="url"
                        value={formState.github_url}
                        onChange={handleInputChange}
                        onBlur={(e) => {
                          setTouched(prev => ({ ...prev, github_url: true }));
                          setFieldErrors(prev => ({ ...prev, github_url: validateField('github_url', e.target.value) }));
                        }}
                        required
                        className={`h-11 ${getFieldError('github_url') ? inputErrorClass : ''}`}
                        placeholder="https://github.com/username"
                      />
                      {getFieldError('github_url') && (
                        <p className="text-xs text-red-500 mt-1">{getFieldError('github_url')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin_url" className="text-sm">LinkedIn *</Label>
                      <Input
                        id="linkedin_url"
                        name="linkedin_url"
                        type="url"
                        value={formState.linkedin_url}
                        onChange={handleInputChange}
                        onBlur={(e) => {
                          setTouched(prev => ({ ...prev, linkedin_url: true }));
                          setFieldErrors(prev => ({ ...prev, linkedin_url: validateField('linkedin_url', e.target.value) }));
                        }}
                        required
                        className={`h-11 ${getFieldError('linkedin_url') ? inputErrorClass : ''}`}
                        placeholder="https://linkedin.com/in/username"
                      />
                      {getFieldError('linkedin_url') && (
                        <p className="text-xs text-red-500 mt-1">{getFieldError('linkedin_url')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website_url" className="text-sm">Site web *</Label>
                      <Input
                        id="website_url"
                        name="website_url"
                        type="url"
                        value={formState.linkedin_url}
                        onChange={handleInputChange}
                        onBlur={(e) => {
                          setTouched(prev => ({ ...prev, website_url: true }));
                          setFieldErrors(prev => ({ ...prev, website_url: validateField('website_url', e.target.value) }));
                        }}
                        required
                        className={`h-11 ${getFieldError('website_url') ? inputErrorClass : ''}`}
                        placeholder="https://monsite.com"
                      />
                      {getFieldError('website_url') && (
                        <p className="text-xs text-red-500 mt-1">{getFieldError('website_url')}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Section Bio */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <FileText className="h-5 w-5" />
                      Biographie *
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="bio_1" className="text-sm">Bio 1 *</Label>
                        <span className={`text-xs ${countChars(formState.bio_1) > 180 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {countChars(formState.bio_1)}/180
                        </span>
                      </div>
                      <Textarea
                        id="bio_1"
                        name="bio_1"
                        value={formState.bio_1}
                        onChange={handleInputChange}
                        onBlur={(e) => {
                          setTouched(prev => ({ ...prev, bio_1: true }));
                          setFieldErrors(prev => ({ ...prev, bio_1: validateField('bio_1', e.target.value) }));
                        }}
                        required
                        rows={4}
                        placeholder="Premier paragraphe de ta bio..."
                        className={`resize-none ${getFieldError('bio_1') ? inputErrorClass : ''}`}
                      />
                      {getFieldError('bio_1') && (
                        <p className="text-xs text-red-500 mt-1">{getFieldError('bio_1')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="bio_2" className="text-sm">Bio 2 *</Label>
                        <span className={`text-xs ${countChars(formState.bio_2) > 180 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {countChars(formState.bio_2)}/180
                        </span>
                      </div>
                      <Textarea
                        id="bio_2"
                        name="bio_2"
                        value={formState.bio_2}
                        onChange={handleInputChange}
                        onBlur={(e) => {
                          setTouched(prev => ({ ...prev, bio_2: true }));
                          setFieldErrors(prev => ({ ...prev, bio_2: validateField('bio_2', e.target.value) }));
                        }}
                        required
                        rows={4}
                        placeholder="Deuxième paragraphe..."
                        className={`resize-none ${getFieldError('bio_2') ? inputErrorClass : ''}`}
                      />
                      {getFieldError('bio_2') && (
                        <p className="text-xs text-red-500 mt-1">{getFieldError('bio_2')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="bio_3" className="text-sm">Bio 3 *</Label>
                        <span className={`text-xs ${countChars(formState.bio_3) > 180 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {countChars(formState.bio_3)}/180
                        </span>
                      </div>
                      <Textarea
                        id="bio_3"
                        name="bio_3"
                        value={formState.bio_3}
                        onChange={handleInputChange}
                        onBlur={(e) => {
                          setTouched(prev => ({ ...prev, bio_3: true }));
                          setFieldErrors(prev => ({ ...prev, bio_3: validateField('bio_3', e.target.value) }));
                        }}
                        required
                        rows={4}
                        placeholder="Troisième paragraphe..."
                        className={`resize-none ${getFieldError('bio_3') ? inputErrorClass : ''}`}
                      />
                      {getFieldError('bio_3') && (
                        <p className="text-xs text-red-500 mt-1">{getFieldError('bio_3')}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="w-auto sm:w-auto h-12 px-8 order-2 sm:order-1"
                  >
                    Annuler
                  </Button>
                  <div className="flex-1 order-1 sm:order-2">
                    <SubmitButton />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`\`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}