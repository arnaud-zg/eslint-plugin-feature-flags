# Multi-file Cleanup Example

Shows how to handle feature flag cleanup across multiple files.

## Files

- `utils.ts` - Utility functions using feature flags
- `components.ts` - Components that use feature flags directly and via utils
- `app.ts` - Main app that uses components and utils together

## Testing

To test cleanup across all files:

```bash
npx eslint rules/cleanup-feature-flag/multi-file/*.ts --fix
```
