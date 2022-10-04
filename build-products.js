const { parse } = require('json2csv');
const { promises: fs } = require("fs");
const path = require('path');
// const fetch = require('node-fetch');



async function _loadData(fs, name) {
  console.log(`loading ${name}`);
  const filePath = path.join('.', 'var', name + '.json');
  const data = await fs.readFile(filePath, 'utf8');

  return JSON.parse(data);
}


function normalizeSrc(src) {
  if (process.env.NEXT_PUBLIC_CDN === 'imgix') {
    if (src.startsWith('https://fra1.digitaloceanspaces.com')) {
      return src.replace('https://fra1.digitaloceanspaces.com', 'https://contentapi-swissactivities.imgix.net');
    }

    if (src.startsWith('/assets')) {
      return src.replace('/assets', 'https://website-swissactivities.imgix.net/assets');
    }
  }

  return src;
}

async function buildProducts()  {
  const name = "build products list"
  console.time(name);

  try {
    const { activities } = await _loadData(fs, 'activities');
    // const mapping = await fetch(`${process.env.NEXT_PUBLIC_BOOKINGAPI_HOST}/activities/mappings`).then(r=> r.json());

    const fields = ['Product Name', 'Product ID / SKU', 'Product Image URL', "Product Page URL"];
    const opts = { fields };

    // const bapiIds = Object.keys(mapping.contentApiIds);
    const productsList = activities.map((act) => {
      const teaserUrl = act.teaser_image
      && (act.teaser_image.formats
        && ((act.teaser_image.formats.medium && act.teaser_image.formats.medium.url)
        || act.teaser_image.formats.thumbnail.url)
      || act.teaser_image.url);

      return ({
      [fields[0]]: act.info.title,
      // [fields[1]]: bapiIds.find(el => mapping.contentApiIds[el] === parseInt(act.id)),
      [fields[1]]: parseInt(act.id),
      [fields[2]]: teaserUrl && normalizeSrc(teaserUrl),
      [fields[3]]: `${process.env.NEXT_PUBLIC_BASE_URL}/${act.info.slug}`,
    })})

    try {
      const csv = parse(productsList, opts);
      await fs.writeFile(path.join(__dirname, 'public/', 'products_list.csv'), csv);

    } catch (err) {
      console.error(err);
    }


    console.timeEnd(name);
  } catch (e) {
    console.error(e);
    console.timeEnd(name);
  }
}

(async () => {
  await buildProducts();
})();
