import { POSTS_PATH } from "./constants.js";
import { getAllTags } from "./filters.js";

// every post on disk, newest first, archived included
export function allPosts(collection) {
  return collection.getFilteredByGlob(POSTS_PATH).sort((a, b) => {
    const Adate = a.data.update > a.data.date ? a.data.update : a.data.date;
    const Bdate = b.data.update > b.data.date ? b.data.update : b.data.date;

    return Adate < Bdate ? 1 : -1;
  });
}

// the posts that still represent what I think; drives /writing/, tags and feed
export function posts(collection) {
  return allPosts(collection).filter((post) => !post.data.archived);
}

// the ones I've retired, listed on /archived/ and counted in /stats/
export function archived(collection) {
  return allPosts(collection).filter((post) => post.data.archived);
}

// Drives the /tags/ pages. Built from `posts` so a tag whose only articles are
// archived stops generating a page, rather than generating an empty one.
export function tags(collection) {
  return getAllTags(posts(collection));
}
