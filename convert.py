# import os
# from os import path
#
# # os.system('ls -l')
#
# study = 'english'
# old_names = ['animals', 'history', 'internet', 'environment', 'music', 'space', 'media', 'food', 'body']
# new_names = ['topic%d' % (i+1) for i in range(len(old_names))]
#
# for i in range(len(new_names)):
#     for j in range(14):
#         old = 'assets\%s\%s%d.wav' % (study, old_names[i], j+1)
#         new = 'assets\%s\%s_%d.wav' % (study, new_names[i], j+1)
#         if path.exists(old):
#             print('old_name:', old)
#             print('new_name:', new)
#             cmd = 'copy %s %s' % (old, new)
#             print(cmd)
#             os.system(cmd)

import sys
from PIL import Image
import json
for topic in ['art', 'eng', 'exc', 'hum', 'law', 'life', 'man', 'med', 'soc']:

    images = [Image.open('assets/dutch/%s' % x) for x in ['%s_1.png' % topic, '%s_2.png' % topic]]
    widths, heights = zip(*(i.size for i in images))

    total_width = sum(widths)
    max_height = max(heights)

    new_im = Image.new('RGB', (total_width, max_height))

    x_offset = 0
    for im in images:
      new_im.paste(im, (x_offset,0))
      x_offset += im.size[0]

    img = new_im.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        if item[0] == 255 and item[1] == 255 and item[2] == 255:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save('assets/dutch/%s.png' % topic)

    sprite = {
      "textures": [
          {
            "image": "%s.png" % topic,
            "format": "RGBA8888",
            "size": {
                "w": 800,
                "h": 400
            },
            "scale": 1,
            "frames": [
                {
                    "filename": "Idle_1.png",
                    "rotated": False,
                    "trimmed": False,
                    "sourceSize": {
                        "w": 400,
                        "h": 400
                    },
                    "spriteSourceSize": {
                        "x": 0,
                        "y": 0,
                        "w": 400,
                        "h": 400
                    },
                    "frame": {
                        "x": 0,
                        "y": 0,
                        "w": 400,
                        "h": 400
                    }
                },
              {
                "filename": "Idle_2.png",
                "rotated": False,
                "trimmed": False,
                "sourceSize": {
                  "w": 400,
                  "h": 400
                },
                "spriteSourceSize": {
                  "x": 0,
                  "y": 0,
                  "w": 400,
                  "h": 400
                },
                "frame": {
                  "x": 400,
                  "y": 0,
                  "w": 400,
                  "h": 400
                }
              }
            ]
            }
        ]
    }
    json.dump(sprite, open('assets/dutch/%s.json' % topic, 'w+'))
