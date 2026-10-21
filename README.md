# Portfolio

[https://yurikoshiishi.com/](https://yurikoshiishi.com/)

The business card scene, played straight. A daylit meeting room at Pierce &
Pierce; four cards slide across the table; the last one is mine.

- `index.html`, `src/scene/` — the film: three.js, a shot timeline, depth of
  field and grade via `postprocessing`, synthesised sound.
- `src/scene/stock.worker.js` — each card's paper, ink and press are generated
  in a worker at load, from the type layout in `src/scene/cards.js`.
- `public/scene/room.hdr` — the room, path-traced in Blender and used as both
  background and light. Rebuild it with
  `python tools/blender/room.py --out public/scene/room.hdr` (needs
  `pip install bpy`; about 15 minutes on four CPU cores).
- `card.html` — the flat card. Served when WebGL2 or JavaScript is missing.

`?seek=30` starts the film at 30 seconds; `?raw` renders without
post-processing.
