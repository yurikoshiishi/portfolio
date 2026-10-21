"""
The Pierce & Pierce meeting room, as a 360° light probe.

Rendered once from the middle of the conference table and shipped as an
equirectangular HDR. The site uses it twice: as the out-of-focus room behind
the cards, and as the light that falls on them. The table itself is left
invisible to the camera here because the site draws its own, in focus.

    python tools/blender/room.py --out public/scene/room.hdr [--res 2048] [--samples 160] [--ship 1024]

It renders at --res and ships at --ship: the room is only ever seen through
a wide-open lens, so the smaller file loses nothing on screen.

Needs the `bpy` module (pip install bpy). Units are metres, Z up, origin on
the floor under the centre of the table. The window wall is +Y.
"""

import argparse
import math
import sys

import bpy

argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:]
ap = argparse.ArgumentParser()
ap.add_argument("--out", required=True)
ap.add_argument("--res", type=int, default=2048)
ap.add_argument("--samples", type=int, default=160)
ap.add_argument("--preview", help="also write a tone-mapped PNG here")
ap.add_argument("--ship", type=int, default=1024, help="width of the file written to --out")
args = ap.parse_args(argv)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

ROOM_X = 10.0
ROOM_Y = 8.0
CEIL = 2.9
TABLE_TOP = 0.74
EYE = TABLE_TOP + 0.06


# ---------------------------------------------------------------- materials


def principled(name, color, rough=0.6, metal=0.0, spec=0.5, emit=None, strength=0.0, coat=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Specular IOR Level"].default_value = spec
    if coat:
        b.inputs["Coat Weight"].default_value = coat
        b.inputs["Coat Roughness"].default_value = 0.05
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1)
        b.inputs["Emission Strength"].default_value = strength
    return m


