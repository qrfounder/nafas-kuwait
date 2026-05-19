/**
 * Nafas Orders — Google Apps Script Web App
 * Deploy: Extensions > Apps Script > Deploy > Web app (Execute as: Me, Anyone can access)
 * Paste URL into backend GOOGLE_SHEETS_WEBHOOK_URL
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders') ||
      SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.order_id || '',
      data.created_at || new Date().toISOString(),
      data.name || '',
      data.phone || '',
      data.product || '',
      data.tier || '',
      data.items_json || '',
      data.subtotal_usd || 0,
      data.upsell_sku || '',
      data.upsell_price_usd || 0,
      data.total_usd || 0,
      data.utm_source || '',
      data.utm_campaign || '',
      data.event_id || '',
      data.status || 'new',
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('Nafas Orders webhook is running.');
}
