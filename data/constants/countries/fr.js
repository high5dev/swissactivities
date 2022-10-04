const countyList = [
    {
        "value": "CH",
        "label": "Suisse"
    },
    {
        "value": "AT",
        "label": "Autriche"
    },
    {
        "value": "FR",
        "label": "France"
    },
    {
        "value": "DE",
        "label": "Allemagne"
    },
    {
        "value": "IT",
        "label": "Italie"
    },
    {
        "value": "NL",
        "label": "Pays-Bas"
    },
    {
        "value": "US",
        "label": "États-Unis"
    },
    {
        "value": "AF",
        "label": "Afghanistan"
    },
    {
        "value": "AX",
        "label": "Îles Åland"
    },
    {
        "value": "AL",
        "label": "Albanie"
    },
    {
        "value": "DZ",
        "label": "Algérie"
    },
    {
        "value": "AS",
        "label": "Samoa américaines"
    },
    {
        "value": "AD",
        "label": "Andorre"
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
        "label": "Antarctique"
    },
    {
        "value": "AG",
        "label": "Antigua-et-Barbuda"
    },
    {
        "value": "AR",
        "label": "Argentine"
    },
    {
        "value": "AM",
        "label": "Arménie"
    },
    {
        "value": "AW",
        "label": "Aruba"
    },
    {
        "value": "AU",
        "label": "Australie"
    },
    {
        "value": "AZ",
        "label": "Azerbaïdjan"
    },
    {
        "value": "BS",
        "label": "Bahamas"
    },
    {
        "value": "BH",
        "label": "Bahreïn"
    },
    {
        "value": "BD",
        "label": "Bangladesh"
    },
    {
        "value": "BB",
        "label": "Barbade"
    },
    {
        "value": "BY",
        "label": "Biélorussie"
    },
    {
        "value": "BE",
        "label": "Belgique"
    },
    {
        "value": "BZ",
        "label": "Belize"
    },
    {
        "value": "BJ",
        "label": "Bénin"
    },
    {
        "value": "BM",
        "label": "Bermudes"
    },
    {
        "value": "BT",
        "label": "Bhoutan"
    },
    {
        "value": "BO",
        "label": "Bolivie"
    },
    {
        "value": "BA",
        "label": "Bosnie-Herzégovine"
    },
    {
        "value": "BW",
        "label": "Botswana"
    },
    {
        "value": "BV",
        "label": "Île Bouvet"
    },
    {
        "value": "BR",
        "label": "Brésil"
    },
    {
        "value": "IO",
        "label": "Territoire britannique de l’océan Indien"
    },
    {
        "value": "VG",
        "label": "Îles Vierges britanniques"
    },
    {
        "value": "BN",
        "label": "Brunéi Darussalam"
    },
    {
        "value": "BG",
        "label": "Bulgarie"
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
        "label": "Cambodge"
    },
    {
        "value": "CM",
        "label": "Cameroun"
    },
    {
        "value": "CA",
        "label": "Canada"
    },
    {
        "value": "CV",
        "label": "Cap-Vert"
    },
    {
        "value": "BQ",
        "label": "Pays-Bas caribéens"
    },
    {
        "value": "KY",
        "label": "Îles Caïmans"
    },
    {
        "value": "CF",
        "label": "République centrafricaine"
    },
    {
        "value": "TD",
        "label": "Tchad"
    },
    {
        "value": "CL",
        "label": "Chili"
    },
    {
        "value": "CN",
        "label": "Chine"
    },
    {
        "value": "CX",
        "label": "Île Christmas"
    },
    {
        "value": "CC",
        "label": "Îles Cocos"
    },
    {
        "value": "CO",
        "label": "Colombie"
    },
    {
        "value": "KM",
        "label": "Comores"
    },
    {
        "value": "CG",
        "label": "Congo-Brazzaville"
    },
    {
        "value": "CD",
        "label": "Congo-Kinshasa"
    },
    {
        "value": "CK",
        "label": "Îles Cook"
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
        "label": "Croatie"
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
        "label": "Chypre"
    },
    {
        "value": "CZ",
        "label": "Tchéquie"
    },
    {
        "value": "DK",
        "label": "Danemark"
    },
    {
        "value": "DJ",
        "label": "Djibouti"
    },
    {
        "value": "DM",
        "label": "Dominique"
    },
    {
        "value": "DO",
        "label": "République dominicaine"
    },
    {
        "value": "EC",
        "label": "Équateur"
    },
    {
        "value": "EG",
        "label": "Égypte"
    },
    {
        "value": "SV",
        "label": "Salvador"
    },
    {
        "value": "GQ",
        "label": "Guinée équatoriale"
    },
    {
        "value": "ER",
        "label": "Érythrée"
    },
    {
        "value": "EE",
        "label": "Estonie"
    },
    {
        "value": "SZ",
        "label": "Eswatini"
    },
    {
        "value": "ET",
        "label": "Éthiopie"
    },
    {
        "value": "FK",
        "label": "Îles Malouines"
    },
    {
        "value": "FO",
        "label": "Îles Féroé"
    },
    {
        "value": "FJ",
        "label": "Fidji"
    },
    {
        "value": "FI",
        "label": "Finlande"
    },
    {
        "value": "GF",
        "label": "Guyane française"
    },
    {
        "value": "PF",
        "label": "Polynésie française"
    },
    {
        "value": "TF",
        "label": "Terres australes françaises"
    },
    {
        "value": "GA",
        "label": "Gabon"
    },
    {
        "value": "GM",
        "label": "Gambie"
    },
    {
        "value": "GE",
        "label": "Géorgie"
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
        "label": "Grèce"
    },
    {
        "value": "GL",
        "label": "Groenland"
    },
    {
        "value": "GD",
        "label": "Grenade"
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
        "label": "Guernesey"
    },
    {
        "value": "GN",
        "label": "Guinée"
    },
    {
        "value": "GW",
        "label": "Guinée-Bissau"
    },
    {
        "value": "GY",
        "label": "Guyana"
    },
    {
        "value": "HT",
        "label": "Haïti"
    },
    {
        "value": "HM",
        "label": "Îles Heard et McDonald"
    },
    {
        "value": "HN",
        "label": "Honduras"
    },
    {
        "value": "HK",
        "label": "R.A.S. chinoise de Hong Kong"
    },
    {
        "value": "HU",
        "label": "Hongrie"
    },
    {
        "value": "IS",
        "label": "Islande"
    },
    {
        "value": "IN",
        "label": "Inde"
    },
    {
        "value": "ID",
        "label": "Indonésie"
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
        "label": "Irlande"
    },
    {
        "value": "IM",
        "label": "Île de Man"
    },
    {
        "value": "IL",
        "label": "Israël"
    },
    {
        "value": "JM",
        "label": "Jamaïque"
    },
    {
        "value": "JP",
        "label": "Japon"
    },
    {
        "value": "JE",
        "label": "Jersey"
    },
    {
        "value": "JO",
        "label": "Jordanie"
    },
    {
        "value": "KZ",
        "label": "Kazakhstan"
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
        "label": "Koweït"
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
        "label": "Lettonie"
    },
    {
        "value": "LB",
        "label": "Liban"
    },
    {
        "value": "LS",
        "label": "Lesotho"
    },
    {
        "value": "LR",
        "label": "Libéria"
    },
    {
        "value": "LY",
        "label": "Libye"
    },
    {
        "value": "LI",
        "label": "Liechtenstein"
    },
    {
        "value": "LT",
        "label": "Lituanie"
    },
    {
        "value": "LU",
        "label": "Luxembourg"
    },
    {
        "value": "MO",
        "label": "R.A.S. chinoise de Macao"
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
        "label": "Malaisie"
    },
    {
        "value": "MV",
        "label": "Maldives"
    },
    {
        "value": "ML",
        "label": "Mali"
    },
    {
        "value": "MT",
        "label": "Malte"
    },
    {
        "value": "MH",
        "label": "Îles Marshall"
    },
    {
        "value": "MQ",
        "label": "Martinique"
    },
    {
        "value": "MR",
        "label": "Mauritanie"
    },
    {
        "value": "MU",
        "label": "Maurice"
    },
    {
        "value": "YT",
        "label": "Mayotte"
    },
    {
        "value": "MX",
        "label": "Mexique"
    },
    {
        "value": "FM",
        "label": "États fédérés de Micronésie"
    },
    {
        "value": "MD",
        "label": "Moldavie"
    },
    {
        "value": "MC",
        "label": "Monaco"
    },
    {
        "value": "MN",
        "label": "Mongolie"
    },
    {
        "value": "ME",
        "label": "Monténégro"
    },
    {
        "value": "MS",
        "label": "Montserrat"
    },
    {
        "value": "MA",
        "label": "Maroc"
    },
    {
        "value": "MZ",
        "label": "Mozambique"
    },
    {
        "value": "MM",
        "label": "Myanmar (Birmanie)"
    },
    {
        "value": "NA",
        "label": "Namibie"
    },
    {
        "value": "NR",
        "label": "Nauru"
    },
    {
        "value": "NP",
        "label": "Népal"
    },
    {
        "value": "NC",
        "label": "Nouvelle-Calédonie"
    },
    {
        "value": "NZ",
        "label": "Nouvelle-Zélande"
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
        "label": "Nigéria"
    },
    {
        "value": "NU",
        "label": "Niue"
    },
    {
        "value": "NF",
        "label": "Île Norfolk"
    },
    {
        "value": "KP",
        "label": "Corée du Nord"
    },
    {
        "value": "MK",
        "label": "Macédoine du Nord"
    },
    {
        "value": "MP",
        "label": "Îles Mariannes du Nord"
    },
    {
        "value": "NO",
        "label": "Norvège"
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
        "label": "Palaos"
    },
    {
        "value": "PS",
        "label": "Territoires palestiniens"
    },
    {
        "value": "PA",
        "label": "Panama"
    },
    {
        "value": "PG",
        "label": "Papouasie-Nouvelle-Guinée"
    },
    {
        "value": "PY",
        "label": "Paraguay"
    },
    {
        "value": "PE",
        "label": "Pérou"
    },
    {
        "value": "PH",
        "label": "Philippines"
    },
    {
        "value": "PN",
        "label": "Îles Pitcairn"
    },
    {
        "value": "PL",
        "label": "Pologne"
    },
    {
        "value": "PT",
        "label": "Portugal"
    },
    {
        "value": "PR",
        "label": "Porto Rico"
    },
    {
        "value": "QA",
        "label": "Qatar"
    },
    {
        "value": "RE",
        "label": "La Réunion"
    },
    {
        "value": "RO",
        "label": "Roumanie"
    },
    {
        "value": "RU",
        "label": "Russie"
    },
    {
        "value": "RW",
        "label": "Rwanda"
    },
    {
        "value": "WS",
        "label": "Samoa"
    },
    {
        "value": "SM",
        "label": "Saint-Marin"
    },
    {
        "value": "ST",
        "label": "Sao Tomé-et-Principe"
    },
    {
        "value": "SA",
        "label": "Arabie saoudite"
    },
    {
        "value": "SN",
        "label": "Sénégal"
    },
    {
        "value": "RS",
        "label": "Serbie"
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
        "label": "Singapour"
    },
    {
        "value": "SX",
        "label": "Saint-Martin (partie néerlandaise)"
    },
    {
        "value": "SK",
        "label": "Slovaquie"
    },
    {
        "value": "SI",
        "label": "Slovénie"
    },
    {
        "value": "SB",
        "label": "Îles Salomon"
    },
    {
        "value": "SO",
        "label": "Somalie"
    },
    {
        "value": "ZA",
        "label": "Afrique du Sud"
    },
    {
        "value": "GS",
        "label": "Géorgie du Sud et îles Sandwich du Sud"
    },
    {
        "value": "KR",
        "label": "Corée du Sud"
    },
    {
        "value": "SS",
        "label": "Soudan du Sud"
    },
    {
        "value": "ES",
        "label": "Espagne"
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
        "label": "Sainte-Hélène"
    },
    {
        "value": "KN",
        "label": "Saint-Christophe-et-Niévès"
    },
    {
        "value": "LC",
        "label": "Sainte-Lucie"
    },
    {
        "value": "MF",
        "label": "Saint-Martin"
    },
    {
        "value": "PM",
        "label": "Saint-Pierre-et-Miquelon"
    },
    {
        "value": "VC",
        "label": "Saint-Vincent-et-les-Grenadines"
    },
    {
        "value": "SD",
        "label": "Soudan"
    },
    {
        "value": "SR",
        "label": "Suriname"
    },
    {
        "value": "SJ",
        "label": "Svalbard et Jan Mayen"
    },
    {
        "value": "SE",
        "label": "Suède"
    },
    {
        "value": "SY",
        "label": "Syrie"
    },
    {
        "value": "TW",
        "label": "Taïwan"
    },
    {
        "value": "TJ",
        "label": "Tadjikistan"
    },
    {
        "value": "TZ",
        "label": "Tanzanie"
    },
    {
        "value": "TH",
        "label": "Thaïlande"
    },
    {
        "value": "TL",
        "label": "Timor oriental"
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
        "label": "Trinité-et-Tobago"
    },
    {
        "value": "TN",
        "label": "Tunisie"
    },
    {
        "value": "TR",
        "label": "Turquie"
    },
    {
        "value": "TM",
        "label": "Turkménistan"
    },
    {
        "value": "TC",
        "label": "Îles Turques-et-Caïques"
    },
    {
        "value": "TV",
        "label": "Tuvalu"
    },
    {
        "value": "UM",
        "label": "Îles mineures éloignées des États-Unis"
    },
    {
        "value": "VI",
        "label": "Îles Vierges des États-Unis"
    },
    {
        "value": "UG",
        "label": "Ouganda"
    },
    {
        "value": "UA",
        "label": "Ukraine"
    },
    {
        "value": "AE",
        "label": "Émirats arabes unis"
    },
    {
        "value": "GB",
        "label": "Royaume-Uni"
    },
    {
        "value": "UY",
        "label": "Uruguay"
    },
    {
        "value": "UZ",
        "label": "Ouzbékistan"
    },
    {
        "value": "VU",
        "label": "Vanuatu"
    },
    {
        "value": "VA",
        "label": "État de la Cité du Vatican"
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
        "label": "Wallis-et-Futuna"
    },
    {
        "value": "EH",
        "label": "Sahara occidental"
    },
    {
        "value": "YE",
        "label": "Yémen"
    },
    {
        "value": "ZM",
        "label": "Zambie"
    },
    {
        "value": "ZW",
        "label": "Zimbabwe"
    }
]

export default countyList;