def srgb(h):
    """hex → linear rgb"""
    h = h.lstrip("#")
    c = [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


wall = principled("wall", srgb("#d9d6cf"), rough=0.85)
wall_dark = principled("panel", srgb("#4a3a2e"), rough=0.4, coat=0.4)
carpet = principled("carpet", srgb("#4b4b4d"), rough=1.0, spec=0.2)
ceiling = principled("ceiling", srgb("#e6e4df"), rough=0.9)
alu = principled("mullion", srgb("#3a3b3d"), rough=0.35, metal=0.9)
blind = principled("blind", srgb("#cfcdc7"), rough=0.5)
leather = principled("leather", srgb("#151413"), rough=0.42, spec=0.6)
chrome = principled("chrome", srgb("#c8c8c8"), rough=0.12, metal=1.0)
fluo = principled("fluorescent", srgb("#ffffff"), rough=0.5, emit=srgb("#f3f6ff"), strength=3.6)
table_mat = principled("table", srgb("#1a1512"), rough=0.3, coat=1.0)
credenza = principled("credenza", srgb("#2a211b"), rough=0.35, coat=0.6)
art_a = principled("art_a", srgb("#2f6f73"), rough=0.8)
art_b = principled("art_b", srgb("#d98c73"), rough=0.8)
art_c = principled("art_c", srgb("#e9e2d2"), rough=0.8)
frame_m = principled("frame", srgb("#101010"), rough=0.3, metal=0.6)
plant = principled("plant", srgb("#2f4a2a"), rough=0.7)
pot = principled("pot", srgb("#bdb7ab"), rough=0.6)


def facade_material(name, base, seed):
    """Office towers across the street: a window grid, fading into haze with distance."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nodes = nt.nodes
    links = nt.links
    bsdf = nodes["Principled BSDF"]
    out = nodes["Material Output"]

    coord = nodes.new("ShaderNodeTexCoord")
    sep = nodes.new("ShaderNodeSeparateXYZ")
    links.new(coord.outputs["Object"], sep.inputs[0])

    # floors every 3.6m, bays every 1.5m — a grid of dark glass and pale spandrel
    def band(axis_out, period, duty):
        mul = nodes.new("ShaderNodeMath")
        mul.operation = "DIVIDE"
        mul.inputs[1].default_value = period
        links.new(axis_out, mul.inputs[0])
        fr = nodes.new("ShaderNodeMath")
        fr.operation = "FRACT"
        links.new(mul.outputs[0], fr.inputs[0])
        gt = nodes.new("ShaderNodeMath")
        gt.operation = "GREATER_THAN"
        gt.inputs[1].default_value = duty
        links.new(fr.outputs[0], gt.inputs[0])
        return gt.outputs[0]

    floors = band(sep.outputs["Z"], 3.6, 0.38)
    add = nodes.new("ShaderNodeMath")
    add.operation = "ADD"
    links.new(sep.outputs["X"], add.inputs[0])
    links.new(sep.outputs["Y"], add.inputs[1])
    bays = band(add.outputs[0], 1.5, 0.12)
    glass = nodes.new("ShaderNodeMath")
    glass.operation = "MULTIPLY"
    links.new(floors, glass.inputs[0])
    links.new(bays, glass.inputs[1])

    noise = nodes.new("ShaderNodeTexNoise")
    noise.noise_dimensions = "4D"
    noise.inputs["Scale"].default_value = 0.35
    noise.inputs["W"].default_value = seed
    links.new(coord.outputs["Object"], noise.inputs["Vector"])

    col = nodes.new("ShaderNodeMix")
    col.data_type = "RGBA"
    col.inputs[6].default_value = (*base, 1)
    col.inputs[7].default_value = (*srgb("#2b3138"), 1)
    links.new(glass.outputs[0], col.inputs[0])

    # aerial perspective: mix toward the overcast sky with view distance
    cam = nodes.new("ShaderNodeCameraData")
    haze_t = nodes.new("ShaderNodeMapRange")
    haze_t.inputs["From Min"].default_value = 30
    haze_t.inputs["From Max"].default_value = 420
    haze_t.inputs["To Min"].default_value = 0.15
    haze_t.inputs["To Max"].default_value = 0.85
    links.new(cam.outputs["View Distance"], haze_t.inputs["Value"])

    lit = nodes.new("ShaderNodeEmission")
    lit.inputs["Strength"].default_value = 1.0
    links.new(col.outputs[2], lit.inputs["Color"])

    haze = nodes.new("ShaderNodeEmission")
    haze.inputs["Color"].default_value = (*srgb("#c9d0d6"), 1)
    haze.inputs["Strength"].default_value = 4.4

    # facades are lit by the same sky; an emission approximation keeps the
    # probe noise-free and costs nothing
    gain = nodes.new("ShaderNodeMath")
    gain.operation = "MULTIPLY_ADD"
    links.new(noise.outputs["Fac"], gain.inputs[0])
    gain.inputs[1].default_value = 0.6
    gain.inputs[2].default_value = 1.3
    links.new(gain.outputs[0], lit.inputs["Strength"])

    mix = nodes.new("ShaderNodeMixShader")
    links.new(haze_t.outputs["Result"], mix.inputs[0])
    links.new(lit.outputs[0], mix.inputs[1])
    links.new(haze.outputs[0], mix.inputs[2])
    nodes.remove(bsdf)
    links.new(mix.outputs[0], out.inputs["Surface"])
    return m


# ---------------------------------------------------------------- geometry


def box(name, size, loc, mat, bevel=0.0, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        mod = o.modifiers.new("bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 4
        mod.limit_method = "NONE"
    o.data.materials.append(mat)
    return o


def cyl(name, r, h, loc, mat, verts=32):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, location=loc, vertices=verts)
    o = bpy.context.active_object
    o.name = name
    o.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return o


hx, hy = ROOM_X / 2, ROOM_Y / 2

# shell
box("floor", (ROOM_X, ROOM_Y, 0.02), (0, 0, -0.01), carpet)
box("ceiling", (ROOM_X, ROOM_Y, 0.02), (0, 0, CEIL + 0.01), ceiling)
box("wall_back", (ROOM_X, 0.1, CEIL), (0, -hy - 0.05, CEIL / 2), wall)
box("wall_left", (0.1, ROOM_Y, CEIL), (-hx - 0.05, 0, CEIL / 2), wall)
box("wall_right", (0.1, ROOM_Y, CEIL), (hx + 0.05, 0, CEIL / 2), wall_dark)

# window wall: sill, head, mullions, blinds. The glazing is left open.
SILL = 0.32
HEAD = 2.72
box("sill", (ROOM_X, 0.35, SILL), (0, hy + 0.1, SILL / 2), wall)
box("head", (ROOM_X, 0.35, CEIL - HEAD), (0, hy + 0.1, (CEIL + HEAD) / 2), wall)
n_bays = 6
for i in range(n_bays + 1):
    x = -hx + i * ROOM_X / n_bays
    box(f"mullion{i}", (0.07, 0.12, HEAD - SILL), (x, hy + 0.05, (SILL + HEAD) / 2), alu)
box("transom", (ROOM_X, 0.1, 0.06), (0, hy + 0.05, 2.18), alu)

# venetian blinds pulled two-thirds up, slats tilted open
slat_top = HEAD - 0.04
slat_bottom = 1.86
z = slat_top
k = 0
while z > slat_bottom:
    box(f"slat{k}", (ROOM_X - 0.1, 0.05, 0.004), (0, hy - 0.06, z), blind, rot=(math.radians(32), 0, 0))
    z -= 0.045
    k += 1
box("blind_rail", (ROOM_X - 0.1, 0.06, 0.03), (0, hy - 0.06, slat_bottom - 0.03), blind)

# the street: towers across the avenue, staggered back into the haze
import random

random.seed(7)
tones = ["#9a948b", "#b7b1a6", "#8c8f93", "#a59d90", "#c2beb6", "#7e8389"]
for i in range(26):
    d = 45 + random.random() * 300
    x = (random.random() - 0.5) * (d * 1.6)
    w = 18 + random.random() * 30
    depth = 18 + random.random() * 20
    h = 40 + random.random() * 160
    o = box(f"tower{i}", (w, depth, h), (x, hy + d, h / 2 - 20), facade_material(f"facade{i}", srgb(random.choice(tones)), i))

# fluorescent ceiling panels on a grid
for ix in range(-2, 3):
    for iy in range(-2, 2):
        box(f"fluo{ix}_{iy}", (1.2, 0.6, 0.02), (ix * 1.9, iy * 1.8 + 0.4, CEIL - 0.005), fluo)

# the conference table: drawn by the site, here only for light and reflections
table = box("table", (4.6, 1.3, 0.05), (0, 0, TABLE_TOP - 0.025), table_mat, bevel=0.01)
table.visible_camera = False
for sx in (-1.7, 1.7):
    t = box(f"table_leg{sx}", (0.5, 0.9, TABLE_TOP - 0.05), (sx, 0, (TABLE_TOP - 0.05) / 2), table_mat)
    t.visible_camera = False


# executive chairs around the table
def chair(x, y, facing):
    c = math.cos(facing)
    s = math.sin(facing)

    def at(dx, dy, dz):
        return (x + dx * c - dy * s, y + dx * s + dy * c, dz)

    rot = (0, 0, facing)
    box("seat", (0.52, 0.5, 0.09), at(0, 0, 0.47), leather, bevel=0.035, rot=rot)
    back = box("back", (0.5, 0.08, 0.62), at(0, -0.27, 0.86), leather, bevel=0.035, rot=(math.radians(-8), 0, facing))
    cyl("post", 0.025, 0.36, at(0, 0, 0.24), chrome)
    for a in range(5):
        ang = a * math.tau / 5
        box("spoke", (0.3, 0.035, 0.03), at(math.cos(ang) * 0.15, math.sin(ang) * 0.15, 0.06), chrome, rot=(0, 0, facing + ang))


for sx in (-1.5, -0.5, 0.5, 1.5):
    chair(sx, -1.0, 0)
    chair(sx, 1.0, math.pi)
chair(-2.75, 0, -math.pi / 2)
chair(2.75, 0, math.pi / 2)

# credenza and a large 80s abstract on the left wall
box("credenza", (0.5, 2.6, 0.72), (-hx + 0.3, -0.6, 0.36), credenza, bevel=0.008)
box("art_frame", (0.04, 1.9, 1.25), (-hx + 0.03, -0.6, 1.62), frame_m)
box("art_field", (0.02, 1.8, 1.15), (-hx + 0.055, -0.6, 1.62), art_c)
box("art_block_a", (0.02, 0.7, 0.9), (-hx + 0.07, -1.0, 1.66), art_a)
box("art_block_b", (0.02, 0.55, 0.42), (-hx + 0.075, -0.2, 1.42), art_b)

# a door and a ficus in the back corners
box("door", (1.0, 0.04, 2.2), (2.6, -hy + 0.02, 1.1), wall_dark)
cyl("pot", 0.22, 0.45, (hx - 0.5, hy - 0.6, 0.225), pot)
bpy.ops.mesh.primitive_ico_sphere_add(radius=0.55, subdivisions=3, location=(hx - 0.5, hy - 0.6, 1.25))
f = bpy.context.active_object
f.scale = (1, 1, 1.4)
disp = f.modifiers.new("leaves", "DISPLACE")
tex = bpy.data.textures.new("leafnoise", "CLOUDS")
tex.noise_scale = 0.12
disp.texture = tex
disp.strength = 0.25
f.data.materials.append(plant)

# ---------------------------------------------------------------- sky


world = bpy.data.worlds.new("overcast")
scene.world = world
world.use_nodes = True
wn = world.node_tree.nodes
wl = world.node_tree.links
bg = wn["Background"]
grad_coord = wn.new("ShaderNodeTexCoord")
sepz = wn.new("ShaderNodeSeparateXYZ")
wl.new(grad_coord.outputs["Generated"], sepz.inputs[0])
ramp = wn.new("ShaderNodeValToRGB")
ramp.color_ramp.elements[0].position = 0.45
ramp.color_ramp.elements[0].color = (*srgb("#b9c0c6"), 1)
ramp.color_ramp.elements[1].position = 0.9
ramp.color_ramp.elements[1].color = (*srgb("#eef0f1"), 1)
wl.new(sepz.outputs["Z"], ramp.inputs[0])
wl.new(ramp.outputs[0], bg.inputs["Color"])
bg.inputs["Strength"].default_value = 6.0

# ---------------------------------------------------------------- camera + render

bpy.ops.object.camera_add(location=(0, 0, EYE), rotation=(math.pi / 2, 0, 0))
cam = bpy.context.active_object
cam.data.type = "PANO"
cam.data.panorama_type = "EQUIRECTANGULAR"
scene.camera = cam

scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = args.samples
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 6
scene.cycles.diffuse_bounces = 3
scene.cycles.glossy_bounces = 3
scene.render.resolution_x = args.res
scene.render.resolution_y = args.res // 2
scene.render.resolution_percentage = 100
scene.view_settings.view_transform = "Standard"
scene.render.image_settings.file_format = "HDR"
scene.render.filepath = args.out

bpy.ops.render.render(write_still=True)
if args.preview:
    scene.render.image_settings.file_format = "PNG"
    bpy.data.images["Render Result"].save_render(args.preview)
if args.ship and args.ship < args.res:
    img = bpy.data.images.load(args.out)
    img.scale(args.ship, args.ship // 2)
    img.filepath_raw = args.out
    img.file_format = "HDR"
    img.save()
print("wrote", args.out)
