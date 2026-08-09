import { POSTS_PATH } from "./constants.js";
import { getAllTags } from "./filters.js";

// collection for all posts, incl. drafts option
export function posts(collection) {
  return collection
    .getFilteredByGlob(POSTS_PATH)
    .filter((post) => !post.data.archived)
    .sort((a, b) => {
      const Adate = a.data.update > a.data.date ? a.data.update : a.data.date;
      const Bdate = b.data.update > b.data.date ? b.data.update : b.data.date;

      return Adate < Bdate ? 1 : -1;
    });
}

// Drives the /tags/ pages. Built from `posts` so a tag whose only articles are
// archived stops generating a page, rather than generating an empty one.
export function tags(collection) {
  return getAllTags(posts(collection));
}
