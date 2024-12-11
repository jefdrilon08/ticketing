var _data;

var fontSizeDefault   = 9;
var fillColorDefault  = '#fff1c7';

var styleDefault = {
  fontSize: 7
}

var styleBoldDefault = {
  fontSize: 9,
  bold: true
}

var styleEmphDefault = {
  fontSize: 9,
  bold: true,
  italics: true
}

var styleEmphSecondary = {
  fontSize: 7,
  bold: true,
  italics: true
}

var styleSmall = {
  fontSize: 7
}

var styleSectionHeader = {
  fontSize: 9,
  bold: true,
  margin: [0, 0, 0, 10]
}

var styleCellLabel = {
  fontSize: 7
}

var styleCellValue = {
  fontSize: 7,
  bold: true
}

var styleCellCenteredLabel = {
  fontSize: 7,
  fillColor: fillColorDefault,
  alignment: 'center',
  bold: true
}

var buildHeader = function() {
  var logo                  = 'data:image/png;base64,' + _data.logo;
  var profilePicture        = 'data:image/png;base64,' + _data.profile_picture;

  var header = {
    margin: 20,
    columns: [
      {
        width: '100%',
        columns: [
          {
            image: logo,
            fit: [65, 65],
            width: '25%',
            alignment: 'center'
          },
          {
            wdith: '*',
            text: [
              { text: 'Kabuhayan sa Ganap na Kasarinlan Credit and Savings Cooperative\n', style: styleBoldDefault },
              { text: '4th Floor KMBA Members’ Center Building\n', style: styleSmall },
              { text: '5 Matimpiin Street, Barangay Pinyahan, Quezon City 1100\n', style: styleSmall },
              { text: 'Telephone Numbers: (632) 5310-2470/8442-9607; Fax Number: (632) 5310-2470 loc. 204\n', style: styleSmall },
              { text: 'CDA Reg. No.: 9520-1016000000028521\n', style: styleEmphDefault },
              { text: 'CIN: 16201628521\n', style: styleEmphSecondary }
            ]
          },
          {
            image: profilePicture,
            fit: [60, 60],
            alignment: 'right'
          }
        ]
      }
    ]
  }

  return header;
}

var buildLoanDetailsBody = function() {

  var body  = [
                [
                  { text: "1. Halaga ng hiniram", style: styleCellLabel, border: [false, false, false, false] },
                  { text: " ", border: [false, false, false, false] },
                  { text: _data.principal, style: styleCellValue, border: [false, false, false, false], alignment: 'right' },
                  { text: "", border: [false, false, false, false] }
                ],
                [
                  { text: "2. Mga kaltas", style: styleCellLabel, border: [false, false, false, false] },
                  { text: " ", border: [false, false, false, false] },
                  { text: " ", style: styleCellValue, border: [false, false, false, false], alignment: 'right' },
                  { text: " ", border: [false, false, false, false] }
                ]
              ];

  _data.deductions.forEach(function(o) {
    console.log(o);
    body.push([
      { text: "\t\u200B\t\u200B\t\u200B\t\u200B\t\u200B" + o.name, style: styleCellLabel, border: [false, false, false, false] },
      { text: " ", border: [false, false, false, false] },
      { text: o.amount, style: styleCellValue, border: [false, false, false, false], alignment: 'justify' },
      { text: "", border: [false, false, false, false] }
    ]);
  });

  body.push([
    { text: "3. Kabuuang halaga na natanggap", style: styleCellLabel, border: [false, false, false, false] },
    { text: " ", border: [false, false, false, false] },
    { text: _data.amount_released, style: styleCellValue, border: [false, false, false, false], alignment: 'right' },
    { text: "", border: [false, false, false, false] }
  ]);

  body.push([
    { text: "4. Effective Interest Rate", style: styleCellLabel, border: [false, false, false, false] },
    { text: " ", border: [false, false, false, false] },
    { text: " ", style: styleCellValue, border: [false, false, false, false], alignment: 'right' },
    { text: "", border: [false, false, false, false] }
  ]);

  body.push([
    { text: "\t\u200B\t\u200B\t\u200B\t\u200B\t\u200BBuwanang Interest Rate\n\t\u200B\t\u200B\t\u200B\t\u200B\t\u200BLoan Term\n\t\u200B\t\u200B\t\u200B\t\u200B\t\u200BMode of Payment\n\t\u200B\t\u200B\t\u200B\t\u200B\t\u200BWeekly Payments\n\t\u200B\t\u200B\t\u200B\t\u200B\t\u200BDate of First Payment\n\t\u200B\t\u200B\t\u200B\t\u200B\t\u200BMaturity Date", style: styleCellLabel, border: [false, false, false, false] },
    { text: _data.interest_rate + "%\n" + _data.term + "\n" + _data.mode_of_payment + "\n" + _data.weekly_payments + "\n" + " " + "\n" + " ", style: styleCellValue, border: [false, false, false, false], alignment: 'justify' },
    { text: " ", border: [false, false, false, false] },
    { text: " ", border: [false, false, false, false] }
  ])

  body.push([
    { text: "5. Maintaining Balance", style: styleCellLabel, border: [false, false, false, false] },
    { text: _data.maintaining_balance, style: styleCellValue, border: [false, false, false, false], alignment: 'right' },
    { text: " ", border: [false, false, false, false] },
    { text: "", border: [ false, false, false, false] }
  ]);

  return body;
}

