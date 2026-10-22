MAKE_PDF_TOOL="../web2pdf/makepdf.sh"

BAND_REVIEW_BASE_URL=${1}

PARADE_BOOK_URL="${BAND_REVIEW_BASE_URL}/paradeBook.html"
FIELD_SHOW_BOOK_URL="${BAND_REVIEW_BASE_URL}/fieldShowBook.html"

cd "$(dirname "$0")"
${MAKE_PDF_TOOL} "${PARADE_BOOK_URL}" ./dist/ParadeBook.pdf
${MAKE_PDF_TOOL} "${FIELD_SHOW_BOOK_URL}" ./dist/FieldShowBook.pdf
