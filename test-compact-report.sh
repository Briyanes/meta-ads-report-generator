#!/bin/bash

# Test generate CTWA report with RMODA data

echo "🧪 Testing Compact Design Report Generation"
echo "========================================"
echo ""

# Prepare form data
THIS_MONTH_DIR="test-data/bulan ini"
LAST_MONTH_DIR="test-data/bulan lalu"

# Check if directories exist
if [ ! -d "$THIS_MONTH_DIR" ] || [ ! -d "$LAST_MONTH_DIR" ]; then
    echo "❌ Data directories not found!"
    echo "   Expected: $THIS_MONTH_DIR and $LAST_MONTH_DIR"
    exit 1
fi

# Count files
THIS_COUNT=$(find "$THIS_MONTH_DIR" -name "*.csv" | wc -l)
LAST_COUNT=$(find "$LAST_MONTH_DIR" -name "*.csv" | wc -l)

echo "📊 Data Found:"
echo "   This month: $THIS_COUNT CSV files"
echo "   Last month: $LAST_COUNT CSV files"
echo ""

# Prepare multipart form data
BOUNDARY="----WebKitFormBoundary7MA4YWxkTrZu0gW"

# Create temp file for form data
TEMP_FILE=$(mktemp)

# Build form data
cat > "$TEMP_FILE" <<EOF
--$BOUNDARY
Content-Disposition: form-data; name="filesThisWeek"; filename="combined.csv"

EOF

# Add this month files
find "$THIS_MONTH_DIR" -name "*.csv" | sort | while read file; do
    cat >> "$TEMP_FILE" <<EOF
--$BOUNDARY
Content-Disposition: form-data; name="filesThisWeek"; filename="$file"
Content-Type: text/csv

EOF
    cat "$file" >> "$TEMP_FILE"
    echo "" >> "$TEMP_FILE"
done

# Add last month files
find "$LAST_MONTH_DIR" -name "*.csv" | sort | while read file; do
    cat >> "$TEMP_FILE" <<EOF
--$BOUNDARY
Content-Disposition: form-data; name="filesLastWeek"; filename="$file"
Content-Type: text/csv

EOF
    cat "$file" >> "$TEMP_FILE"
    echo "" >> "$TEMP_FILE"
done

# Add other form fields
cat >> "$TEMP_FILE" <<EOF
--$BOUNDARY
Content-Disposition: form-data; name="reportName"

RMODA WORKSHOP
--$BOUNDARY
Content-Disposition: form-data; name="retentionType"

mom
--$BOUNDARY
Content-Disposition: form-data; name="objectiveType"

ctwa
--$BOUNDARY--

EOF

# Make API call
echo "📡 Sending generate request..."
echo ""

RESPONSE=$(curl -s -X POST http://localhost:3000/api/generate-report \
  -H "Content-Type: multipart/form-data; boundary=$BOUNDARY" \
  --data-binary @"$TEMP_FILE")

# Clean up
rm -f "$TEMP_FILE"

# Check response
if [ -n "$RESPONSE" ]; then
    echo "✅ Report generation initiated!"
    echo ""
    echo '📄 Response preview (first 500 chars):'
    echo "$RESPONSE" | head -c 500
    echo ""
    echo "💡 Check if HTML report was generated"
else
    echo "❌ No response from server"
    exit 1
fi

echo ""
echo "✨ Test completed!"
