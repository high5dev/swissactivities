import Image from 'next/image'

const createCustomImageLoader = imgProps => ({src, width, quality}) => {
  const params = [
    'auto=format,compress',
    'fit=' + (imgProps.fit || 'crop'),
    'crop=edges',
    'w=' + (imgProps.width || width), // with is not properly propagated by next/image even if layout="fixed" and "width" is set
  ];

  if (imgProps.height) {
    params.push('h=' + imgProps.height);
  }

  if (quality) {
    params.push('q=' + quality)
  }

  return normalizeSrc(src) + '?' + params.join('&');
}

function normalizeSrc(src) {
  if (process.env.NEXT_PUBLIC_CDN === 'imgix') {
    if (src.startsWith('https://fra1.digitaloceanspaces.com')) {
      return src.replace(
        'https://fra1.digitaloceanspaces.com',
        'https://contentapi-swissactivities.imgix.net',
      );
    }

    if (src.startsWith('/assets')) {
      return src.replace('/assets', 'https://website-swissactivities.imgix.net/assets');
    }
  }

  return src;
}

const StaticImage = props => {
  const imageLoader = createCustomImageLoader(props);

  return <Image
    {...props}
    loader={imageLoader}
  />
}

export default StaticImage;
