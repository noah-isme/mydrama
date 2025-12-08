# 🎨 Quick Reference - UI Components

## Import Components

```tsx
import { 
  Button, Input, Toast, Modal, Badge, 
  Spinner, Skeleton, Card 
} from './components';
```

## Common Patterns

### Form
```tsx
<Input label="Email" type="email" error={errors.email} />
<Button variant="primary" loading={loading}>Submit</Button>
```

### Notification
```tsx
<Toast message="Success!" type="success" position="top-right" />
```

### Confirmation
```tsx
<Modal isOpen={isOpen} title="Confirm">
  <p>Are you sure?</p>
  <Button variant="primary">Yes</Button>
</Modal>
```

### Loading
```tsx
{loading ? <Skeleton variant="text" count={3} /> : <Content />}
```

### Status Badge
```tsx
<Badge variant="success">Active</Badge>
```

## See Full Documentation
- `docs/UI-COMPONENTS-LIBRARY.md` - Complete guide
- `src/pages/ComponentsShowcase.tsx` - Live examples
