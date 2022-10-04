const BASE_URL = "https://swissactivities.com/blog/wp-json/wp/v2";

export const getPosts = async () => {
  const postsRes = await fetch(BASE_URL + "/posts?_embed");
  return await postsRes.json();
};

export const getPost = async (slug) => {
  const posts = await getPosts();
  const postArray = posts.filter((post) => post.slug === slug);
  return postArray.length > 0 ? postArray[0] : null;
};

export const getSlugs = async (type) => {
  let elements = [];
  switch (type) {
    case "posts":
      elements = await getPosts();
      break;
  }
  return elements.map((element) => {
    return {
      params: {
        slug: element.slug,
      },
    };
  });
};

export const getDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
