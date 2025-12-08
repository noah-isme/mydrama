# 🎨 DramaBox UI Component Library

Dokumentasi lengkap untuk semua komponen UI/UX yang tersedia di DramaBox.

---

## 📦 Komponen yang Tersedia

### Core Components (Dasar)
1. **Button** - Tombol dengan berbagai varian
2. **Input** - Input field dengan validasi
3. **Card** - Kartu container
4. **Badge** - Label/badge untuk notifikasi

### Feedback Components (Umpan Balik)
5. **Toast** - Notifikasi toast
6. **Modal** - Dialog/modal popup
7. **Spinner** - Loading spinner
8. **Skeleton** - Skeleton loading screen

### Feature Components (Fitur)
9. **Navbar** - Navigation bar
10. **Header** - Hero section
11. **DramaCard** - Kartu drama
12. **FilterBar** - Filter bar
13. **VideoPlayer** - Video player

---

## 🚀 Cara Menggunakan

### Import Komponen

```tsx
// Import individual
import Button from './components/Button';
import Input from './components/Input';
import Toast from './components/Toast';

// Or import from index
import { Button, Input, Toast, Modal } from './components';
```

---

## 1. 🔘 Button Component

Tombol yang bisa dikustomisasi dengan berbagai varian dan ukuran.

### Props

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'icon' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}
```

### Contoh Penggunaan

```tsx
import Button from './components/Button';

// Primary button
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>

// Button with icon
<Button variant="primary" icon={<span>🔍</span>}>
  Search
</Button>

// Loading button
<Button variant="primary" loading={true}>
  Loading...
</Button>

// Icon button
<Button variant="icon" onClick={handleShare}>
  ❤️
</Button>

// Full width button
<Button variant="primary" fullWidth>
  Full Width Button
</Button>
```

---

## 2. 📝 Input Component

Input field dengan label, validasi, dan icon support.

### Props

```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search' | 'number' | 'tel' | 'url';
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
```

### Contoh Penggunaan

```tsx
import Input from './components/Input';

// Basic input
<Input
  label="Username"
  placeholder="Enter your username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

// Input with error
<Input
  label="Email"
  type="email"
  error="Please enter a valid email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Input with icon
<Input
  type="search"
  placeholder="Search..."
  icon={<span>🔍</span>}
/>

// Input with helper text
<Input
  label="Password"
  type="password"
  helperText="Must be at least 6 characters"
  required
/>
```

---

## 3. 🍞 Toast Component

Notifikasi popup untuk feedback ke user.

### Props

```typescript
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // milliseconds
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  onClose?: () => void;
  showCloseButton?: boolean;
}
```

### Contoh Penggunaan

```tsx
import { useState } from 'react';
import Toast from './components/Toast';

