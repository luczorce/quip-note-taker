// NOTE these values are different than what the docs say
// also images are not available to be added?
// not even drag and drop works on it
// console.log(quip.apps.RichTextRecord.Style);
export const richTextAllowedStyles = [
  0, // TEXT_PLAIN
  1, // TEXT_H1
  2, // TEXT_H2
  3, // TEXT_H3
  4, // TEXT_CODE
  5, // LIST_BULLET
  6, // LIST_NUMBERED
  // checklist markdown just returns like a bullet list
  // there's no way to differentiate it
  7, // LIST_CHECKLIST
  11, // IMAGE
  16, // TEXT_BLOCKQUOTE
  17, // TEXT_PULL_QUOTE
  18, // HORIZONTAL_RULE
];
