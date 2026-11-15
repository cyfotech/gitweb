#!/usr/bin/env python3
"""Audit hardcoded text colors in frontend source files."""
import os
import re
import sys
from collections import defaultdict

# Force stdout to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src')

def hex_to_rgb(h):
    h = h.lstrip('#')
    if len(h) == 3:
        h = ''.join(c*2 for c in h)
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def luminance(rgb):
    r, g, b = [c/255 for c in rgb]
    def f(c):
        return c/12.92 if c <= 0.03928 else ((c+0.055)/1.055)**2.4
    return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b)

def is_greyish(rgb):
    r, g, b = rgb
    mx, mn = max(rgb), min(rgb)
    return (mx - mn) < 40 and mx < 200

def is_dark_color(rgb):
    return luminance(rgb) < 0.4

def main():
    results = []
    for dirpath, _, filenames in os.walk(ROOT):
        for fn in filenames:
            if not (fn.endswith('.tsx') or fn.endswith('.jsx') or fn.endswith('.ts') or fn.endswith('.css')):
                continue
            fpath = os.path.join(dirpath, fn)
            rel = os.path.relpath(fpath, ROOT)
            with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            lines = content.split('\n')
            for i, line in enumerate(lines, 1):
                # Find inline color: style={{ color: '#...' }} or color="#..." or color: '#...'
                for m in re.finditer(r'color\s*[:=]\s*["\']?(#[0-9a-fA-F]{3,6})["\']?', line):
                    hexc = m.group(1)
                    rgb = hex_to_rgb(hexc)
                    if is_greyish(rgb) or is_dark_color(rgb):
                        ctx = line[max(0, m.start()-40):m.end()+40]
                        is_bg = any(k in ctx for k in ['bg-', 'background', 'border', 'shadow', 'gradient'])
                        results.append({
                            'file': rel,
                            'line': i,
                            'hex': hexc,
                            'rgb': rgb,
                            'is_bg': is_bg,
                            'context': line.strip()[:120]
                        })
    by_file = defaultdict(list)
    for r in results:
        by_file[r['file']].append(r)
    print(f"Total files with text color issues: {len(by_file)}")
    for f in sorted(by_file):
        items = by_file[f]
        text_items = [i for i in items if not i['is_bg']]
        if text_items:
            print(f"\n=== {f} ({len(text_items)} text colors) ===")
            for it in text_items[:10]:
                print(f"  L{it['line']}: {it['hex']} {it['rgb']} | {it['context']}")
            if len(text_items) > 10:
                print(f"  ... and {len(text_items)-10} more")

if __name__ == '__main__':
    main()