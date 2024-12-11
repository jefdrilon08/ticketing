var _data;

var fontSizeDefault   = 9;
var fillColorDefault  = '#fff1c7';

var styleDefault = {
  fontSize: 9
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
  fontSize: 7,
  fillColor: fillColorDefault
}

var styleCellValue = {
  fontSize: 7
}

var styleCellCenteredLabel = {
  fontSize: 7,
  fillColor: fillColorDefault,
  alignment: 'center',
  bold: true
}

var _generateApplicationSignatory = function() {
  var context = 'Aking pinatotohanan na ang lahat ng impormasyong aking inilagay ay pawang katotohanan sa abot ng aking paniniwala at kaalaman. Anumang maling impormasyon, pagtatago o kasinungalingan ay magiging sapat na dahilan para ako ay matiwalag sa pagiging miyembro ng K-Coop.\n\n'

  context += 'Bilang miyembro ay kinikilala at pinapahintulutan ko ang mga sumusunod:\n';

  var obj = {
    table: {
      margin: [0, 20, 0, 0],
      widths: ["100%"],
      body: [
        [
          { text: context, style: styleCellValue, alignment: 'justify', border: [true, true, true, false] }
        ],
        [
          { 
            ol: [ 
              'Kaakibat ng aking aplikasyon sa pagiging miyembro, aking pinahihintulutan ang pag-kolekta at pag-proseso ng aking mga impormasyon alinsunod sa R.A. No. 10173 o Data Privacy Act of 2012.',
              'Regular na pagpapasa at pagpapahayag ng aking Basic Credit Data alinsunod sa R.A. No. 9510 o “Credit Information System Act” s a Credit Information Corporation (CIC) pati ang mga pagbabago o pagtatama nito;',
              'Pagbabahagi ng aking Basic Credit Data sa iba pang institusyong nagpapautang at iba pang mga ahensiya na may kinalaman sa pagpapautang na pinahihintulutan ng R.A. No. 10173 at R.A. No. 9510.'
            ], 
            style: styleCellValue,
            border: [true, false, true, false]
          }
        ],
        [
          {
            text: 'Nauunawaan ko din ang polisiya ng K-Coop at handa akong sumunod sa mga alintuntunin nito gaya ng mga sumusunod:',
            style: styleCellValue,
            alignment: 'justify',
            border: [true, false, true, false]
          }
        ],
        [
          {
            ol: [
              'Pagdalo sa meeting',
              'Pagsama sa sitdown',
              'Pagpayag masitdown',
              'Pagsunod sa 1 day before meeting policy sa paghuhulog',
              'Pag-iimpok linggu-linggo',
              'Pagpapamiyembro sa K-MBAA',
              'Pagtupad sa obligasyon sa co-maker'
            ],
            style: styleCellValue,
            border: [true, false, true, false]
          }
        ],
        [
          {
            table: {
              margin: [0, 0, 0, 0],
              widths: ["50%", "50%"],
              body: [
                [
                  { text: '', border: [false, false, false, false] },
                  {
                    text: _data.full_name, border: [false, false, false, false], style: styleBoldDefault, alignment: 'center'
                  }
                ],
                [
                  { text: '', border: [false, false, false, false] },
                  {
                    text: 'Pangalan at Lagda ng Aplikante', border: [false, true, false, false], style: styleBoldDefault, alignment: 'center'
                  }
                ]
              ]
            },
            style: styleCellValue,
            border: [true, false, true, true]
          }
        ]
      ]
    },
    pageBreak: "after"
  }

  return obj;
}