const MyComponent = () => {
  const [showToast, setShowToast] = useState(false);

  return (
    <>
      <button onClick={() => setShowToast(true)}>
        Show Toast
      </button>

      {showToast && (
        <Toast
          message="Operation successful!"
          type="success"
          duration={5000}
          position="top-right"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};
```

### Toast Hook (Recommended)

Buat custom hook untuk manage toast:

```tsx
// hooks/useToast.ts
import { useState } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const closeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, showToast, closeToast };
};

// Usage
const { toasts, showToast } = useToast();

showToast('Success!', 'success');
showToast('Error occurred', 'error');

{toasts.map((toast) => (
  <Toast key={toast.id} {...toast} onClose={() => closeToast(toast.id)} />
))}
```

---

## 4. 🪟 Modal Component

Dialog/popup modal untuk konten tambahan.

### Props

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  footer?: React.ReactNode;
}
```

### Contoh Penggunaan

```tsx
import { useState } from 'react';
import Modal from './components/Modal';
import Button from './components/Button';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
        size="medium"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </>
        }
      >
        <p>Modal content goes here...</p>
      </Modal>
    </>
  );
};
```

---

## 5. 🏷️ Badge Component

Label kecil untuk notifikasi atau status.

### Props

```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  dot?: boolean;
}
```

### Contoh Penggunaan

```tsx
import Badge from './components/Badge';

// Number badge
<Badge variant="primary">5</Badge>

// Status badge
<Badge variant="success">Active</Badge>
<Badge variant="error">Offline</Badge>
<Badge variant="warning">Pending</Badge>

// Dot badge
<Badge variant="success" dot />

// Badge on icon
<div style={{ position: 'relative' }}>
  <span>🔔</span>
  <Badge variant="error" size="small" style={{ position: 'absolute', top: -8, right: -8 }}>
    3
  </Badge>
</div>
```

---

## 6. ⏳ Spinner Component

Loading spinner untuk indikasi loading.

### Props

```typescript
interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'neutral' | 'white';
  text?: string;
  fullScreen?: boolean;
}
```

### Contoh Penggunaan

```tsx
import Spinner from './components/Spinner';

// Basic spinner
<Spinner />

// Spinner with text
<Spinner text="Loading..." />

// Full screen spinner
<Spinner fullScreen text="Please wait..." />

// Different sizes
<Spinner size="small" />
<Spinner size="large" />

// In button
<button disabled>
  <Spinner size="small" variant="white" />
  Loading...
</button>
```

---

## 7. 💀 Skeleton Component

Skeleton loading screen untuk better UX.

### Props

```typescript
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  count?: number;
  animation?: 'pulse' | 'wave' | 'none';
}
```

### Contoh Penggunaan

```tsx
import Skeleton, { SkeletonDramaCard, SkeletonList } from './components/Skeleton';

// Text skeleton
<Skeleton variant="text" count={3} />

// Custom skeleton
<Skeleton variant="rounded" width={300} height={200} animation="wave" />

// Circular (avatar)
<Skeleton variant="circular" width={48} height={48} />

// Preset components
<SkeletonDramaCard />
<SkeletonList count={5} />

// Loading state example
{loading ? (
  <SkeletonDramaCard />
) : (
  <DramaCard drama={drama} />
)}
```

---

## 8. 🃏 Card Component

Container card untuk mengelompokkan konten.

### Props

```typescript
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  hoverable?: boolean;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: string;
}
```

### Contoh Penggunaan

```tsx
import Card from './components/Card';

// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content...</p>
</Card>

// Card with header and footer
<Card
  header={<h2>Header</h2>}
  footer={<Button>Action</Button>}
>
  Content here
</Card>

// Hoverable card
<Card hoverable variant="elevated">
  Hover me!
</Card>

// Clickable card
<Card onClick={handleClick} hoverable>
  Click me!
</Card>
```

---

## 📚 Pattern Examples

### Form dengan Validasi

```tsx
import { useState } from 'react';
import { Input, Button, Toast } from './components';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      setShowToast(true);
    } catch (error) {
      setErrors({ form: 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        fullWidth
      />
      
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        fullWidth
      />
      
      <Button
        variant="primary"
        fullWidth
        loading={loading}
        type="submit"
      >
        Login
      </Button>

      {showToast && (
        <Toast
          message="Login successful!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </form>
  );
};
```

### Confirmation Dialog

```tsx
import { useState } from 'react';
import { Modal, Button } from './components';

const DeleteConfirmation = ({ onConfirm }: { onConfirm: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        Delete
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Delete"
        size="small"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm} loading={loading}>
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
      </Modal>
    </>
  );
};
```

---

## 🎨 Styling Tips

### Menggunakan CSS Variables

Semua komponen menggunakan CSS variables untuk theming:

```css
/* Colors */
var(--color-primary)
var(--color-background)
var(--color-text)
var(--color-border)
var(--color-success)
var(--color-error)
var(--color-warning)
var(--color-info)

/* Transitions */
var(--transition-fast)    /* 0.15s */
var(--transition-normal)  /* 0.3s */
var(--transition-slow)    /* 0.5s */

/* Shadows */
var(--shadow-sm)
var(--shadow-md)
var(--shadow-lg)
var(--shadow-xl)

/* Z-Index */
var(--z-modal)    /* 3000 */
var(--z-toast)    /* 4000 */
```

### Custom Styling

```tsx
// Inline style
<Button style={{ marginTop: '1rem' }}>Custom</Button>

// CSS class
<Button className="my-custom-button">Custom</Button>

// Override via CSS
.my-custom-button {
  background: linear-gradient(45deg, #ff6b6b, #ee5a6f);
}
```

---

## ♿ Accessibility

Semua komponen sudah include accessibility features:

- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus indicators
- ✅ Screen reader support
- ✅ Color contrast WCAG 2.1
- ✅ Touch-friendly tap targets (44px minimum)

---

## 📱 Responsive

Semua komponen responsive out of the box:

- ✅ Mobile-first design
- ✅ Touch-friendly
- ✅ Flexible layouts
- ✅ Adaptive sizing

---

## 🧪 Testing Examples

```tsx
// Button test
<Button onClick={() => console.log('clicked')}>Test</Button>

// Toast test
<Toast message="Test message" type="success" duration={3000} />

// Modal test
<Modal isOpen={true} onClose={() => {}}>Test content</Modal>

// Skeleton test
<Skeleton variant="text" count={5} />
```

---

## 📊 Component Summary

| Component | Lines | Features | Status |
|-----------|-------|----------|--------|
| Button | 200+ | 4 variants, 3 sizes, loading | ✅ |
| Input | 180+ | 7 types, validation, icons | ✅ |
| Toast | 230+ | 4 types, 6 positions, auto-hide | ✅ |
| Modal | 220+ | 4 sizes, overlay, ESC close | ✅ |
| Badge | 90+ | 6 variants, 3 sizes, dot | ✅ |
| Spinner | 100+ | 3 sizes, fullscreen | ✅ |
| Skeleton | 180+ | 4 variants, presets | ✅ |
| Card | 120+ | 3 variants, hoverable | ✅ |

**Total:** 1,320+ lines of reusable UI components!

---

## 🚀 Next Steps

1. ✅ Gunakan komponen di aplikasi Anda
2. ✅ Customize sesuai kebutuhan
3. ✅ Test di berbagai devices
4. ✅ Berikan feedback untuk improvement

---

**Built with ❤️ for DramaBox**  
**Version:** 2.2.0  
**Last Updated:** 2024-12-07