var build = function() {
  var coMakerProfilePicture         = 'data:image/png;base64,' + _data.comaker_profile_picture;
  var coMakerRelativeProfilePicture = 'data:image/png;base64,' + _data.comaker_relative_profile_picture;

  var docDefinition = {
    pageSize: 'LEGAL',
    pageMargins: [20, 80, 20, 60],
    header: (currentPage, pageCount) => {
      if(currentPage == 1) {
        return buildHeader()
      } else {
        return ""
      }
    },
    content: [
      {
        text: 'LOAN APPLICATION FORM\n(' + _data.category + ')', style: { bold: true, alignment: 'center' }
      },
      {
        table: {
          margin: [0, 0, 0, 0],
          widths: ["50%", "50%"],
          body: [
            [
              { text: "PN Number: " + _data.pn_number, style: { bold: true, fontSize: 11 }, border: [false, false, false, false] },
              { text: "Petsa: ____________", style: styleCellValue, alignment: 'right', border: [false, false, false, false] }
            ]
          ]
        }
      },
      {
        table: {
          margin: [0, 0, 0, 0],
          widths: ["15%", "85%"],
          body: [
            [
              { text: "Pangalan\nID Number / Sentro\nTirahan\nKlase ng Loan\nUri ng Negosyo", style: styleCellLabel, border: [false, false, false, false] },
              { text: _data.full_name + '\n' + _data.id_number + '-' + _data.center + '\n' + _data.address + '\n' + _data.loan_product + '\n' + _data.project_type, style: styleCellValue, border: [false, false, false, false] }
            ]
          ]
        }
      },
      {
        table: {
          margin: [0, 0, 0, 0],
          widths: ["20%", "20%", "30%", "30%"],
          body: buildLoanDetailsBody()
        }
      },
      {
        text: '\n\nREKOMENDASYON NG SENTRO\n\n\n',
        style: styleCellValue
      },
      {
        table: {
          margin: [0, 0, 0, 0],
          widths: ["33%", "33%", "33%"],
          body: [
            [
              { text: "____________________________________", style: styleCellLabel, border: [false, false, false, false], alignment: 'center' },
              { text: "____________________________________", style: styleCellLabel, border: [false, false, false, false], alignment: 'center' },
              { text: "____________________________________", style: styleCellLabel, border: [false, false, false, false], alignment: 'center' }
            ],
            [
              { text: "Pangalan at Lagda ng Secretary", style: styleCellLabel, border: [false, false, false, false], alignment: 'center' },
              { text: "Pangalan at Lagda ng Treasurer", style: styleCellLabel, border: [false, false, false, false], alignment: 'center' },
              { text: "Pangalan at Lagda ng Center Chief", style: styleCellLabel, border: [false, false, false, false], alignment: 'center' }
            ]
          ]
        }
      },
      {
        text: '\nPAGPROSESO NG UTANG\n\n\n',
        style: styleCellValue
      },
      {
        table: {
          margin: [0, 0, 0, 0],
          widths: ["33%", "33%", "33%"],
          body: [
            [
              { text: "____________________________________", style: styleCellLabel, border: [false, false, false, false], alignment: 'center' },
              { text: "____________________________________", style: styleCellLabel, border: [false, false, false, false], alignment: 'center' },
              { text: "____________________________________", style: styleCellLabel, border: [false, false, false, false], alignment: 'center' }
            ],
            [
              { text: "Pangalan at Lagda ng SO", style: styleCellLabel, border: [false, false, false, false], alignment: 'center' },
              { text: "Pangalan at Lagda ng SOM", style: styleCellLabel, border: [false, false, false, false], alignment: 'center' },
              { text: "Pangalan at Lagda ng SCCO", style: styleCellLabel, border: [false, false, false, false], alignment: 'center' }
            ]
          ]
        }
      },
      {
        text: '\nPAGTANGGAP NG LOAN NG MIYEMBRO\n\n\n',
        style: styleCellValue
      },
      {
        table: {
          margin: [0, 0, 0, 0],
          widths: ["25%", "25%", "25%", "25%"],
          body: [
            [
              { text: _data.full_name, style: styleCellValue, border: [false, false, false, false], alignment: 'center', decoration: 'underline', decorationStyle: 'solid', decorationColor: 'black' },
              { text: "____________________", style: styleCellLabel, border: [false, false, false, false] },
              { text: "____________________", style: styleCellLabel, border: [false, false, false, false] },
              { text: "____________________", style: styleCellLabel, border: [false, false, false, false] }
            ],
            [
              { text: 'Pangalan at Lagda ng Miyembro\n\n', style: styleCellLabel, border: [false, false, false, false], alignment: 'center' },
              { text: 'Petsa\n\n', style: styleCellLabel, border: [false, false, false, false] },
              { text: 'Date Released\n\n', style: styleCellLabel, border: [false, false, false, false] },
              { text: 'First Payment\n\n', style: styleCellLabel, border: [false, false, false, false] }
            ]
          ]
        }
      },
      {
        table: {
          margin: [0, 0, 0, 0],
          widths: ["100%"],
          style: { fontSize: fontSizeDefault },
          body: [
            [
              { text: 'KASUNDUAN', style: { bold: true }, alignment: 'justify', border: [true, true, true, false] }
            ],
            [
              { 
                text: [
                  { text: 'Ako na nakihiram ng ', style: styleCellLabel },
                  { text: _data.principal, style: styleCellValue },
                  { text: ' sa Kasagana-ka Coop ay nangangako sa mga sumusunod:', style: styleCellLabel }
                ],
                border: [true, false, true, false]
              }
            ],
            [
              {
                ol: [
                  { 
                    text: [
                      { text: 'Bayaran ko ang nasabing halaga, kasama ang interes na (', style: styleCellLabel },
                      { text: _data.interest, style: styleCellValue },
                      { text: '), sa pamamagitan ng paghulog linggo-linggo na di bababa sa (', style: styleCellLabel },
                      { text: _data.weekly_payments, style: styleCellValue },
                      { text: '), simula sa (______________) hanggang sa (______________)', style: styleCellLabel }
                    ],
                  },
                  {
                    text: 'Ako ay laging mag-iimpok na hindi bababa sa (_________) kada linggo', style: styleCellLabel
                  },
                  {
                    text: 'Ako ay magbabayad sa aking guarantor o co-maker kung aabonohan niya ang hulog ko. Naiintindihan ko na maari niya akong ireklamo sa barangay o hukuman kung hindi ko siya mababayaran', style: styleCellLabel
                  },
                  {
                    text: [
                      { text: 'Kapag ako ay hindi nakabayad sa takdang panahon, pumapayag ako na ipagamit sa ', style: styleCellLabel },
                      { text: 'Kasagana-ka Coop ', style: styleCellValue },
                      { text: 'ang anumang pondo na aking naipon bilang pambayad sa utang sa ', style: styleCellLabel },
                      { text: 'Kasagana-ka Coop.', style: styleCellValue },
                    ],
                    style: { fontSize: fontSizeDefault }
                  },
                  {
                    text: [
                      { text: 'Ako ay pumapayag na mag-iwan at hindi ma-withdraw ang savings ko sa halagang (' + _data.loan_product_maintaining_balance_percentage + '%) ng kasalukuyang utang ko sa ', style: styleCellLabel },
                      { text: 'Kasagana-ka Coop.', style: styleCellValue }
                    ],
                    style: { fontSize: fontSizeDefault }
                  },
                  {
                    text: [
                      { text: 'Ako ay pumapayag na sumama sa ', style: styleCellLabel },
                      { text: 'SIT-DOWN', style: styleCellValue },
                      { text: ' at magpa ', style: styleCellLabel },
                      { text: 'SIT-DOWN', style: styleCellValue },
                      { text: ' sa panahon na ako ay hindi makahulog sa takdang oras', style: styleCellLabel }
                    ],
                    style: { fontSize: fontSizeDefault }
                  },
                  {
                    text: [
                      { text: 'Pumapayag ako na maireklamo o maihabla ng ', style: styleCellLabel },
                      { text: 'Kasagana-ka Coop', style: styleCellValue },
                      { text: ' sa nararapat na hukuman kung hindi ko masunod ang laman ng kasunduang ito. Kung sakaling mangyari ito at pumayag ako na bayaran lahat ng gastos sa pagsampa at pagdidinig ng kaso.', style: styleCellLabel }
                    ]
                  }
                ],
                style: styleCellLabel,
                border: [true, false, true, false]
              }
            ],
            [
              {
                text: [
                  { text: 'Sa aking paglagda sa ibaba, aking naiintindihan at pinahihintulutan na iproseso ng ', style: styleCellLabel },
                  { text: 'K-Coop', style: styleCellValue },
                  { text: ' ang mga impormasyon sa form na ito alinsunod sa RA No. 10173 o Data Privacy Act.\n\n\n', border: [true, false, true, false], style: styleCellLabel }
                ],
                style: styleCellLabel,
                border: [true, false, true, false]
              }
            ],
            [
              {
                columns: [
                  { text: _data.full_name, style: styleCellValue, border: [false, false, false, false], alignment: 'center', decoration: 'underline', decorationStyle: 'solid', decorationColor: 'black' },
                  { text: _data.spouse, style: styleCellValue, border: [false, false, false, false], alignment: 'center', decoration: 'underline', decorationStyle: 'solid', decorationColor: 'black' }
                ],
                border: [true, false, true, false]
              }
            ],
            [
              {
                columns: [
                  { text: 'Pangalan at Lagda ng Miyembro', style: styleCellLabel, border: [false, false, false, false], alignment: 'center' },
                  { text: 'Pangalan at Lagda ng Asawa ng Miyembro', style: styleCellLabel, border: [false, false, false, false], alignment: 'center' }
                ],
                border: [true, false, true, true]
              }
            ],
            [
              {
                text: [
                  { text: 'Kami na nasa hustong gulang ay nangangakong susubaybayan ang negosyo ni (', style: styleCellLabel },
                  { text: _data.full_name, style: styleCellValue },
                  { text: ') bilang kanyang co-maker o guarantor. Kapag hindi siya nakapaghulog sa takdang oras ay babayaran ko ang kaniyang hulog kasama ang interes sa ', style: styleCellLabel },
                  { text: 'Kasagana-ka Coop.\n\n\n\n\n', style: styleCellValue }
                ],
                style: { fontSize: fontSizeDefault },
                border: [true, false, true, false]
              }
            ],
            [
              {
                columns: [
                  {
                    text: [
                      { text: _data.co_maker_two, style: styleCellValue, decoration: 'underline', alignment: 'center' },
                      { text: '\nPangalan at Lagda', style: styleCellLabel, alignment: 'center' },
                      { text: '\n(Kamag-Anak)', style: styleCellLabel, alignment: 'center' },
                      { text: '\n\n\n' + _data.co_maker_one, style: styleCellLabel, decoration: 'underline', alignment: 'center' },
                      { text: '\nPangalan at Lagda', style: styleCellLabel, alignment: 'center' },
                      { text: '\n(Kasamahan sa Sentro)', style: styleCellLabel, alignment: 'center' }
                    ]
                  },
                  {
                    text: [
                      { text: ' ', style: styleCellValue, alignment: 'center' },
                      { text: '\n', style: styleCellLabel, alignment: 'center' },
                      { text: '\n', style: styleCellLabel, alignment: 'center' },
                      { text: '\n\n\n_______________________', style: styleCellLabel, decoration: 'underline', alignment: 'center' },
                      { text: '\nPangalan at Lagda', style: styleCellLabel, alignment: 'center' },
                      { text: '\n(Asawa ng Kasamahan sa Sentro)', style: styleCellLabel, alignment: 'center' }
                    ]
                  },
                  {
                    columns: [
                      {
                        stack: [
                          {
                            image: coMakerProfilePicture,
                            fit: [60, 60],
                            alignment: 'center'
                          },
                          {
                            text: 'Kasamahan sa Sentro', style: styleCellValue, alignment: 'center'
                          }
                        ]
                      },
                      {
                        stack: [
                          {
                            image: coMakerRelativeProfilePicture,
                            fit: [60, 60],
                            alignment: 'center'
                          },
                          {
                            text: 'Kamag-anak', style: styleCellValue, alignment: 'center'
                          }
                        ]
                      }
                    ]
                  }
                ],
                border: [true, false, true, true]
              }
            ]
          ]
        }
      }
    ]
  }

  return docDefinition;
}

var execute = function(data) {
  _data = data;

  return build();
}

export default { execute: execute }
