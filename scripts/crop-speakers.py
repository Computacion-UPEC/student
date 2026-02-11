from PIL import Image
import os

img = Image.open("/vercel/share/v0-project/scripts/speakers-composite.jpg")
w, h = img.size
print(f"Image size: {w}x{h}")

# Top row: 6 speakers, bottom row: 6 speakers
# Divide roughly in half vertically
row_h = h // 2

# Each speaker takes roughly 1/6 of the width
col_w = w // 6

speakers_order = [
    # Top row (left to right)
    "angelo-benavides",
    "edison-lopez",
    "geovanny-basantes",
    "erika-delgado",
    "luis-valverde",
    "alexa-dominguez",
    # Bottom row (left to right)
    "luis-guerrero",
    "cristian-baraja",
    "luis-martinez",
    "anthony-quiranza",
    "john-cortez",
    "michael-paredes",
]

output_dir = "/vercel/share/v0-project/public/speakers"
os.makedirs(output_dir, exist_ok=True)

for idx, name in enumerate(speakers_order):
    row = idx // 6
    col = idx % 6
    
    x1 = col * col_w
    y1 = row * row_h
    x2 = x1 + col_w
    y2 = y1 + row_h
    
    # Add some padding adjustments - crop tighter
    # Slight adjustments to center each person better
    pad_x = int(col_w * 0.02)
    pad_y = int(row_h * 0.02)
    
    crop_box = (
        max(0, x1 + pad_x),
        max(0, y1 + pad_y),
        min(w, x2 - pad_x),
        min(h, y2 - pad_y),
    )
    
    cropped = img.crop(crop_box)
    
    # Make it square from the top (focus on face/upper body)
    cw, ch = cropped.size
    if ch > cw:
        # Crop from bottom to make square
        cropped = cropped.crop((0, 0, cw, cw))
    elif cw > ch:
        # Crop from sides to center
        diff = (cw - ch) // 2
        cropped = cropped.crop((diff, 0, cw - diff, ch))
    
    # Resize to a consistent size
    cropped = cropped.resize((400, 400), Image.LANCZOS)
    
    output_path = os.path.join(output_dir, f"{name}.jpg")
    cropped.save(output_path, "JPEG", quality=90)
    print(f"Saved: {name}.jpg ({crop_box})")

print("Done! All speakers cropped.")
