const Tesseract = require('tesseract.js');
const axios = require('axios');

exports.processReceipt = async (filePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      filePath,
      'eng',
      { logger: m => console.log(m) }
    );

    // Basic extraction logic: 
    // Look for patterns like "Total: $123.45" or dates like "2026-03-20"
    const totalMatch = text.match(/Total[:\s]*(\$?[\d,.]+(?:\.\d{2})?)/i);
    const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})|(\d{2}\/\d{2}\/\d{4})/);
    const vendorMatch = text.split('\n')[0].trim(); // Usually the first line

    return {
      success: true,
      data: {
        vendor_name: vendorMatch || 'Unknown Vendor',
        total_amount: totalMatch ? totalMatch[1].replace('$', '').replace(',', '') : null,
        date: dateMatch ? dateMatch[0] : null,
        raw_text: text
      }
    };
  } catch (error) {
    console.error('OCR Error:', error.message);
    return { success: false, message: 'OCR process failed', error: error.message };
  }
};

exports.getConversionRate = async (from, to) => {
  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
    return response.data.rates[to] || 1;
  } catch (error) {
    console.error('Currency Conversion Error:', error.message);
    return 1;
  }
};
