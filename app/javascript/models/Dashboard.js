import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";
import Chart from 'chart.js/auto';

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
  const assignedUserIds = new Set(
    concernTicketDetails
      .map(detail => detail.assigned_user_id)
      .filter(Boolean)
      .map(String)
  );
  const eligibleUsers = (concernTicket.eligible_users || []).filter(user => (
    assignedUserIds.has(String(user.id))
  ));

  const userMap = {};
  eligibleUsers.forEach(u => { userMap[u.id] = u.first_name; });

  const userStatusCounts = {};
  Object.keys(userMap).forEach(userId => {
    userStatusCounts[userId] = { open: 0, processing: 0, verification: 0, closed: 0, hold: 0 };
  });

  concernTicketDetails.forEach((detail) => {
    const userId = detail.assigned_user_id;
    if (userStatusCounts[userId]) {
      // If is_held is true, only increment hold and skip all other statuses
      if (detail.data && detail.data.is_held === "true") {
        userStatusCounts[userId].hold++;
        return;
      }
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
  const holdCounts = userIds.map(uid => userStatusCounts[uid].hold);

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
        },
        {
          label: 'Hold',
          data: holdCounts,
          backgroundColor: 'rgb(15, 0, 15)'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        x: {
          stacked: true,
          beginAtZero: true,
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

function createConcernFromChart(concernTicket) {
  const concernFromCounts = {};
  const concernFromColors = [
    'rgb(20, 145, 130)',
    'rgb(54, 125, 190)',
    'rgb(235, 145, 52)',
    'rgb(190, 75, 90)',
    'rgb(125, 95, 180)',
    'rgb(95, 145, 65)',
    'rgb(205, 175, 45)',
    'rgb(65, 155, 175)'
  ];
  (concernTicket.concern_ticket_details || []).forEach((detail) => {
    const concernFrom = detail.concern_from || 'Unspecified';
    concernFromCounts[concernFrom] = (concernFromCounts[concernFrom] || 0) + 1;
  });

  const canvas = document.getElementById('concern-from-bar-chart');
  if (!canvas) return;

  if (chartInstances['concernFrom']) {
    chartInstances['concernFrom'].destroy();
  }

  chartInstances['concernFrom'] = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: Object.keys(concernFromCounts),
      datasets: [{
        label: 'Tickets',
        data: Object.values(concernFromCounts),
        backgroundColor: Object.keys(concernFromCounts).map((_, index) => (
          concernFromColors[index % concernFromColors.length]
        ))
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });
}

function createTicketTotalLineChart(concernTicket, period, today) {
  const ticketsByDate = {};
  const currentYear = today.slice(0, 4);
  const currentMonth = today.slice(0, 7);
  const monthStart = new Date(`${currentMonth}-01T00:00:00Z`);
  const nextMonthStart = new Date(Date.UTC(
    monthStart.getUTCFullYear(),
    monthStart.getUTCMonth() + 1,
    1
  ));
  const monthEnd = new Date(nextMonthStart);
  monthEnd.setUTCDate(monthEnd.getUTCDate() - 1);
  const dates = [];
  const labels = [];

  if (period === 'monthly') {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    for (let month = 0; month < 12; month++) {
      dates.push(`${currentYear}-${String(month + 1).padStart(2, '0')}`);
      labels.push(monthNames[month]);
      ticketsByDate[dates[month]] = 0;
    }
  } else if (period === 'weekly') {
    const weekStart = new Date(monthStart);
    weekStart.setUTCDate(weekStart.getUTCDate() - ((weekStart.getUTCDay() + 6) % 7));
    while (weekStart <= monthEnd) {
      const bucket = weekStart.toISOString().slice(0, 10);
      const weekEnd = new Date(weekStart);
      weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
      dates.push(bucket);
      labels.push(`${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}`);
      ticketsByDate[bucket] = 0;
      weekStart.setUTCDate(weekStart.getUTCDate() + 7);
    }
  } else if (period === 'hourly') {
    for (let hour = 0; hour < 24; hour++) {
      const bucket = String(hour).padStart(2, '0');
      dates.push(bucket);
      labels.push(`${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`);
      ticketsByDate[bucket] = 0;
    }
  }

  (concernTicket.concern_ticket_details || []).forEach((detail) => {
    const createdAtDate = detail.created_at_date;
    if (!createdAtDate) return;

    let bucket;
    if (period === 'yearly') {
      bucket = createdAtDate.slice(0, 4);
    } else if (period === 'monthly') {
      if (createdAtDate.slice(0, 4) !== currentYear) return;
      bucket = createdAtDate.slice(0, 7);
    } else if (period === 'weekly') {
      if (createdAtDate.slice(0, 7) !== currentMonth) return;
      const date = new Date(`${createdAtDate}T00:00:00Z`);
      date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
      bucket = date.toISOString().slice(0, 10);
    } else {
      if (createdAtDate !== today) return;
      bucket = detail.created_at_hour?.slice(11, 13);
    }

    if (bucket) {
      if (period === 'yearly' && !Object.hasOwn(ticketsByDate, bucket)) {
        ticketsByDate[bucket] = 0;
        dates.push(bucket);
      }
      if (Object.hasOwn(ticketsByDate, bucket)) ticketsByDate[bucket]++;
    }
  });

  if (period === 'yearly') dates.sort();
  const canvas = document.getElementById('ticket-total-line-chart');
  if (!canvas) return;

  if (chartInstances['ticketTotals']) {
    chartInstances['ticketTotals'].destroy();
  }

  chartInstances['ticketTotals'] = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: period === 'yearly' ? dates : labels,
      datasets: [{
        label: `Total Tickets (${period})`,
        data: dates.map(date => ticketsByDate[date]),
        borderColor: 'rgb(20, 115, 145)',
        backgroundColor: 'rgba(20, 115, 145, 0.16)',
        pointBackgroundColor: 'rgb(20, 115, 145)',
        fill: true,
        tension: 0.25
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });
}

function findConcernTicket(concernTickets, ticketId) {
  return concernTickets.find(ticket => String(ticket.id) === String(ticketId));
}

function renderFilteredCharts(concernTickets, concernTypes, ticketId, startDate, endDate) {
  const ticket = findConcernTicket(concernTickets, ticketId);
  if (!ticket) return;

  const filteredTicket = {
    ...ticket,
    concern_ticket_details: (ticket.concern_ticket_details || []).filter((detail) => {
      const createdAtDate = detail.created_at_date;
      return (!startDate || createdAtDate >= startDate) && (!endDate || createdAtDate <= endDate);
    })
  };

  createPieChart(filteredTicket, concernTypes);
  createBarChart(filteredTicket);
  createConcernFromChart(filteredTicket);
}

function renderTicketTotalLineChart(concernTickets, ticketId, period, today) {
  const ticket = findConcernTicket(concernTickets, ticketId);
  if (ticket) createTicketTotalLineChart(ticket, period, today);
}

var init = function(config) {
  $(function() {
    const concernTickets = config.concernTickets || [];
    const concernTypes = config.concernTypes || [];
    if (concernTickets.length === 0) return;

    const selectedTicketId = () => $('#concern-ticket-select').val() || concernTickets[0].id;
    const renderFilteredSelectedCharts = () => {
      renderFilteredCharts(
        concernTickets,
        concernTypes,
        selectedTicketId(),
        $('#chart-start-date').val(),
        $('#chart-end-date').val()
      );
    };
    const renderSelectedLineChart = () => {
      renderTicketTotalLineChart(
        concernTickets,
        selectedTicketId(),
        $('#ticket-total-period').val() || 'yearly',
        $('#ticket-total-period').data('today')
      );
    };
    const renderAllSelectedCharts = () => {
      renderFilteredSelectedCharts();
      renderSelectedLineChart();
    };

    renderAllSelectedCharts();

    $('#concern-ticket-select').on('change', renderAllSelectedCharts);
    $('#chart-start-date, #chart-end-date').on('change', renderFilteredSelectedCharts);
    $('#ticket-total-period').on('change', renderSelectedLineChart);
  });
};

export default { init: init };