var _generateChildrenTable  = function() {
  var body = [
    [
      {
        text: 'PERSONAL NA IMPORMASYON NG MGA ANAK',
        style: styleCellCenteredLabel,
        colSpan: 6
      }, {}, {}, {}, {}, {}
    ]
  ];

  body.push([
    {
      text: '#', style: styleCellCenteredLabel
    },
    {
      text: 'PANGALAN', style: styleCellCenteredLabel
    },
    {
      text: 'KAPANGANAKAN', style: styleCellCenteredLabel
    },
    {
      text: 'EDAD', style: styleCellCenteredLabel
    },
    {
      text: 'ANTAS NG PAG-AARAL', style: styleCellCenteredLabel
    },
    {
      text: 'KURSO', style: styleCellCenteredLabel
    }
  ]);

  for(var i = 0; i < 5; i++) {
    var obj = _data.children[i];

    body.push([
      { text: '' + (i + 1), style: styleCellCenteredLabel },
      { text: obj.name, style: styleCellValue },
      { text: obj.date_of_birth, style: styleCellValue },
      { text: obj.age, style: styleCellValue },
      { text: obj.education, style: styleCellValue },
      { text: obj.course, style: styleCellValue }
    ])
  }

  var table = {
    margin: [0, 0, 0, 0],
    widths: ["5%", "40%", "15%", "5%", "20%", "15%"],
    body: body
  }

  return table;
}

