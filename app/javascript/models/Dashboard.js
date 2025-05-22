import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";
import Chart from 'chart.js/auto';

console.log("Dashboard.js loaded");

let chartInstances = {};

function createPieChart(concernTicket, concernTypes) {
  const concernTicketDetails = concernTicket.concern_ticket_details || [];
  const ticketConcernTypes = concernTypes.filter(ct => ct.concern_id === concernTicket.id);

  const concernTypeCounts = {};
  concernTicketDetails.forEach((detail) => {
    const concernTypeId = detail.concern_type_id;
    concernTypeCounts[concernTypeId] = (concernTypeCounts[concernTypeId] || 0) + 1;
  });

  const concernTypeNames = Object.keys(concernTypeCounts).map((concernTypeId) => {
    const concernType = ticketConcernTypes.find((ct) => ct.id === concernTypeId);
    return concernType ? concernType.name : 'Unknown';
  });
  const counts = Object.values(concernTypeCounts);

  const canvas = document.getElementById('dynamic-pie-chart');
  if (!canvas) {
    console.error(`Pie chart canvas not found`);
    return;
  }

  if (chartInstances['pie']) {
    chartInstances['pie'].destroy();
  }

  const ctx = canvas.getContext('2d');
  chartInstances['pie'] = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: concernTypeNames,
      datasets: [{
        label: `Concern Types`,
        data: counts,
        backgroundColor: [
          'rgb(255, 99, 133)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)',
        ],
        borderColor: [
          'rgb(180, 0, 39)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)',
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function createBarChart(concernTicket) {
  const concernTicketDetails = concernTicket.concern_ticket_details || [];
  const eligibleUsers = concernTicket.eligible_users || [];

  const userMap = {};
  eligibleUsers.forEach(u => { userMap[u.id] = u.first_name; });

  const userStatusCounts = {};
  Object.keys(userMap).forEach(userId => {
    userStatusCounts[userId] = { open: 0, processing: 0, verification: 0, closed: 0 };
  });

  concernTicketDetails.forEach((detail) => {
    const userId = detail.assigned_user_id;
    if (userStatusCounts[userId]) {
      const status = (detail.status || '').toLowerCase();
      if (status === 'open') userStatusCounts[userId].open++;
      else if (status === 'processing') userStatusCounts[userId].processing++;
      else if (status === 'verification') userStatusCounts[userId].verification++;
      else if (status === 'closed') userStatusCounts[userId].closed++;
    }
  });

  const userIds = Object.keys(userMap);
  const usernames = userIds.map(uid => userMap[uid]);
  const openCounts = userIds.map(uid => userStatusCounts[uid].open);
  const processingCounts = userIds.map(uid => userStatusCounts[uid].processing);
  const verificationCounts = userIds.map(uid => userStatusCounts[uid].verification);
  const closedCounts = userIds.map(uid => userStatusCounts[uid].closed);

  const canvas = document.getElementById('dynamic-bar-chart');
  if (!canvas) {
    console.error(`Bar chart canvas not found`);
    return;
  }

  if (chartInstances['bar']) {
    chartInstances['bar'].destroy();
  }

  const ctx = canvas.getContext('2d');
  chartInstances['bar'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: usernames,
      datasets: [
        {
          label: 'Open',
          data: openCounts,
          backgroundColor: 'rgb(0, 151, 8)'
        },
        {
          label: 'Processing',
          data: processingCounts,
          backgroundColor: 'rgb(54, 163, 235)'
        },
        {
          label: 'For Verification',
          data: verificationCounts,
          backgroundColor: 'rgb(255, 198, 53)'
        },
        {
          label: 'Closed',
          data: closedCounts,
          backgroundColor: 'rgb(180, 0, 39)'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: '#000'
          },
          grid: {
            display: false
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            color: '#000'
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function renderChartsForTicket(concernTickets, concernTypes, ticketId) {
  const ticket = concernTickets.find(t => t.id === ticketId);
  if (!ticket) return;
  createPieChart(ticket, concernTypes);
  createBarChart(ticket);
}

var init = function(config) {
  $(function() {
    const concernTickets = config.concernTickets || [];
    const concernTypes = config.concernTypes || [];
    if (concernTickets.length === 0) return;

    // Initial render for the first ticket
    renderChartsForTicket(concernTickets, concernTypes, concernTickets[0].id);

    // Dropdown change event
    $('#concern-ticket-select').on('change', function() {
      const selectedId = $(this).val();
      renderChartsForTicket(concernTickets, concernTypes, selectedId);
    });
  });
};

export default { init: init };