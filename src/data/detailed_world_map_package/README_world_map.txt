Detailed World Map (SVG)
=========================

This SVG map was generated from the `world.geo.json` country dataset you provided.

What this map includes
----------------------
- Country polygons for all 180 countries in the dataset
- Labels for the larger countries (by visual area)
- Approximate labels for:
  * Continents
  * Oceans and major seas
  * Major deserts
  * Major mountain ranges
  * A handful of iconic rivers
  * Several major world cities and capitals
- A light graticule (lat/lon grid) for orientation

Technical notes
---------------
- Projection: Simple equirectangular (Plate Carrée) using lon/lat as-is.
- Size: 4096 x 2048 px, scalable as vector graphics.
- Styling is embedded in a <style> block at the top of the SVG, so you can
  edit colors, fonts, and label sizes directly.

Limitations
-----------
- The source GeoJSON only contains country boundaries; it does NOT include
  official GIS layers for rivers, lakes, cities, mountains, or deserts.
  Those features are added as approximate text labels at hand-picked locations,
  not as precise geometric shapes.
- Not every capital or city is included, only a representative selection of
  major cities worldwide.
- This is a schematic “teaching / reference” style map rather than a
  cartographically rigorous product.

How to use
----------
- Open `detailed_world_map.svg` in:
  * A vector editor (e.g. Adobe Illustrator, Affinity Designer, Inkscape, Figma)
  * A web app or React component (embed as an <img> or inline <svg>)
- You can:
  * Change colors and fonts
  * Toggle layers on/off (countries, cities, deserts, etc. groups)
  * Add more labels or features
  * Export high-resolution PNGs or PDFs for print.

If you later provide richer GeoJSON (Natural Earth rivers, lakes, populated
places, etc.), this SVG can be regenerated with true geometry for those layers.
