const countyList = [
    {
        "value": "CH",
        "label": "Svizzera"
    },
    {
        "value": "AT",
        "label": "Austria"
    },
    {
        "value": "FR",
        "label": "Francia"
    },
    {
        "value": "DE",
        "label": "Germania"
    },
    {
        "value": "IT",
        "label": "Italia"
    },
    {
        "value": "NL",
        "label": "Paesi Bassi"
    },
    {
        "value": "US",
        "label": "Stati Uniti"
    },
    {
        "value": "AF",
        "label": "Afghanistan"
    },
    {
        "value": "AX",
        "label": "Isole Åland"
    },
    {
        "value": "AL",
        "label": "Albania"
    },
    {
        "value": "DZ",
        "label": "Algeria"
    },
    {
        "value": "AS",
        "label": "Samoa americane"
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
        "label": "Antartide"
    },
    {
        "value": "AG",
        "label": "Antigua e Barbuda"
    },
    {
        "value": "AR",
        "label": "Argentina"
    },
    {
        "value": "AM",
        "label": "Armenia"
    },
    {
        "value": "AW",
        "label": "Aruba"
    },
    {
        "value": "AU",
        "label": "Australia"
    },
    {
        "value": "AZ",
        "label": "Azerbaigian"
    },
    {
        "value": "BS",
        "label": "Bahamas"
    },
    {
        "value": "BH",
        "label": "Bahrein"
    },
    {
        "value": "BD",
        "label": "Bangladesh"
    },
    {
        "value": "BB",
        "label": "Barbados"
    },
    {
        "value": "BY",
        "label": "Bielorussia"
    },
    {
        "value": "BE",
        "label": "Belgio"
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
        "label": "Bolivia"
    },
    {
        "value": "BA",
        "label": "Bosnia ed Erzegovina"
    },
    {
        "value": "BW",
        "label": "Botswana"
    },
    {
        "value": "BV",
        "label": "Isola Bouvet"
    },
    {
        "value": "BR",
        "label": "Brasile"
    },
    {
        "value": "IO",
        "label": "Territorio britannico dell’Oceano Indiano"
    },
    {
        "value": "VG",
        "label": "Isole Vergini Britanniche"
    },
    {
        "value": "BN",
        "label": "Brunei"
    },
    {
        "value": "BG",
        "label": "Bulgaria"
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
        "label": "Cambogia"
    },
    {
        "value": "CM",
        "label": "Camerun"
    },
    {
        "value": "CA",
        "label": "Canada"
    },
    {
        "value": "CV",
        "label": "Capo Verde"
    },
    {
        "value": "BQ",
        "label": "Caraibi olandesi"
    },
    {
        "value": "KY",
        "label": "Isole Cayman"
    },
    {
        "value": "CF",
        "label": "Repubblica Centrafricana"
    },
    {
        "value": "TD",
        "label": "Ciad"
    },
    {
        "value": "CL",
        "label": "Cile"
    },
    {
        "value": "CN",
        "label": "Cina"
    },
    {
        "value": "CX",
        "label": "Isola Christmas"
    },
    {
        "value": "CC",
        "label": "Isole Cocos (Keeling)"
    },
    {
        "value": "CO",
        "label": "Colombia"
    },
    {
        "value": "KM",
        "label": "Comore"
    },
    {
        "value": "CG",
        "label": "Congo-Brazzaville"
    },
    {
        "value": "CD",
        "label": "Congo - Kinshasa"
    },
    {
        "value": "CK",
        "label": "Isole Cook"
    },
    {
        "value": "CR",
        "label": "Costa Rica"
    },
    {
        "value": "CI",
        "label": "Costa d’Avorio"
    },
    {
        "value": "HR",
        "label": "Croazia"
    },
    {
        "value": "CU",
        "label": "Cuba"
    },
    {
        "value": "CW",
        "label": "Curaçao"
    },
    {
        "value": "CY",
        "label": "Cipro"
    },
    {
        "value": "CZ",
        "label": "Cechia"
    },
    {
        "value": "DK",
        "label": "Danimarca"
    },
    {
        "value": "DJ",
        "label": "Gibuti"
    },
    {
        "value": "DM",
        "label": "Dominica"
    },
    {
        "value": "DO",
        "label": "Repubblica Dominicana"
    },
    {
        "value": "EC",
        "label": "Ecuador"
    },
    {
        "value": "EG",
        "label": "Egitto"
    },
    {
        "value": "SV",
        "label": "El Salvador"
    },
    {
        "value": "GQ",
        "label": "Guinea Equatoriale"
    },
    {
        "value": "ER",
        "label": "Eritrea"
    },
    {
        "value": "EE",
        "label": "Estonia"
    },
    {
        "value": "SZ",
        "label": "Swaziland"
    },
    {
        "value": "ET",
        "label": "Etiopia"
    },
    {
        "value": "FK",
        "label": "Isole Falkland"
    },
    {
        "value": "FO",
        "label": "Isole Fær Øer"
    },
    {
        "value": "FJ",
        "label": "Figi"
    },
    {
        "value": "FI",
        "label": "Finlandia"
    },
    {
        "value": "GF",
        "label": "Guyana francese"
    },
    {
        "value": "PF",
        "label": "Polinesia francese"
    },
    {
        "value": "TF",
        "label": "Terre australi francesi"
    },
    {
        "value": "GA",
        "label": "Gabon"
    },
    {
        "value": "GM",
        "label": "Gambia"
    },
    {
        "value": "GE",
        "label": "Georgia"
    },
    {
        "value": "GH",
        "label": "Ghana"
    },
    {
        "value": "GI",
        "label": "Gibilterra"
    },
    {
        "value": "GR",
        "label": "Grecia"
    },
    {
        "value": "GL",
        "label": "Groenlandia"
    },
    {
        "value": "GD",
        "label": "Grenada"
    },
    {
        "value": "GP",
        "label": "Guadalupa"
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
        "label": "Isole Heard e McDonald"
    },
    {
        "value": "HN",
        "label": "Honduras"
    },
    {
        "value": "HK",
        "label": "RAS di Hong Kong"
    },
    {
        "value": "HU",
        "label": "Ungheria"
    },
    {
        "value": "IS",
        "label": "Islanda"
    },
    {
        "value": "IN",
        "label": "India"
    },
    {
        "value": "ID",
        "label": "Indonesia"
    },
    {
        "value": "IR",
        "label": "Iran"
    },
    {
        "value": "IQ",
        "label": "Iraq"
    },
    {
        "value": "IE",
        "label": "Irlanda"
    },
    {
        "value": "IM",
        "label": "Isola di Man"
    },
    {
        "value": "IL",
        "label": "Israele"
    },
    {
        "value": "JM",
        "label": "Giamaica"
    },
    {
        "value": "JP",
        "label": "Giappone"
    },
    {
        "value": "JE",
        "label": "Jersey"
    },
    {
        "value": "JO",
        "label": "Giordania"
    },
    {
        "value": "KZ",
        "label": "Kazakistan"
    },
    {
        "value": "KE",
        "label": "Kenya"
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
        "label": "Kirghizistan"
    },
    {
        "value": "LA",
        "label": "Laos"
    },
    {
        "value": "LV",
        "label": "Lettonia"
    },
    {
        "value": "LB",
        "label": "Libano"
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
        "label": "Libia"
    },
    {
        "value": "LI",
        "label": "Liechtenstein"
    },
    {
        "value": "LT",
        "label": "Lituania"
    },
    {
        "value": "LU",
        "label": "Lussemburgo"
    },
    {
        "value": "MO",
        "label": "RAS di Macao"
    },
    {
        "value": "MG",
        "label": "Madagascar"
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
        "label": "Maldive"
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
        "label": "Isole Marshall"
    },
    {
        "value": "MQ",
        "label": "Martinica"
    },
    {
        "value": "MR",
        "label": "Mauritania"
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
        "label": "Messico"
    },
    {
        "value": "FM",
        "label": "Micronesia"
    },
    {
        "value": "MD",
        "label": "Moldavia"
    },
    {
        "value": "MC",
        "label": "Monaco"
    },
    {
        "value": "MN",
        "label": "Mongolia"
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
        "label": "Marocco"
    },
    {
        "value": "MZ",
        "label": "Mozambico"
    },
    {
        "value": "MM",
        "label": "Myanmar (Birmania)"
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
        "label": "Nuova Caledonia"
    },
    {
        "value": "NZ",
        "label": "Nuova Zelanda"
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
        "label": "Isola Norfolk"
    },
    {
        "value": "KP",
        "label": "Corea del Nord"
    },
    {
        "value": "MK",
        "label": "Macedonia del Nord"
    },
    {
        "value": "MP",
        "label": "Isole Marianne settentrionali"
    },
    {
        "value": "NO",
        "label": "Norvegia"
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
        "label": "Territori palestinesi"
    },
    {
        "value": "PA",
        "label": "Panamá"
    },
    {
        "value": "PG",
        "label": "Papua Nuova Guinea"
    },
    {
        "value": "PY",
        "label": "Paraguay"
    },
    {
        "value": "PE",
        "label": "Perù"
    },
    {
        "value": "PH",
        "label": "Filippine"
    },
    {
        "value": "PN",
        "label": "Isole Pitcairn"
    },
    {
        "value": "PL",
        "label": "Polonia"
    },
    {
        "value": "PT",
        "label": "Portogallo"
    },
    {
        "value": "PR",
        "label": "Portorico"
    },
    {
        "value": "QA",
        "label": "Qatar"
    },
    {
        "value": "RE",
        "label": "Riunione"
    },
    {
        "value": "RO",
        "label": "Romania"
    },
    {
        "value": "RU",
        "label": "Russia"
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
        "label": "São Tomé e Príncipe"
    },
    {
        "value": "SA",
        "label": "Arabia Saudita"
    },
    {
        "value": "SN",
        "label": "Senegal"
    },
    {
        "value": "RS",
        "label": "Serbia"
    },
    {
        "value": "SC",
        "label": "Seychelles"
    },
    {
        "value": "SL",
        "label": "Sierra Leone"
    },
    {
        "value": "SG",
        "label": "Singapore"
    },
    {
        "value": "SX",
        "label": "Sint Maarten"
    },
    {
        "value": "SK",
        "label": "Slovacchia"
    },
    {
        "value": "SI",
        "label": "Slovenia"
    },
    {
        "value": "SB",
        "label": "Isole Salomone"
    },
    {
        "value": "SO",
        "label": "Somalia"
    },
    {
        "value": "ZA",
        "label": "Sudafrica"
    },
    {
        "value": "GS",
        "label": "Georgia del Sud e Sandwich australi"
    },
    {
        "value": "KR",
        "label": "Corea del Sud"
    },
    {
        "value": "SS",
        "label": "Sud Sudan"
    },
    {
        "value": "ES",
        "label": "Spagna"
    },
    {
        "value": "LK",
        "label": "Sri Lanka"
    },
    {
        "value": "BL",
        "label": "Saint-Barthélemy"
    },
    {
        "value": "SH",
        "label": "Sant’Elena"
    },
    {
        "value": "KN",
        "label": "Saint Kitts e Nevis"
    },
    {
        "value": "LC",
        "label": "Saint Lucia"
    },
    {
        "value": "MF",
        "label": "Saint Martin"
    },
    {
        "value": "PM",
        "label": "Saint-Pierre e Miquelon"
    },
    {
        "value": "VC",
        "label": "Saint Vincent e Grenadine"
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
        "label": "Svalbard e Jan Mayen"
    },
    {
        "value": "SE",
        "label": "Svezia"
    },
    {
        "value": "SY",
        "label": "Siria"
    },
    {
        "value": "TW",
        "label": "Taiwan"
    },
    {
        "value": "TJ",
        "label": "Tagikistan"
    },
    {
        "value": "TZ",
        "label": "Tanzania"
    },
    {
        "value": "TH",
        "label": "Thailandia"
    },
    {
        "value": "TL",
        "label": "Timor Est"
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
        "label": "Trinidad e Tobago"
    },
    {
        "value": "TN",
        "label": "Tunisia"
    },
    {
        "value": "TR",
        "label": "Turchia"
    },
    {
        "value": "TM",
        "label": "Turkmenistan"
    },
    {
        "value": "TC",
        "label": "Isole Turks e Caicos"
    },
    {
        "value": "TV",
        "label": "Tuvalu"
    },
    {
        "value": "UM",
        "label": "Altre isole americane del Pacifico"
    },
    {
        "value": "VI",
        "label": "Isole Vergini Americane"
    },
    {
        "value": "UG",
        "label": "Uganda"
    },
    {
        "value": "UA",
        "label": "Ucraina"
    },
    {
        "value": "AE",
        "label": "Emirati Arabi Uniti"
    },
    {
        "value": "GB",
        "label": "Regno Unito"
    },
    {
        "value": "UY",
        "label": "Uruguay"
    },
    {
        "value": "UZ",
        "label": "Uzbekistan"
    },
    {
        "value": "VU",
        "label": "Vanuatu"
    },
    {
        "value": "VA",
        "label": "Città del Vaticano"
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
        "label": "Wallis e Futuna"
    },
    {
        "value": "EH",
        "label": "Sahara occidentale"
    },
    {
        "value": "YE",
        "label": "Yemen"
    },
    {
        "value": "ZM",
        "label": "Zambia"
    },
    {
        "value": "ZW",
        "label": "Zimbabwe"
    }
]

export default countyList;