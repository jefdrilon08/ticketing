function printTable() {
  const tableContent = document.getElementById('printable-table');
  if (!tableContent) {
    console.warn("No printable table found!");
    return;
  }

  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>Print Table</title>');
  printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">');
  printWindow.document.write('<style>@media print { .no-print { display: none !important; } }</style>');
  printWindow.document.write('</head><body>');
  printWindow.document.write('<h4>System Ticket List</h4>');
  printWindow.document.write(tableContent.outerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('print-btn');
  if (button) {
    button.addEventListener('click', printTable);
  }
});

export default { printTable };
