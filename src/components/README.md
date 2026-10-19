# Accordion Component API Reference

## Props

### Accordion Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<Item>` | `[]` | Array of accordion items to display |
| `variant` | `'default' \| 'bordered' \| 'filled' \| 'shadow'` | `'default'` | Visual style variant |
| `iconType` | `'chevron' \| 'plus' \| 'arrow' \| 'none'` | `'chevron'` | Type of expand/collapse icon |
| `iconPosition` | `'left' \| 'right'` | `'right'` | Position of the icon |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `3` | Semantic heading level (h1-h6) |
| `allowMultiple` | `boolean` | `false` | Allow multiple items to be open |
| `collapsible` | `boolean` | `true` | Allow closing the active item |
| `animated` | `boolean` | `true` | Enable open/close animations |
| `defaultOpenIndexes` | `number[]` | `[]` | Array of initially open item indexes |

### Item Object Structure

```typescript
interface Item {
  id: number | string;        // Unique identifier
  title: string;              // Item header text
  content: string | JSX;      // Item content
  disabled?: boolean;         // Optional: disable interaction
}
```

## Usage Examples

### Basic Usage
```jsx
import Accordion from './components/Accordion';

const items = [
  { id: 1, title: 'Question 1', content: 'Answer 1' },
  { id: 2, title: 'Question 2', content: 'Answer 2' }
];

<Accordion items={items} />
```

### With Custom Variant
```jsx
<Accordion 
  items={items} 
  variant="shadow" 
/>
```

### Multiple Open Items
```jsx
<Accordion 
  items={items} 
  allowMultiple={true} 
/>
```

### Custom Icon
```jsx
<Accordion 
  items={items} 
  iconType="plus"
  iconPosition="left" 
/>
```

### Pre-opened Items
```jsx
<Accordion 
  items={items} 
  defaultOpenIndexes={[0, 2]} 
  allowMultiple={true}
/>
```

### Disabled State
```jsx
const items = [
  { id: 1, title: 'Active', content: 'Can be clicked' },
  { id: 2, title: 'Disabled', content: 'Cannot be clicked', disabled: true }
];

<Accordion items={items} />
```

### Without Animation
```jsx
<Accordion 
  items={items} 
  animated={false} 
/>
```

### Non-Collapsible
```jsx
<Accordion 
  items={items} 
  collapsible={false} 
/>
```

## Styling Customization

### CSS Variables (Future Enhancement)
```css
.accordion {
  --accordion-border-color: #e2e8f0;
  --accordion-bg-color: white;
  --accordion-hover-bg: #f8fafc;
  --accordion-icon-color: #667eea;
  --accordion-transition: 0.3s ease;
}
```

### Class Names
- `.accordion` - Container
- `.accordion-item` - Individual item
- `.accordion-header` - Clickable header
- `.accordion-title` - Title text
- `.accordion-icon` - Expand/collapse icon
- `.accordion-content` - Content wrapper
- `.accordion-content-inner` - Content padding container

### State Classes
- `.open` - Item is expanded
- `.disabled` - Item is disabled
- `.default`, `.bordered`, `.filled`, `.shadow` - Variant classes

## Performance Tips

1. **Use React.memo** when wrapping Accordion in parent component
2. **Memoize items array** if generated dynamically
3. **Use stable IDs** for items (not array indexes)
4. **Disable animations** for long lists (> 50 items)

```jsx
const items = useMemo(() => [
  { id: 1, title: 'Item 1', content: 'Content' }
], []);

const MemoizedAccordion = memo(Accordion);
```

## Accessibility

- Uses semantic HTML (`<button>`, `<h1-h6>`)
- ARIA attributes included (`aria-expanded`, `aria-disabled`)
- Keyboard accessible (Enter/Space to toggle)
- Proper focus management
- Screen reader friendly

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## RTL Support

Automatically supports RTL layouts:
```html
<html dir="rtl">
```

All text alignment, icon positions, and layouts adjust automatically.
