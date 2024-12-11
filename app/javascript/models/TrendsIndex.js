import Mustache from "mustache";
import $ from "jquery";
import select2 from 'select2';
select2($);
import "chart.js/dist/chart.min.js";

var $btnSync;
var $selectYear;
var $selectBranches;
var $selectAccountingCode;
var $selectChartType;
var $xFormControl;

var $message;
var templateErrorList;
var templateSuccessMessage;

var _chartType = 'line';

var _urlSync;
var _userId;
var _xKoinsAppAuthSecret;

var ctxAccountingBalance;
var chartAccountingBalance;

var ctxPureSavers;
var chartPureSavers;

var ctxActiveLoaners;
var chartActiveLoaners;

var ctxActiveMembers;
var chartActiveMembers;

var ctxTotalMembers;
var chartTotalMembers;

var _cacheDom = function() {
  $btnSync              = $("#btn-sync");
  $selectYear           = $("#select-year");
  $selectBranches       = $("#select-branches");
  $selectAccountingCode = $("#select-accounting-code");
  $selectChartType      = $("#select-chart-type");
  $xFormControl         = $(".x-form-control");

  $message                = $(".message");
  templateErrorList       = $("#template-error-list").html();
  templateSuccessMessage  = $("#template-success-message").html();

  ctxAccountingBalance  = document.getElementById('chart-accounting-balance').getContext('2d');
  ctxPureSavers         = document.getElementById('chart-pure-savers').getContext('2d');
  ctxActiveLoaners      = document.getElementById('chart-active-loaners').getContext('2d');
  ctxActiveMembers      = document.getElementById('chart-active-members').getContext('2d');
  ctxTotalMembers       = document.getElementById('chart-total-members').getContext('2d');
};

var _clearCharts = function() {
  chartAccountingBalance.data.datasets  = [];
  chartPureSavers.data.datasets         = [];
  chartActiveLoaners.data.datasets      = [];
  chartActiveMembers.data.datasets      = [];
  chartTotalMembers.data.datasets       = [];

  chartAccountingBalance.update();
  chartPureSavers.update();
  chartActiveLoaners.update();
  chartActiveMembers.update();
  chartTotalMembers.update();
};

var _updateData = function(data) {
  chartAccountingBalance.data.datasets = [];

  data.accounting_code_balances.forEach(function(d) {
    d.borderColor     = d.color;
    d.backgroundColor = d.color;
    d.lineTension     = 0;
    d.fill            = false;

    chartAccountingBalance.data.datasets.push(d);
  });

  chartAccountingBalance.update();

  data.pure_savers.forEach(function(d) {
    d.borderColor     = d.color;
    d.backgroundColor = d.color;
    d.lineTension     = 0;
    d.fill            = false;

    chartPureSavers.data.datasets.push(d);
  });

  chartPureSavers.update();

  data.loaners.forEach(function(d) {
    d.borderColor     = d.color;
    d.backgroundColor = d.color;
    d.lineTension     = 0;
    d.fill            = false;

    chartActiveLoaners.data.datasets.push(d);
  });

  chartActiveLoaners.update();

  data.active_members.forEach(function(d) {
    d.borderColor     = d.color;
    d.backgroundColor = d.color;
    d.lineTension     = 0;
    d.fill            = false;

    chartActiveMembers.data.datasets.push(d);
  });

  chartActiveMembers.update();

  data.total_members.forEach(function(d) {
    d.borderColor     = d.color;
    d.backgroundColor = d.color;
    d.lineTension     = 0;
    d.fill            = false;

    chartTotalMembers.data.datasets.push(d);
  });

  chartTotalMembers.update();
}

