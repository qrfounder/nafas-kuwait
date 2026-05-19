# CAPI payload reference (Nafas backend)

## Deduplication

- Browser and server share `event_id` (UUID from `crypto.randomUUID()` on frontend).
- Meta: pass `eventID` in browser pixel; `event_id` in CAPI body.
- TikTok: `event_id` on both sides.
- Snap: `client_dedup_id` = `event_id`.

## Phone hashing

| Platform | Normalize | Hash input |
|----------|-----------|------------|
| Meta | `96551234567` (digits only) | SHA256 lowercase hex |
| TikTok | `+96551234567` (E.164) | SHA256 lowercase hex |
| Snap | `96551234567` | SHA256 (same as Meta in our implementation) |

Implemented in `app/services/pii_hash.py`.

## Meta Purchase (server)

```json
{
  "data": [{
    "event_name": "Purchase",
    "event_time": 1715779200,
    "event_id": "uuid",
    "action_source": "website",
    "event_source_url": "https://nafas.shop/thank-you?order=NF-...",
    "user_data": {
      "ph": ["<sha256 phone>"],
      "fn": ["<sha256 first name optional>"],
      "fbp": "_fbp cookie",
      "fbc": "_fbc cookie"
    },
    "custom_data": { "currency": "USD", "value": 49.0 }
  }],
  "access_token": "..."
}
```

## Web pixels (browser, deferred)

Loaded via `initAnalyticsDeferred()` after `requestIdleCallback` (2.5s max). No PII in browser events — server CAPI sends hashed phone.
