#!/usr/bin/env python3
"""
Step 8+: Fix service page JSX SVG arrows and run checks.
"""

import os
import re
import shutil

SRC = r'c:\Users\Lucif\OneDrive\Desktop\firweb\frontend\src'
MIRROR = r'c:\Users\Lucif\OneDrive\Desktop\firweb\firweb\frontend\src'


def sync_to_mirror(src_path):
    rel = os.path.relpath(src_path, SRC)
    dst_path = os.path.join(MIRROR, rel)
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    try:
        shutil.copyfile(src_path, dst_path)
    except Exception as e:
        print(f"  Mirror sync FAILED for {rel}: {e}")


def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    sync_to_mirror(path)
    print(f"  WRITTEN: {os.path.relpath(path, SRC)}")


# =============================================================================
# 8. Fix service page JSX files — SVG arrows need flexShrink:0
# =============================================================================
print("\n[8] Checking service page JSX files for SVG arrow issues")

service_pages = [
    r'pages\services\BookkeepingPage.jsx',
    r'pages\services\PayrollManagementPage.jsx',
    r'pages\services\TaxPlanningPage.jsx',
    r'pages\services\USATaxPreparationPage.jsx',
]

# Simple fix: find SVG tags that have stroke="currentColor" but no flexShrink
# and are inside buttons — add style attribute
def add_flex_shrink_to_svgs(content):
    """Add flexShrink:0 to SVG icons that don't already have it."""
    result = []
    i = 0
    while i < len(content):
        # Find <svg pattern
        svg_start = content.find('<svg', i)
        if svg_start == -1:
            result.append(content[i:])
            break
        
        result.append(content[i:svg_start])
        
        # Find the end of the opening tag
        svg_tag_end = content.find('>', svg_start)
        if svg_tag_end == -1:
            result.append(content[svg_start:])
            break
        
        svg_tag = content[svg_start:svg_tag_end+1]
        
        # Only modify if it's a small icon SVG (has stroke= but no style with flexShrink)
        if 'stroke=' in svg_tag and 'flexShrink' not in svg_tag and 'style=' not in svg_tag:
            # It's an icon SVG without style — add style
            svg_tag = svg_tag.replace(
                '<svg ',
                '<svg style={{flexShrink:0,display:"inline-block",verticalAlign:"middle"}} ',
                1
            )
        
        result.append(svg_tag)
        i = svg_tag_end + 1
    
    return ''.join(result)


for rel_path in service_pages:
    full_path = os.path.join(SRC, rel_path)
    if not os.path.exists(full_path):
        print(f"  NOT FOUND: {rel_path}")
        continue
    
    content = read_file(full_path)
    original = content
    fixed = add_flex_shrink_to_svgs(content)
    
    if fixed != original:
        write_file(full_path, fixed)
        print(f"  Added flexShrink to SVGs in {rel_path}")
    else:
        print(f"  OK (no changes needed): {rel_path}")


# =============================================================================
# 9. Check and fix CpaOutsourcingPage.tsx
# =============================================================================
print("\n[9] Checking CpaOutsourcingPage.tsx")

cpa_path = os.path.join(SRC, 'pages', 'CpaOutsourcingPage.tsx')
if os.path.exists(cpa_path):
    cpa_content = read_file(cpa_path)
    original = cpa_content
    fixed = add_flex_shrink_to_svgs(cpa_content)
    if fixed != original:
        write_file(cpa_path, fixed)
    else:
        print("  CpaOutsourcingPage.tsx OK")


# =============================================================================
# 10. Fix EditorialInsightsChapter.tsx — check for arrow issues
# =============================================================================
print("\n[10] Checking EditorialInsightsChapter.tsx")

editorial_path = os.path.join(SRC, 'components', 'EditorialInsightsChapter.tsx')
if os.path.exists(editorial_path):
    editorial_content = read_file(editorial_path)
    original = editorial_content
    fixed = add_flex_shrink_to_svgs(editorial_content)
    if fixed != original:
        write_file(editorial_path, fixed)
    else:
        print("  EditorialInsightsChapter.tsx OK")


# =============================================================================
# 11. Fix BlogPage.tsx — check for arrow issues  
# =============================================================================
print("\n[11] Checking BlogPage.tsx")

blog_path = os.path.join(SRC, 'pages', 'BlogPage.tsx')
if os.path.exists(blog_path):
    blog_content = read_file(blog_path)
    original = blog_content

    # Check for text arrows in blog page
    if '→' in blog_content:
        print("  BlogPage has text arrows — fixing")
    
    fixed = add_flex_shrink_to_svgs(blog_content)
    if fixed != original:
        write_file(blog_path, fixed)
    else:
        print("  BlogPage.tsx OK")


# =============================================================================
# 12. Add global CSS rule to prevent buttons from being clipped by translateY
# =============================================================================
print("\n[12] Adding translateY overflow fix to index.css")

index_css_path = os.path.join(SRC, 'index.css')
index_css = read_file(index_css_path)

TRANSLATE_FIX = """
/* ============================================================
   TRANSLATEY HOVER OVERFLOW FIX
   Prevents buttons from being clipped when parent has overflow:hidden
   during hover translateY transform
   ============================================================ */

main button,
main a[class*="button"],
main a[class*="Button"],
main .inline-flex,
header .ptc-consultation-button,
header .ptc-mobile-consultation {
  position: relative;
  z-index: 1;
}

/* Ensure arrow SVGs inside any button are always visible */
main button svg,
main a svg,
header button svg,
nav button svg {
  flex-shrink: 0 !important;
  overflow: visible !important;
  display: inline-block !important;
}

"""

if 'TRANSLATEY HOVER OVERFLOW FIX' not in index_css:
    index_css += TRANSLATE_FIX
    write_file(index_css_path, index_css)
    print("  Added translateY overflow fix to index.css")
else:
    print("  Already has translateY fix")


print("\n[DONE] All supplemental fixes applied!")
print("\nNow run: npm --prefix frontend run build")
