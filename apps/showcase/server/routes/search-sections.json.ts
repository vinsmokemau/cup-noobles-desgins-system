// T11.1 (REQ-056, ADR-0002 §5): the data of the global search, prerendered to /search-sections.json. The static site has
// no server, so the file is written at build time and the palette fetches it the first time it opens.
//
// It holds the frontmatter that the pages group needs (title, layer, component names) and one section per heading with
// its anchor. The text of each section is left out: the search matches titles, headings, token paths, and component
// names (REQ-056 AC1), and the file stays small. Token paths come from tokens.flat.json in the browser, not from here.
export default defineEventHandler(async (event) => {
  const [pages, sections] = await Promise.all([
    queryCollection(event, 'docs').select('path', 'title', 'layer', 'level', 'nuxtUi', 'component').all(),
    queryCollectionSearchSections(event, 'docs'),
  ])
  return {
    pages,
    sections: sections.map(({ id, title, titles, level }) => ({ id, title, titles, level })),
  }
})