var _reloadCharts = function() {
  chartTotalMembers = new Chart(ctxTotalMembers, {
                        type: _chartType,
                        data: {
                          labels: [
                            'January',
                            'February',
                            'March',
                            'April',
                            'May',
                            'June',
                            'July',
                            'August',
                            'September',
                            'October',
                            'November',
                            'December'
                          ],
                          datasets: []
                        },
                        options: {
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            yAxes: [{
                              ticks: {
                                beginAtZero: true,
                                userCallback: function(value, index, values) {
                                  return value.toLocaleString();
                                }
                              }
                            }]
                          }
                        }
                      });

  chartActiveMembers  = new Chart(ctxActiveMembers, {
                          type: _chartType,
                          data: {
                            labels: [
                              'January',
                              'February',
                              'March',
                              'April',
                              'May',
                              'June',
                              'July',
                              'August',
                              'September',
                              'October',
                              'November',
                              'December'
                            ],
                            datasets: []
                          },
                          options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              yAxes: [{
                                ticks: {
                                  beginAtZero: true,
                                  userCallback: function(value, index, values) {
                                    return value.toLocaleString();
                                  }
                                }
                              }]
                            }
                          }
                        });

  chartActiveLoaners  = new Chart(ctxActiveLoaners, {
                          type: _chartType,
                          data: {
                            labels: [
                              'January',
                              'February',
                              'March',
                              'April',
                              'May',
                              'June',
                              'July',
                              'August',
                              'September',
                              'October',
                              'November',
                              'December'
                            ],
                            datasets: []
                          },
                          options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              yAxes: [{
                                ticks: {
                                  beginAtZero: true,
                                  userCallback: function(value, index, values) {
                                    return value.toLocaleString();
                                  }
                                }
                              }]
                            }
                          }
                        });

  chartPureSavers = new Chart(ctxPureSavers, {
                      type: _chartType,
                      data: {
                        labels: [
                          'January',
                          'February',
                          'March',
                          'April',
                          'May',
                          'June',
                          'July',
                          'August',
                          'September',
                          'October',
                          'November',
                          'December'
                        ],
                        datasets: []
                      },
                      options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          yAxes: [{
                            ticks: {
                              beginAtZero: true,
                              userCallback: function(value, index, values) {
                                return value.toLocaleString();
                              }
                            }
                          }]
                        }
                      }
                    });

  chartAccountingBalance  = new Chart(ctxAccountingBalance, {
                              type: _chartType,
                              data: {
                                labels: [
                                  'January',
                                  'February',
                                  'March',
                                  'April',
                                  'May',
                                  'June',
                                  'July',
                                  'August',
                                  'September',
                                  'October',
                                  'November',
                                  'December'
                                ],
                                datasets: []
                              },
                              options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                  yAxes: [{
                                    ticks: {
                                      beginAtZero: true,
                                      userCallback: function(value, index, values) {
                                        return value.toLocaleString();
                                      }
                                    }
                                  }]
                                }
                              }
                            });
};

var _bindEvents = function() {
  _reloadCharts();

  $selectChartType.on("change", function() {
    _chartType = $selectChartType.val();
    _reloadCharts();
  });

  $selectBranches.select2();

  $btnSync.on("click", function() {
    var branchIds         = $selectBranches.val();
    var accountingCodeId  = $selectAccountingCode.val();
    var year              = $selectYear.val();

    var data = {
      branch_ids:         branchIds,
      accounting_code_id: accountingCodeId,
      year:               year,
      user_id:            _userId
    }

    $xFormControl.prop("disabled", true);
    $message.html("Loading...");

    _clearCharts();

    $.ajax({
      url: _urlSync,
      method: 'GET',
      headers: {
        'X-KOINS-APP-AUTH-SECRET': _xKoinsAppAuthSecret,
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      data: data,
      success: function(response) {
        console.log(response);

        $message.html(
          Mustache.render(
            templateSuccessMessage,
            { message: "Success! Data generated!" }
          )
        );

        $xFormControl.prop("disabled", false);

        _updateData(response.data);
      },
      error: function(response) {
        console.log(response.responseText);
        var errors  = [];

        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          console.log(err);
          errors  = ["Something went wrong"];
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $xFormControl.prop("disabled", false);
        }
      }
    });
  });
};

var init = function(options) {
  _urlSync              = options.urlSync;
  _userId               = options.userId;
  _xKoinsAppAuthSecret  = options.xKoinsAppAuthSecret;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
