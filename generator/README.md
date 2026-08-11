# Generator Engine

This directory contains the generator contract and template strategy.

## Generation contract

The UI exports a JSON specification with:

- project metadata
- backend/frontend architecture
- database and migration strategy
- security strategy
- business modules
- entity fields

The generator will transform that specification into a deterministic source tree.

## Planned pipeline

```text
ProjectSpec
   -> validation
   -> normalized model
   -> backend templates
   -> frontend templates
   -> database migrations
   -> tests
   -> Docker / CI
   -> generated ZIP
```

Generation must remain deterministic: the same specification and template version should produce the same application structure.
