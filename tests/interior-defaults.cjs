const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const read = name => JSON.parse(fs.readFileSync('assets/' + name + '.json', 'utf8'));
const context = vm.createContext({
  RECIPES: read('recipes'), ROOM_FORMULAS: read('room-formulas'),
  FURNITURE_STYLES: read('styles'), LAYOUT_SIZES: read('layout-sizes'),
  CATALOG: read('catalog'), VOCAB: read('vocabulary'), KEYS: []
});
vm.runInContext(['contract', 'furnishing', 'props', 'draw'].map(name =>
  fs.readFileSync('src/' + name + '.js', 'utf8')).join('\n') +
  ';globalThis.api={composeRoom,furnitureLayout,furnitureSupportBounds};', context);
const {composeRoom, furnitureLayout, furnitureSupportBounds} = context.api;
let tabletopCount = 0;
for (const type of Object.keys(context.RECIPES)) {
  for (const size of ['S', 'M', 'L']) {
    const place = {id: 'local-room', name: 'Phòng', type, size, props: []};
    const inventory = composeRoom(place);
    assert.equal(inventory.furnishing.variant, 'approved', type + ' default arrangement');
    assert.equal(inventory.furnishing.style, 'approved', type + ' default color');
    const original = context.RECIPES[type].instancesBySize[size];
    assert.deepEqual(Array.from(inventory.objects, o => o.item), Array.from(original, o => o.item));
    const layout = furnitureLayout({...place, inventory});
    assert.equal(layout.art, context.LAYOUT_SIZES[type][size], type + ' uses its stored layout');
    for (const detail of layout.objects.filter(o => o.node.item.startsWith('tabletop.'))) {
      const support = layout.objects.find(o => o !== detail &&
        o.node.furnitureGroup === detail.node.furnitureGroup &&
        context.CATALOG[o.node.item]?.placement?.supportsDetails);
      if (!support) continue;
      const [x, y, w, h] = detail.bounds;
      const [sx, sy, sw, sh] = furnitureSupportBounds(context.CATALOG[support.node.item], support.bounds);
      assert(x >= sx - .001 && y >= sy - .001 && x + w <= sx + sw + .001 && y + h <= sy + sh + .001,
        type + '/' + size + ': tabletop cluster spills beyond support');
      assert(detail.magnify > 0 && detail.magnify <= 1, 'Tabletop fitting must preserve aspect ratio');
      tabletopCount++;
    }
  }
}
for (const size of ['S', 'M', 'L']) {
  const place = {id: 'hogwarts-library', name: 'Thư viện Hogwarts', type: 'LIBRARY', size};
  const layout = furnitureLayout(place);
  assert.equal(layout.art.source, 'APPROVED_DECOR');
  assert(layout.objects.some(o => o.node.item === 'new.bookcase-glass'));
  assert(layout.objects.every(o => o.magnify === 1 && o.dx === 0 && o.dy === 0),
    'Library authored furniture must retain its transforms');
}
console.log('PASS 147 authored defaults, LIBRARY S/M/L and ' + tabletopCount + ' supported tabletop clusters');
