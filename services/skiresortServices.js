
const SKIRESORT_LIST_CACHE = [];

export async function getSkiresortInfo(id) {
    return (await getSkiresorts()).find(d => d.id == id);
}

/**
 * Service for loading skiresort info
 * @returns {Promise<Array>}
 * @see https://www.skiresort-service.com/fileadmin/user_upload/skiresort-service/content/engl/Skiresort-XML-interface_documentation_engl.pdf
 */
export async function getSkiresorts() {
    if (!SKIRESORT_LIST_CACHE.length) {
        console.log('loading skiresorts', process.env.SKIRESORT_SERVICE_API_URL)
        await fetch(process.env.SKIRESORT_SERVICE_API_URL)
            .then(res => {
                if (!res.ok) {
                    console.error('[Skiresorts Error] Can not load xml %o', {status: res.status, text: res.statusText, url: res.url});
                }
                return res.text();
            })
            .then(parseXml)
            .catch(console.error)
    }

    return SKIRESORT_LIST_CACHE;
}

export function parseData(skiresortInfo) {
  const photos = [];
  for (let i = 1; i <= 9; i++) {
    if (!skiresortInfo['bild'+i]) {
      break;
    }
    photos.push(skiresortInfo['bild'+i]);
  }

  return {
    id: skiresortInfo.region_id,
    mapLink: skiresortInfo.pistenplan_datei, // TODO: add link for skiresort map
    lastUpdate: skiresortInfo.letzte_aktualisierung,
    isOpen: skiresortInfo.region_offen,
    snow: {
      lastFall: skiresortInfo.letzter_schneefall,
      quality: skiresortInfo.schneequalitaet,
      mountainCm: skiresortInfo.schneehoehe_berg,
      valleyCm: skiresortInfo.schneehoehe_tal,
    },
    lifts: {
      openKm: skiresortInfo.offene_lifte,
      totalKm: skiresortInfo.lifte_gesamt,
    },
    slopes: {
      openKm: skiresortInfo.befahrbare_pisten_km,
      totalKm: skiresortInfo.pisten_km_gesamt,
    },
    hiking: {
      isAvailable: skiresortInfo.winterwanderwege_vorhanden,
      totalKm: skiresortInfo.winterwanderwege_offen_in_km,
    },
    crossSkiing: {
      isAvailable: skiresortInfo.loipen_vorhanden,
      totalKm: skiresortInfo.gespurte_loipen_km,
    },
    snowpark: {
      isAvailable: skiresortInfo.funpark_vorhanden,
      status: skiresortInfo.zustand_funpark,
    },
    halfpipe: {
      isAvailable: skiresortInfo.halfpipe_vorhanden,
      status: skiresortInfo.zustand_halfpipe,
    },
    nightSkiing: {
      isAvailable: skiresortInfo.nachtski,
      status: skiresortInfo.nachtski_text,
      time: skiresortInfo.nachtski_bis_uhrzeit,
    },
    valleySkiing: {
      isAvailable: skiresortInfo.talabfahrt_vorhanden,
      status: skiresortInfo.zustand_talabfahrt,
    },
    photos,
  }
}

function parseXml(str) {
    const {JSDOM} = require("jsdom");
    const doc = (new JSDOM(str))?.window?.document;
    const regionIds = doc.getElementsByTagName('region_id');

    if (!regionIds.length) {
        console.error('[Skiresorts Error] Can not find any <region_id> elements');
    }

    for (let regionId of regionIds) {
        let regionData = convertXml2js(regionId.parentElement);
        if (regionData && regionData.region_id) {
            SKIRESORT_LIST_CACHE.push(parseData(regionData));
        }
    }

    return SKIRESORT_LIST_CACHE;
}

/**
 * @param {Element} element
 */
function convertXml2js(element, isArray = false) {
    const data = {};
    for (let item of element.children) {
        let value, key = item.tagName.toLowerCase();
        if (item.getAttribute('type') === 'array') {
            value = convertXml2js(item);
            if (item.hasAttribute('index')) {
                isArray = true;
                key = item.getAttribute('index');
            }
        } else {
            value = transformValue(item.textContent);
        }

        data[key] = value;
    }

    return isArray ? Object.values(data) : data;
}

function transformValue(value) {
    switch (true) {
        case value === 'true':
            return true;
        case value === 'false':
            return false;
        case (typeof value === 'string' && value !== ''):
            const numericValue = parseFloat(value);
            return numericValue == value ? numericValue : value.trim();
    }
    return value;
}
