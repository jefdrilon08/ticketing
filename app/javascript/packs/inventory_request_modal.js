document.addEventListener('turbolinks:load', function() {
    const form = document.querySelector('#createRequestModal form');
    if (!form) return;
  
    form.addEventListener('ajax:success', function(event) {
      const [data] = event.detail;
      const newRow = `
        <tr>
          <td class="px-4 py-2 border">${data.item_id}</td>
          <td class="px-4 py-2 border">${data.description}</td>
          <td class="px-4 py-2 border">${data.unit}</td>
          <td class="px-4 py-2 border">${data.quantity_requested}</td>
          <td class="px-4 py-2 border">${data.approve_quantity}</td>
          <td class="px-4 py-2 border">${data.remarks}</td>
          <td class="px-4 py-2 border">${data.status}</td>
        </tr>
      `;
      document.querySelector('table tbody').insertAdjacentHTML('beforeend', newRow);
      $('#createRequestModal').modal('hide');
    });
  
    form.addEventListener('ajax:error', function() {
      alert("There was an error processing your request.");
    });
  });
  