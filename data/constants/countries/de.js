const countyList = [
    {
        "value": "CH",
        "label": "Schweiz"
    },
    {
        "value": "AT",
        "label": "Österreich"
    },
    {
        "value": "FR",
        "label": "Frankreich"
    },
    {
        "value": "DE",
        "label": "Deutschland"
    },
    {
        "value": "IT",
        "label": "Italien"
    },
    {
        "value": "NL",
        "label": "Niederlande"
    },
    {
        "value": "US",
        "label": "Vereinigte Staaten"
    },
    {
        "value": "AF",
        "label": "Afghanistan"
    },
    {
        "value": "AX",
        "label": "Ålandinseln"
    },
    {
        "value": "AL",
        "label": "Albanien"
    },
    {
        "value": "DZ",
        "label": "Algerien"
    },
    {
        "value": "AS",
        "label": "Amerikanisch-Samoa"
    },
    {
        "value": "AD",
        "label": "Andorra"
    },
    {
        "value": "AO",
        "label": "Angola"
    },
    {
        "value": "AI",
        "label": "Anguilla"
    },
    {
        "value": "AQ",
        "label": "Antarktis"
    },
    {
        "value": "AG",
        "label": "Antigua und Barbuda"
    },
    {
        "value": "AR",
        "label": "Argentinien"
    },
    {
        "value": "AM",
        "label": "Armenien"
    },
    {
        "value": "AW",
        "label": "Aruba"
    },
    {
        "value": "AU",
        "label": "Australien"
    },
    {
        "value": "AZ",
        "label": "Aserbaidschan"
    },
    {
        "value": "BS",
        "label": "Bahamas"
    },
    {
        "value": "BH",
        "label": "Bahrain"
    },
    {
        "value": "BD",
        "label": "Bangladesch"
    },
    {
        "value": "BB",
        "label": "Barbados"
    },
    {
        "value": "BY",
        "label": "Belarus"
    },
    {
        "value": "BE",
        "label": "Belgien"
    },
    {
        "value": "BZ",
        "label": "Belize"
    },
    {
        "value": "BJ",
        "label": "Benin"
    },
    {
        "value": "BM",
        "label": "Bermuda"
    },
    {
        "value": "BT",
        "label": "Bhutan"
    },
    {
        "value": "BO",
        "label": "Bolivien"
    },
    {
        "value": "BA",
        "label": "Bosnien und Herzegowina"
    },
    {
        "value": "BW",
        "label": "Botsuana"
    },
    {
        "value": "BV",
        "label": "Bouvetinsel"
    },
    {
        "value": "BR",
        "label": "Brasilien"
    },
    {
        "value": "IO",
        "label": "Britisches Territorium im Indischen Ozean"
    },
    {
        "value": "VG",
        "label": "Britische Jungferninseln"
    },
    {
        "value": "BN",
        "label": "Brunei Darussalam"
    },
    {
        "value": "BG",
        "label": "Bulgarien"
    },
    {
        "value": "BF",
        "label": "Burkina Faso"
    },
    {
        "value": "BI",
        "label": "Burundi"
    },
    {
        "value": "KH",
        "label": "Kambodscha"
    },
    {
        "value": "CM",
        "label": "Kamerun"
    },
    {
        "value": "CA",
        "label": "Kanada"
    },
    {
        "value": "CV",
        "label": "Cabo Verde"
    },
    {
        "value": "BQ",
        "label": "Bonaire, Sint Eustatius und Saba"
    },
    {
        "value": "KY",
        "label": "Kaimaninseln"
    },
    {
        "value": "CF",
        "label": "Zentralafrikanische Republik"
    },
    {
        "value": "TD",
        "label": "Tschad"
    },
    {
        "value": "CL",
        "label": "Chile"
    },
    {
        "value": "CN",
        "label": "China"
    },
    {
        "value": "CX",
        "label": "Weihnachtsinsel"
    },
    {
        "value": "CC",
        "label": "Kokosinseln"
    },
    {
        "value": "CO",
        "label": "Kolumbien"
    },
    {
        "value": "KM",
        "label": "Komoren"
    },
    {
        "value": "CG",
        "label": "Kongo-Brazzaville"
    },
    {
        "value": "CD",
        "label": "Kongo-Kinshasa"
    },
    {
        "value": "CK",
        "label": "Cookinseln"
    },
    {
        "value": "CR",
        "label": "Costa Rica"
    },
    {
        "value": "CI",
        "label": "Côte d’Ivoire"
    },
    {
        "value": "HR",
        "label": "Kroatien"
    },
    {
        "value": "CU",
        "label": "Kuba"
    },
    {
        "value": "CW",
        "label": "Curaçao"
    },
    {
        "value": "CY",
        "label": "Zypern"
    },
    {
        "value": "CZ",
        "label": "Tschechien"
    },
    {
        "value": "DK",
        "label": "Dänemark"
    },
    {
        "value": "DJ",
        "label": "Dschibuti"
    },
    {
        "value": "DM",
        "label": "Dominica"
    },
    {
        "value": "DO",
        "label": "Dominikanische Republik"
    },
    {
        "value": "EC",
        "label": "Ecuador"
    },
    {
        "value": "EG",
        "label": "Ägypten"
    },
    {
        "value": "SV",
        "label": "El Salvador"
    },
    {
        "value": "GQ",
        "label": "Äquatorialguinea"
    },
    {
        "value": "ER",
        "label": "Eritrea"
    },
    {
        "value": "EE",
        "label": "Estland"
    },
    {
        "value": "SZ",
        "label": "Eswatini"
    },
    {
        "value": "ET",
        "label": "Äthiopien"
    },
    {
        "value": "FK",
        "label": "Falklandinseln"
    },
    {
        "value": "FO",
        "label": "Färöer"
    },
    {
        "value": "FJ",
        "label": "Fidschi"
    },
    {
        "value": "FI",
        "label": "Finnland"
    },
    {
        "value": "GF",
        "label": "Französisch-Guayana"
    },
    {
        "value": "PF",
        "label": "Französisch-Polynesien"
    },
    {
        "value": "TF",
        "label": "Französische Süd- und Antarktisgebiete"
    },
    {
        "value": "GA",
        "label": "Gabun"
    },
    {
        "value": "GM",
        "label": "Gambia"
    },
    {
        "value": "GE",
        "label": "Georgien"
    },
    {
        "value": "GH",
        "label": "Ghana"
    },
    {
        "value": "GI",
        "label": "Gibraltar"
    },
    {
        "value": "GR",
        "label": "Griechenland"
    },
    {
        "value": "GL",
        "label": "Grönland"
    },
    {
        "value": "GD",
        "label": "Grenada"
    },
    {
        "value": "GP",
        "label": "Guadeloupe"
    },
    {
        "value": "GU",
        "label": "Guam"
    },
    {
        "value": "GT",
        "label": "Guatemala"
    },
    {
        "value": "GG",
        "label": "Guernsey"
    },
    {
        "value": "GN",
        "label": "Guinea"
    },
    {
        "value": "GW",
        "label": "Guinea-Bissau"
    },
    {
        "value": "GY",
        "label": "Guyana"
    },
    {
        "value": "HT",
        "label": "Haiti"
    },
    {
        "value": "HM",
        "label": "Heard und McDonaldinseln"
    },
    {
        "value": "HN",
        "label": "Honduras"
    },
    {
        "value": "HK",
        "label": "Sonderverwaltungsregion Hongkong"
    },
    {
        "value": "HU",
        "label": "Ungarn"
    },
    {
        "value": "IS",
        "label": "Island"
    },
    {
        "value": "IN",
        "label": "Indien"
    },
    {
        "value": "ID",
        "label": "Indonesien"
    },
    {
        "value": "IR",
        "label": "Iran"
    },
    {
        "value": "IQ",
        "label": "Irak"
    },
    {
        "value": "IE",
        "label": "Irland"
    },
    {
        "value": "IM",
        "label": "Isle of Man"
    },
    {
        "value": "IL",
        "label": "Israel"
    },
    {
        "value": "JM",
        "label": "Jamaika"
    },
    {
        "value": "JP",
        "label": "Japan"
    },
    {
        "value": "JE",
        "label": "Jersey"
    },
    {
        "value": "JO",
        "label": "Jordanien"
    },
    {
        "value": "KZ",
        "label": "Kasachstan"
    },
    {
        "value": "KE",
        "label": "Kenia"
    },
    {
        "value": "KI",
        "label": "Kiribati"
    },
    {
        "value": "KW",
        "label": "Kuwait"
    },
    {
        "value": "KG",
        "label": "Kirgisistan"
    },
    {
        "value": "LA",
        "label": "Laos"
    },
    {
        "value": "LV",
        "label": "Lettland"
    },
    {
        "value": "LB",
        "label": "Libanon"
    },
    {
        "value": "LS",
        "label": "Lesotho"
    },
    {
        "value": "LR",
        "label": "Liberia"
    },
    {
        "value": "LY",
        "label": "Libyen"
    },
    {
        "value": "LI",
        "label": "Liechtenstein"
    },
    {
        "value": "LT",
        "label": "Litauen"
    },
    {
        "value": "LU",
        "label": "Luxemburg"
    },
    {
        "value": "MO",
        "label": "Sonderverwaltungsregion Macau"
    },
    {
        "value": "MG",
        "label": "Madagaskar"
    },
    {
        "value": "MW",
        "label": "Malawi"
    },
    {
        "value": "MY",
        "label": "Malaysia"
    },
    {
        "value": "MV",
        "label": "Malediven"
    },
    {
        "value": "ML",
        "label": "Mali"
    },
    {
        "value": "MT",
        "label": "Malta"
    },
    {
        "value": "MH",
        "label": "Marshallinseln"
    },
    {
        "value": "MQ",
        "label": "Martinique"
    },
    {
        "value": "MR",
        "label": "Mauretanien"
    },
    {
        "value": "MU",
        "label": "Mauritius"
    },
    {
        "value": "YT",
        "label": "Mayotte"
    },
    {
        "value": "MX",
        "label": "Mexiko"
    },
    {
        "value": "FM",
        "label": "Mikronesien"
    },
    {
        "value": "MD",
        "label": "Republik Moldau"
    },
    {
        "value": "MC",
        "label": "Monaco"
    },
    {
        "value": "MN",
        "label": "Mongolei"
    },
    {
        "value": "ME",
        "label": "Montenegro"
    },
    {
        "value": "MS",
        "label": "Montserrat"
    },
    {
        "value": "MA",
        "label": "Marokko"
    },
    {
        "value": "MZ",
        "label": "Mosambik"
    },
    {
        "value": "MM",
        "label": "Myanmar"
    },
    {
        "value": "NA",
        "label": "Namibia"
    },
    {
        "value": "NR",
        "label": "Nauru"
    },
    {
        "value": "NP",
        "label": "Nepal"
    },
    {
        "value": "NC",
        "label": "Neukaledonien"
    },
    {
        "value": "NZ",
        "label": "Neuseeland"
    },
    {
        "value": "NI",
        "label": "Nicaragua"
    },
    {
        "value": "NE",
        "label": "Niger"
    },
    {
        "value": "NG",
        "label": "Nigeria"
    },
    {
        "value": "NU",
        "label": "Niue"
    },
    {
        "value": "NF",
        "label": "Norfolkinsel"
    },
    {
        "value": "KP",
        "label": "Nordkorea"
    },
    {
        "value": "MK",
        "label": "Nordmazedonien"
    },
    {
        "value": "MP",
        "label": "Nördliche Marianen"
    },
    {
        "value": "NO",
        "label": "Norwegen"
    },
    {
        "value": "OM",
        "label": "Oman"
    },
    {
        "value": "PK",
        "label": "Pakistan"
    },
    {
        "value": "PW",
        "label": "Palau"
    },
    {
        "value": "PS",
        "label": "Palästinensische Autonomiegebiete"
    },
    {
        "value": "PA",
        "label": "Panama"
    },
    {
        "value": "PG",
        "label": "Papua-Neuguinea"
    },
    {
        "value": "PY",
        "label": "Paraguay"
    },
    {
        "value": "PE",
        "label": "Peru"
    },
    {
        "value": "PH",
        "label": "Philippinen"
    },
    {
        "value": "PN",
        "label": "Pitcairninseln"
    },
    {
        "value": "PL",
        "label": "Polen"
    },
    {
        "value": "PT",
        "label": "Portugal"
    },
    {
        "value": "PR",
        "label": "Puerto Rico"
    },
    {
        "value": "QA",
        "label": "Katar"
    },
    {
        "value": "RE",
        "label": "Réunion"
    },
    {
        "value": "RO",
        "label": "Rumänien"
    },
    {
        "value": "RU",
        "label": "Russland"
    },
    {
        "value": "RW",
        "label": "Ruanda"
    },
    {
        "value": "WS",
        "label": "Samoa"
    },
    {
        "value": "SM",
        "label": "San Marino"
    },
    {
        "value": "ST",
        "label": "São Tomé und Príncipe"
    },
    {
        "value": "SA",
        "label": "Saudi-Arabien"
    },
    {
        "value": "SN",
        "label": "Senegal"
    },
    {
        "value": "RS",
        "label": "Serbien"
    },
    {
        "value": "SC",
        "label": "Seychellen"
    },
    {
        "value": "SL",
        "label": "Sierra Leone"
    },
    {
        "value": "SG",
        "label": "Singapur"
    },
    {
        "value": "SX",
        "label": "Sint Maarten"
    },
    {
        "value": "SK",
        "label": "Slowakei"
    },
    {
        "value": "SI",
        "label": "Slowenien"
    },
    {
        "value": "SB",
        "label": "Salomonen"
    },
    {
        "value": "SO",
        "label": "Somalia"
    },
    {
        "value": "ZA",
        "label": "Südafrika"
    },
    {
        "value": "GS",
        "label": "Südgeorgien und die Südlichen Sandwichinseln"
    },
    {
        "value": "KR",
        "label": "Südkorea"
    },
    {
        "value": "SS",
        "label": "Südsudan"
    },
    {
        "value": "ES",
        "label": "Spanien"
    },
    {
        "value": "LK",
        "label": "Sri Lanka"
    },
    {
        "value": "BL",
        "label": "St. Barthélemy"
    },
    {
        "value": "SH",
        "label": "St. Helena"
    },
    {
        "value": "KN",
        "label": "St. Kitts und Nevis"
    },
    {
        "value": "LC",
        "label": "St. Lucia"
    },
    {
        "value": "MF",
        "label": "St. Martin"
    },
    {
        "value": "PM",
        "label": "St. Pierre und Miquelon"
    },
    {
        "value": "VC",
        "label": "St. Vincent und die Grenadinen"
    },
    {
        "value": "SD",
        "label": "Sudan"
    },
    {
        "value": "SR",
        "label": "Suriname"
    },
    {
        "value": "SJ",
        "label": "Spitzbergen und Jan Mayen"
    },
    {
        "value": "SE",
        "label": "Schweden"
    },
    {
        "value": "SY",
        "label": "Syrien"
    },
    {
        "value": "TW",
        "label": "Taiwan"
    },
    {
        "value": "TJ",
        "label": "Tadschikistan"
    },
    {
        "value": "TZ",
        "label": "Tansania"
    },
    {
        "value": "TH",
        "label": "Thailand"
    },
    {
        "value": "TL",
        "label": "Timor-Leste"
    },
    {
        "value": "TG",
        "label": "Togo"
    },
    {
        "value": "TK",
        "label": "Tokelau"
    },
    {
        "value": "TO",
        "label": "Tonga"
    },
    {
        "value": "TT",
        "label": "Trinidad und Tobago"
    },
    {
        "value": "TN",
        "label": "Tunesien"
    },
    {
        "value": "TR",
        "label": "Türkei"
    },
    {
        "value": "TM",
        "label": "Turkmenistan"
    },
    {
        "value": "TC",
        "label": "Turks- und Caicosinseln"
    },
    {
        "value": "TV",
        "label": "Tuvalu"
    },
    {
        "value": "UM",
        "label": "Amerikanische Überseeinseln"
    },
    {
        "value": "VI",
        "label": "Amerikanische Jungferninseln"
    },
    {
        "value": "UG",
        "label": "Uganda"
    },
    {
        "value": "UA",
        "label": "Ukraine"
    },
    {
        "value": "AE",
        "label": "Vereinigte Arabische Emirate"
    },
    {
        "value": "GB",
        "label": "Vereinigtes Königreich"
    },
    {
        "value": "UY",
        "label": "Uruguay"
    },
    {
        "value": "UZ",
        "label": "Usbekistan"
    },
    {
        "value": "VU",
        "label": "Vanuatu"
    },
    {
        "value": "VA",
        "label": "Vatikanstadt"
    },
    {
        "value": "VE",
        "label": "Venezuela"
    },
    {
        "value": "VN",
        "label": "Vietnam"
    },
    {
        "value": "WF",
        "label": "Wallis und Futuna"
    },
    {
        "value": "EH",
        "label": "Westsahara"
    },
    {
        "value": "YE",
        "label": "Jemen"
    },
    {
        "value": "ZM",
        "label": "Sambia"
    },
    {
        "value": "ZW",
        "label": "Simbabwe"
    }
]

export default countyList;