# Google Sheets order sync

## Setup

1. Create a new Google Sheet named **Nafas Orders**
2. Import `orders_template.csv` as the first row headers (or paste headers manually)
3. Open **Extensions → Apps Script**, paste `apps-script.js`
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the Web App URL into backend `.env`:

   ```
   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
   ```

## Column reference

| Column | Description |
|--------|-------------|
| order_id | NF-YYYYMMDD-XXXXXX |
| status | new → sent_to_codnetwork → confirmed → delivered → returned |

## COD Network

Export or filter `status=new` rows and enter orders in COD Network seller panel manually (Phase 2: Zapier).