var buildHeader = function() {
  var logo            = 'data:image/png;base64,' + _data.logo;
  var profilePicture  = 'data:image/png;base64,' + _data.profile_picture;

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

var build = function() {
  var docDefinition = {
    pageSize: 'FOLIO',
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
        text: 'APPLICATION FOR MEMBERSHIP', style: { bold: true, alignment: 'center' }
      },
      {
        text: [
          { text: 'Control No.', style: { fontSize: fontSizeDefault, alignment: 'right' } },
          { text: _data.control_number, decoration: 'underline', style: { fontSize: fontSizeDefault, alignment: 'right' } }
        ]
      },
      {
        text: 'SASAGUTIN NG K-COOP', style: styleSectionHeader, margin: [0, 0, 0, 8]
      },
      {
        table: {
          margin: [0, 0, 0, 8],
          widths: ["25%", "25%", "25%", "25%"],
          body: [
            [
              {
                text: 'MEMBER / ID NUMBER', style: styleCellLabel
              },
              {
                text: _data.identification_number, style: styleCellValue
              },
              {
                text: 'DATE OF MEMBERSHIP', style: styleCellLabel
              },
              {
                text: '', style: styleCellValue
              }
            ],
            [
              {
                text: 'INITIAL SHARE CAPITAL', style: styleCellLabel
              },
              {
                text: '', style: styleCellValue
              },
              {
                text: 'MEMBERSHIP FEE', style: styleCellLabel
              },
              {
                text: '', style: styleCellValue
              }
            ],
            [
              {
                text: 'SATELLITE OFFICE', style: styleCellLabel
              },
              {
                text: _data.branch,
                colSpan: 3,
                style: styleCellValue
              },
              {},
              {}
            ]
          ]
        }
      },
      {
        text: 'SASAGUTIN NG APLIKANTE', style: styleSectionHeader, margin: [0, 8, 0, 8]
      },
      {
        table: {
          margin: [0, 0, 0, 0],
          widths: ["12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%"],
          body: [
            [
              { text: 'PERSONAL NA IMPORMASYON', style: styleCellCenteredLabel, colSpan: 4 },
              {},
              {},
              {},
              { text: 'TIRAHAN / ADDRESS', style: styleCellCenteredLabel, colSpan: 4 },
              {},
              {},
              {}
            ],
            [
              { text: 'PANGALAN', style: styleCellLabel, colSpan: 2 },
              {},
              { text: _data.first_name, style: styleCellValue, colSpan: 2 },
              {},
              { text: 'KALYE', style: styleCellLabel, colSpan: 2 },
              {},
              { text: _data.address_street, style: styleCellValue, colSpan: 2 }
            ],
            [
              { text: 'GITNANG PANGALAN', style: styleCellLabel, colSpan: 2 },
              {},
              { text: _data.middle_name, style: styleCellValue, colSpan: 2 },
              {},
              { text: 'BRGY.', style: styleCellLabel, colSpan: 2 },
              {},
              { text: _data.address_district, style: styleCellValue, colSpan: 2 },
              {}
            ],
            [
              { text: 'APELYIDO', style: styleCellLabel, colSpan: 2 },
              {},
              { text: _data.last_name, style: styleCellValue, colSpan: 2 },
              {},
              { text: 'LUNGSOD', style: styleCellLabel },
              { text: _data.address_city, style: styleCellValue },
              { text: 'PROBINSYA', style: styleCellLabel },
              { text: _data.address_province, style: styleCellValue }
            ]
          ]
        }
      },
      {
        table: {
          margin: [0, 0, 0, 0],
          widths: ["*", "*", "*", "*", "*", "*"],
          body: [
            [
              { text: 'PANGALAN NG NANAY SA PAGKADALAGA', style: styleCellCenteredLabel, colSpan: 6 },
              {},
              {},
              {},
              {},
              {}
            ],
            [
              { text: 'PANGALAN', style: styleCellLabel },
              { text: _data.mothers_first_name, style: styleCellValue },
              { text: 'GITNANG PANGALAN', style: styleCellLabel },
              { text: _data.mothers_middle_name, style: styleCellValue },
              { text: 'APELYIDO', style: styleCellLabel },
              { text: _data.mothers_last_name, style: styleCellValue }
            ]
          ]
        }
      },
      {
        table: {
          margin: [0, 0, 0, 0],
          widths: ["25%", "35%", "15%", "25%"],
          body: [
            [
              { text: 'URI NG PANINIRAHAN', style: styleCellLabel },
              { text: _data.housing_type, style: styleCellValue },
              { text: 'TAGAL NA SA TIRAHAN (BILANG NG TAON / BUWAN)', style: styleCellLabel },
              { text: _data.housing_stay, style: styleCellValue }
            ],
            [
              { text: 'IPINAKITANG KATIBAYAN', style: styleCellLabel },
              { text: '', style: styleCellValue, colSpan: 3 }
            ]
          ]
        }
      },
      {
        table: {
          margin: [0, 0, 0, 0],
          widths: ["25%", "25%", "25%", "25%"],
          body: [
            [
              { text: 'KAPANGANAKAN', style: styleCellLabel },
              { text: _data.date_of_birth, style: styleCellValue },
              { text: 'EDAD', style: styleCellLabel },
              { text: _data.age, style: styleCellValue }
            ]
          ]
        },
      },
      {
        table: {
          margin: [0, 0, 0, 0],
          widths: ["25%", "25%", "25%", "25%"],
          body: [
            [
              { text: 'LUGAR NG KAPANGANAKAN', style: styleCellLabel },
              { text: _data.place_of_birth, style: styleCellValue },
              { text: 'KASARIAN', style: styleCellLabel },
              { text: _data.gender, style: styleCellValue }
            ]
          ]
        }
      },
      {
        table: {
          margin: [0, 0, 0, 0],
          widths: ["15%", "55%", "10%", "20%"],
          body: [
            [
              { text: 'KATAYUANG SIBIL', style: styleCellLabel },
              { text: _data.civil_status, style: styleCellValue },
              { text: 'RELIHIYON', style: styleCellLabel },
              { text: _data.religion, style: styleCellValue }
            ]
          ]
        }
      },
      {
        table: {
          margin: [0, 0, 0, 0],
          widths: ["20%", "10%", "20%", "*"],
          body: [
            [
              { text: 'BILANG NG ANAK', style: styleCellLabel },
              { text: _data.num_children, style: styleCellValue },
              { text: 'ILAN ANG NAG-AARAL', style: styleCellLabel },
              { text: _data.num_children_studying, style: styleCellValue }
            ]
          ]
        }
      },
      {
        table: {
          margin: [0, 0, 0, 0],
          widths: ["25%", "25%", "25%", "25%"],
          body: [
            [
              { text: 'CELLPHONE NUMBER', style: styleCellLabel },
              { text: _data.mobile_number, style: styleCellValue },
              { text: 'LANDLINE NUMBER', style: styleCellLabel },
              { text: _data.home_number, style: styleCellValue }
            ],
            [
              { text: 'KASALUKUYANG BANGKO (kung mayroon)', style: styleCellLabel },
              { text: _data.current_bank_name, style: styleCellValue },
              { text: 'KLASE NG ACCOUNT', style: styleCellLabel },
              { text: _data.current_bank_type, style: styleCellValue }
            ]
          ]
        }
      },
      {
        table: {
          margin: [0, 0, 0, 0],
          widths: ["12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%"],
          body: [
            [
              { text: 'SSS/GSIS #', style: styleCellLabel },
              { text: _data.sss_number, style: styleCellValue },
              { text: 'PAG-IBIG #', style: styleCellLabel },
              { text: _data.pag_ibig_number, style: styleCellValue },
              { text: 'PHILHEALTH #', style: styleCellLabel },
              { text: _data.phil_health_number, style: styleCellValue },
              { text: 'TIN #', style: styleCellLabel },
              { text: _data.tin_number, style: styleCellValue }
            ]
          ]
        }
      },
      {
        table: {
          margin: [0, 0, 0, 0],
          widths: ["25%", "25%", "25%", "25%"],
          body: [
            [
              { text: 'PERSONAL NA IMPORMASYON NG ASAWA O KINAKASAMA (COMMON-LAW SPOUSE)', style: styleCellCenteredLabel, colSpan: 4 },
              {},
              {},
              {}
            ],
            [
              { text: 'PANGALAN', style: styleCellLabel },
              { text: _data.spouse_first_name, style: styleCellValue },
              { text: 'KAPANGANAKAN', style: styleCellLabel },
              { text: _data.spouse_date_of_birth, style: styleCellValue }
            ],
            [
              { text: 'GITNANG PANGALAN', style: styleCellLabel },
              { text: _data.spouse_middle_name, style: styleCellValue },
              { text: 'EDAD', style: styleCellLabel },
              { text: _data.spouse_age, style: styleCellValue }
            ],
            [
              { text: 'APELYIDO', style: styleCellLabel },
              { text: _data.spouse_last_name, style: styleCellValue },
              { text: 'TRABAHO', style: styleCellLabel },
              { text: _data.spouse_occupation, style: styleCellValue }
            ]
          ]
        }
      },
      {
        table: _generateChildrenTable()
      },
      _generateApplicationSignatory(),
      {
        table: {
          margins: [0, 0, 0, 20],
          widths: ["25%", "75%"],
          body: [
            [
              { text: 'BACKGROUND SA PAHIRAMAN', style: styleCellCenteredLabel, colSpan: 2 },
              {}
            ],
            [
              { text: 'DAHILAN NG PAGSALI SA K-COOP', style: styleCellLabel },
              { text: _data.reason_for_joining, style: styleCellValue }
            ],
            [
              { text: 'KARANASAN SA KOOPERATIBA / MFI', style: styleCellLabel },
              { text: _data.previous_mfi_experience, style: styleCellValue }
            ]
          ]
        }
      },
      {
        table: {
          margins: [0, 0, 0, 20],
          widths: ["40%", "50%", "10%"],
          body: [
            [
              { text: 'PROGRESS OUT OF POVERTY INDEX (Panuto: bilugan ang inyong sagot)', style: styleCellCenteredLabel, colSpan: 3 },
              {},
              {}
            ],
            [
              { text: 'PAHAYAG', style: styleCellCenteredLabel },
              { text: 'SAGOT: (Bilugan ang isa)', style: styleCellCenteredLabel },
              { text: 'PUNTOS', style: styleCellCenteredLabel }
            ],
            [
              { text: '1. Ilan ang kasalukuyang nakatira sa bahay? (isama sa bilang ang OFW na hindi pa lumalagpas sa 5 taong nasa abroad)', style: styleCellValue },
              { text: 'a. 8 o higit pa\u200B\t\u200B\tb. 7\u200B\t\u200B\tc. 6\u200B\t\u200B\td. 5\u200B\t\u200B\te. 4\u200B\t\u200B\tf. 3\u200B\t\u200B\tg. 1 o 2', style: styleCellValue },
              { text: '', style: styleCellValue }
            ],
            [
              { text: '2. Lahat po ba ng kasama sa bahay na may edad 6-17 ay pumapasok sa eskwelahan?', style: styleCellValue },
              { text: 'a. Hindi\u200B\t\u200B\tb. Oo\u200B\t\u200B\tc. Walang edad 6 - 17', style: styleCellValue },
              { text: '', style: styleCellValue }
            ],
            [
              { text: '3. Ilan sa kasama sa bahay ang nagtrabaho kahit na isang oras lang sa nakalipas na linggo?\n(maaaring namasukan o para sa negosyo)', style: styleCellValue },
              { text: 'a. Wala\u200B\t\u200B\tb. 1\u200B\t\u200B\tc. 2\u200B\t\u200B\td. 3 o higit pa', style: styleCellValue },
              { text: '', style: styleCellValue }
            ],
            [
              { text: '4. Sa kasalukuyang pinagkakakitaan ng kasama sa bahay, Ilan sa kanila ang helper, vendor, caretaker,messenger, garbage collector, sweeper, padyak, construction worker at iba pang kahalintulad nito.', style: styleCellValue },
              { text: 'a. 3 o higit pa\u200B\t\u200B\tb. 2\u200B\t\u200B\tc. 1\u200B\t\u200B\td. Wala', style: styleCellValue },
              { text: '', style: styleCellValue }
            ],
            [
              { text: '5. Ano ang pinakamataas na antas na pag-aaral ang natapos ni nanay o madre de pamilya?', style: styleCellValue },
              { text: 'a. Hindi nakapag aral o hindi nakatapos ng elementarya\nb. Walang female head\nc. Nakatapos ng elementary o hindi nakatapos ng high school\nd. Nakatapos ng high school\ne. Nakatungtong, nakatapos ng kolehiyo o higit pa', style: styleCellValue },
              { text: '', style: styleCellValue }
            ],
            [
              { text: '6. Sa anong materyales gawa ang inyong dingding?', style: styleCellValue },
              { text: 'a. Mga pinaglumaang materyales o 2nd hand (maaaring lahat o may kaunting kahalong bagong materyales) o mga materyales na tulad ng karton, sako, plastic, styropor, tarpaulin at iba pang kahalintulad nito.\n\nb. Magkahalong materyales mula sa (A) at (C) ngunit mas marami ang sa (C)\n\nc. Mga materyales tulad ng galvanized iron, aluminium, tile, semento, brick, bato, kahoy, plywood or asbestos at iba pang kahalintulad nito', style: styleCellValue},
              { text: '', style: styleCellValue }
            ],
            [
              { text: '7. Mayroon bang sala set?', style: styleCellValue },
              { text: 'a. Wala\u200B\t\u200B\tb. Meron', style: styleCellValue },
              { text: '', style: styleCellValue }
            ],
            [
              { text: '8. Mayroon bang gumaganang refrigerator/ freezer o washing machine?', style: styleCellValue },
              { text: 'a. Wala\u200B\t\u200B\tb. Mayroong isa sa mga nabanggit\u200B\t\u200B\tc. Parehong mayroon', style: styleCellValue },
              { text: '', style: styleCellValue }
            ],
            [
              { text: '9. Mayroon bang gumaganang TV o VHS/VCD/DVD player?', style: styleCellValue },
              { text: 'a. Wala\u200B\t\u200B\tb. TV lamang\u200B\tc. Mayroong VHS/VCD/DVD player (mayroon o walang TV)', style: styleCellValue },
              { text: '', style: styleCellValue }
            ],
            [
              { text: '10. Ilang telepono o cellphone ang pag mamay-ari ng pamilya', style: styleCellValue },
              { text: 'a. Wala\u200B\t\u200B\tb. 1\u200B\t\u200B\tc. 2\u200B\t\u200B\td. 3 o higit pa', style: styleCellValue },
              { text: '', style: styleCellValue }
            ],
            [
              { text: 'TOTAL', style: { fontSize: 7, bold: true }, alignment: 'right', colSpan: 2 },
              {},
              { text: '', style: styleCellValue }
            ]
          ]
        }
      },
      {
        text: '', style: styleSectionHeader, margin: [0, 8, 0, 8]
      },
      {
        table: {
          widths: ["33.33%", "33.33%", "33.33%"],
          body: [
            [
              { text: 'NAGSAGAWA NG CI:', style: styleCellValue, border: [true, true, false, false] },
              { text: 'PRINOSESO NI:', style: styleCellValue, border: [false, true, false, false] },
              { text: 'SINANG-AYUNAN NI:', style: styleCellValue, border: [false, true, true, false] }
            ],
            [
              { text: '_______________________________________', style: styleCellValue, alignment: 'center', border: [true, false, false, false] },
              { text: '_______________________________________', style: styleCellValue, alignment: 'center', border: [false, false, false, false] },
              { text: '_______________________________________', style: styleCellValue, alignment: 'center', border: [false, false, true, false] }
            ],
            [
              { text: 'Socio-Economic Officer', style: styleCellValue, alignment: 'center', border: [true, false, false, false] },
              { text: 'Socio-Economic Officer', style: styleCellValue, alignment: 'center', border: [false, false, false, false] },
              { text: 'Satellite Officer Manager', style: styleCellValue, alignment: 'center', border: [false, false, true, false] }
            ],
            [
              { text: 'Petsa: ______________', style: styleCellValue, border: [true, false, false, true] },
              { text: 'Petsa: ______________', style: styleCellValue, border: [false, false, false, true] },
              { text: 'Petsa: ______________', style: styleCellValue, border: [false, false, true, true] }
            ]
          ]
        }
      },
      {
        text: '', style: styleSectionHeader, margin: [0, 8, 0, 8]
      },
      {
        table: {
          widths: ["100%"],
          body: [
            [
              { text: 'KASUNDUAN', style: { bold: true }, alignment: 'center', border: [true, true, true, false] }
            ],
            [
              { text: 'Ako si ' + _data.full_name + ', na miyembro ng K-Coop, sa Sentro ng ____________________________, at Satellite Area ng ' + _data.branch + ', ay kusa at boluntaryong sumasang-ayon sa mga sumusunod:\n\n', style: { fontSize: 9 }, alignment: 'justify', border: [true, false, true, false] }
            ],
            [
              {
                ol: [
                  { text: 'Bilang ambag sa kapital ng K-Coop, ako ay bibili upang magmay-ari ng di bababa sa apat (4) na bahagi ng kapital (share capital) nito, na aking babayaran sa sumusunod na paraan:\n\n\u200B\ta. Ang isang (1) bahagi, na nagkakahalaga ng isandaang piso (Php100.00), ay babayaran ko sa oras na sang-ayunan ng K-Coop ang aking aplikasyon bilang kasapi; at\n\n\u200B\tb. Ang natitira pang tatlong (3) bahagi ay babayaran mula sa aking capital build-up (CBU) na binubuo ng sampung porsyento (10%) \u200B\t\u200B\t\u200B\tng aking taunang balik-tangkilik (patronage refund) at interes sa aking share capital.\n\n', style: { fontSize: 9 }, alignment: 'justify' },
                  { text: 'Kung ako ay titiwalag o matatanggal bago ang ika-apat (4) na taon ng pagiging miyembro ko sa K-Coop, ang halaga ng isang share capital ko na isandaang piso (Php100.00) ay magsisilbi kong Closing Fee, sang-ayon na rin sa By-Laws ng K-Coop.\n\n', style: { fontSize: 9 }, alignment: 'justify' }
                ],
                border: [true, false, true, false]
              }
            ],
            [
              { text: _data.full_name, style: { fontSize: 9 }, alignment: 'right', border: [true, false, true, false], decoration: 'underline' },
            ],
            [
              { text: 'Lagda ng Miyembro/Petsa ng Paglagda', style: { fontSize: 9, bold: true }, alignment: 'right', border: [true, false, true, true] }
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
