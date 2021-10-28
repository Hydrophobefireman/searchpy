export interface ImageSearchResults {
  fallback: string;
  img: string;
  link: string;
  title: string;
}
export interface ResultType {
  google: Array<ImageSearchResults>;
  bing: Array<ImageSearchResults>;
}
