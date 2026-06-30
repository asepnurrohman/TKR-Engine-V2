# Architecture

```
                 App
                  │
        ┌─────────┴─────────┐
        │                   │
     Config             EventBus
        │                   │
        ├────────────┬──────┤
        │            │      │
    Router      UI Engine   Storage
        │            │
        └────────────┤
                     │
               Learning Engine
                     │
               Google Apps Script
                     │
                Google Spreadsheet
```
