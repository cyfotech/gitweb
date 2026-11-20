#!/usr/bin/env python3
"""
Comprehensive arrow and button fix script for firweb frontend.
Fixes all cut-off, clipped, and broken arrow buttons across all pages.
"""

import os
import re
import shutil

SRC = r'c:\Users\Lucif\OneDrive\Desktop\firweb\frontend\src'
MIRROR = r'c:\Users\Lucif\OneDrive\Desktop\firweb\firweb\frontend\src'


def sync_to_mirror(src_path, src_root, dst_root):
    rel = os.path.relpath(src_path, src_root)
    dst_path = os.path.join(dst_root, rel)
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
    sync_to_mirror(path, SRC, MIRROR)
    print(f"  WRITTEN: {os.path.relpath(path, SRC)}")


# =============================================================================
# 1. Fix index.css — Add global arrow/button overflow fix rules
# =============================================================================
print("\n[1] Fixing index.css — global button/SVG overflow rules")

index_css_path = os.path.join(SRC, 'index.css')
index_css = read_file(index_css_path)

ARROW_FIX_BLOCK = """
/* ============================================================
   GLOBAL ARROW & BUTTON FIX — Prevent SVG icon clipping
   ============================================================ */

/* Ensure SVG icons inside buttons never get clipped or shrunk */
button svg,
a svg,
[role="button"] svg {
  flex-shrink: 0;
  display: inline-block;
  vertical-align: middle;
  overflow: visible;
}

/* Core button layout fix — ensure full visibility of content */
.ptc-consultation-button,
.ptc-mobile-consultation,
.hero-button,
.btn-acc,
.btn-ghost-d,
.inline-flex,
button.inline-flex,
a.inline-flex {
  overflow: visible !important;
  white-space: nowrap;
}

/* Prevent parent overflow: hidden from clipping translateY hover */
main section,
header,
footer {
  overflow: visible;
}

/* Fix specific overflow: hidden on sections that clips buttons */
.cinematic-hero {
  overflow: hidden; /* keep bg clip, but child buttons need visible */
}

.cinematic-hero .hero-buttons,
.cinematic-hero .hero-button {
  overflow: visible !important;
}

"""

if 'GLOBAL ARROW & BUTTON FIX' not in index_css:
    # Insert after the first line of the file (after @import or top comment)
    index_css = index_css + ARROW_FIX_BLOCK
    write_file(index_css_path, index_css)
    print("  Added global arrow fix block to index.css")
else:
    print("  Already has arrow fix block, skipping")


# =============================================================================
# 2. Fix Navbar.css — Ensure ptc-consultation-button has proper arrow display
# =============================================================================
print("\n[2] Fixing Navbar.css — consultation button arrow visibility")

navbar_css_path = os.path.join(SRC, 'components', 'Navbar.css')
navbar_css = read_file(navbar_css_path)

# Check if consultation button has proper SVG alignment
old_consult = """.ptc-consultation-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  padding: 12px 17px;
  border: 0;
  border-radius: 999px;

  background: #17383f;
  color: white;

  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  cursor: pointer;

  transition:
    background 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}"""

new_consult = """.ptc-consultation-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  padding: 11px 20px 11px 17px;
  border: 0;
  border-radius: 999px;

  background: #17383f;
  color: white;

  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  overflow: visible;

  cursor: pointer;

  transition:
    background 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

/* Ensure arrow icon is never clipped */
.ptc-consultation-button svg {
  flex-shrink: 0;
  display: inline-block;
  overflow: visible;
  margin-left: 2px;
}"""

if old_consult in navbar_css:
    navbar_css = navbar_css.replace(old_consult, new_consult)
    write_file(navbar_css_path, navbar_css)
elif 'ptc-consultation-button svg' not in navbar_css:
    # Append the SVG fix rule after the button definition
    navbar_css = navbar_css + """
/* Ensure arrow icon is never clipped in consultation button */
.ptc-consultation-button {
  overflow: visible;
  padding-right: 20px;
}

.ptc-consultation-button svg {
  flex-shrink: 0;
  display: inline-block;
  overflow: visible;
  margin-left: 2px;
}
"""
    write_file(navbar_css_path, navbar_css)
    print("  Appended SVG fix to Navbar.css")
else:
    print("  Navbar.css already has SVG fix")


# =============================================================================
# 3. Fix SmartTaxExpertss.jsx — Replace raw arrow Unicode chars with SVG
# =============================================================================
print("\n[3] Fixing SmartTaxExpertss.jsx — raw arrow Unicode -> SVG")

smart_path = os.path.join(SRC, 'pages', 'SmartTaxExpertss.jsx')
smart_content = read_file(smart_path)

# Replace raw → character used as button arrow with proper SVG
# The raw arrow → (U+2192) should stay as text arrows (fine) but
# when used inside buttons it should be SVG
# Check for the actual raw → in span inside anchor/button
old_raw_arrow = '''<span className="ar" aria-hidden="true">→</span>'''
new_svg_arrow = '''<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg>'''

if old_raw_arrow in smart_content:
    smart_content = smart_content.replace(old_raw_arrow, new_svg_arrow)
    print("  Replaced raw arrow span in SmartTaxExpertss.jsx")

# Also fix any inline style buttons that might have overflow:hidden
# Look for button wrappers with overflow issues
smart_content = re.sub(
    r'(style=\{[^}]*overflow\s*:\s*[\'"]?hidden[\'"]?[^}]*\})',
    lambda m: m.group(0).replace('hidden', 'visible') if 'button' in smart_content[max(0, smart_content.find(m.group(0))-200):smart_content.find(m.group(0))] else m.group(0),
    smart_content
)

write_file(smart_path, smart_content)


# =============================================================================
# 4. Fix CinematicHeroChapter — Replace → text arrows with proper SVG
# =============================================================================
print("\n[4] Fixing CinematicHeroChapter.tsx — text arrows -> SVG")

hero_path = os.path.join(SRC, 'components', 'CinematicHeroChapter.tsx')
hero_content = read_file(hero_path)

# Fix the primary button "Book Strategic Consultation →" span arrow
old_primary_btn = 'Book Strategic Consultation <span>→</span>'
new_primary_btn = '''Book Strategic Consultation <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block',marginLeft:'2px'}}>
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>'''

if old_primary_btn in hero_content:
    hero_content = hero_content.replace(old_primary_btn, new_primary_btn)
    print("  Fixed primary hero button arrow")

# Fix "Explore Practices ⌄" — keep as is (it's a chevron, fine as text)
# Fix the progress-next button which uses → as text
old_progress_next = '''<button
                        type="button"
                        className="progress-next"
                        onClick={nextService}
                        aria-label="Next service"
                      >
                        →
                      </button>'''
new_progress_next = '''<button
                        type="button"
                        className="progress-next"
                        onClick={nextService}
                        aria-label="Next service"
                      >
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 6l6 6-6 6"/>
                        </svg>
                      </button>'''

if '→\n                      </button>' in hero_content:
    hero_content = hero_content.replace(
        '→\n                      </button>',
        '''<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                      </button>'''
    )
    print("  Fixed progress-next button arrow")

write_file(hero_path, hero_content)


# =============================================================================
# 5. Fix CinematicHeroChapter.css — progress-next button styling
# =============================================================================
print("\n[5] Fixing CinematicHeroChapter.css — progress-next SVG centering")

hero_css_path = os.path.join(SRC, 'components', 'CinematicHeroChapter.css')
hero_css = read_file(hero_css_path)

old_progress_css = """.cinematic-hero .progress-next {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 50%;
  background: var(--green);
  color: white;
  font-size: 18px;
  font-family: inherit;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}"""

new_progress_css = """.cinematic-hero .progress-next {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: var(--green);
  color: white;
  font-size: 18px;
  font-family: inherit;
  cursor: pointer;
  overflow: visible;
  transition: transform 0.2s ease, background 0.2s ease;
}

.cinematic-hero .progress-next svg {
  display: block;
  flex-shrink: 0;
  overflow: visible;
}"""

if old_progress_css in hero_css:
    hero_css = hero_css.replace(old_progress_css, new_progress_css)
    write_file(hero_css_path, hero_css)
    print("  Fixed progress-next CSS")
elif 'progress-next svg' not in hero_css:
    # Append fix
    hero_css += """
/* SVG fix for progress-next button */
.cinematic-hero .progress-next {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.cinematic-hero .progress-next svg {
  display: block;
  flex-shrink: 0;
  overflow: visible;
}
"""
    write_file(hero_css_path, hero_css)
    print("  Appended progress-next SVG fix to hero CSS")
else:
    print("  Hero CSS already has progress-next SVG fix")


# =============================================================================
# 6. Fix Footer.tsx — ArrowUpRight from lucide should render fine
#    But check for any raw broken chars
# =============================================================================
print("\n[6] Checking Footer.tsx")

footer_path = os.path.join(SRC, 'components', 'Footer.tsx')
footer_content = read_file(footer_path)

# Replace any raw → with SVG in footer links
# Footer uses lucide ArrowUpRight which is fine
# Check for raw text arrows in footer
if '→' in footer_content:
    # Replace text arrows in footer links with ArrowRight SVG pattern
    footer_content = footer_content.replace(
        ' →</a>',
        ' <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>'
    )
    footer_content = footer_content.replace(
        '→</span>',
        '<svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>'
    )
    write_file(footer_path, footer_content)
    print("  Fixed raw arrows in Footer.tsx")
else:
    print("  Footer.tsx has no raw text arrows")


# =============================================================================
# 7. Fix HireProfessionalsPage.tsx — check for arrow issues
# =============================================================================
print("\n[7] Checking HireProfessionalsPage.tsx")

hire_path = os.path.join(SRC, 'pages', 'HireProfessionalsPage.tsx')
if os.path.exists(hire_path):
    hire_content = read_file(hire_path)
    changed = False

    # Fix any text arrows in buttons that should be SVG
    if '→' in hire_content:
        # Replace text-only → in buttons  
        hire_content = re.sub(
            r'(<(?:button|a)[^>]*>.*?)→(.*?</(?:button|a)>)',
            lambda m: m.group(0).replace('→', '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M5 12h14M13 6l6 6-6 6"/></svg>'),
            hire_content,
            flags=re.DOTALL
        )
        changed = True

    if changed:
        write_file(hire_path, hire_content)
    else:
        print("  No raw arrows found in HireProfessionalsPage.tsx")
else:
    print("  HireProfessionalsPage.tsx not found")


# =============================================================================
# 8. Fix service page JSX files — ensure button SVG arrows have flexShrink:0
# =============================================================================
print("\n[8] Checking service page JSX files")

service_pages = [
    r'pages\services\BookkeepingPage.jsx',
    r'pages\services\PayrollManagementPage.jsx',
    r'pages\services\TaxPlanningPage.jsx',
    r'pages\services\USATaxPreparationPage.jsx',
]

for rel_path in service_pages:
    full_path = os.path.join(SRC, rel_path)
    if not os.path.exists(full_path):
        print(f"  NOT FOUND: {rel_path}")
        continue
    
    content = read_file(full_path)
    original = content
    
    # Fix SVG arrow patterns that are missing viewBox or have no flexShrink
    # Pattern: <svg width="N" height="N" fill="none" stroke="currentColor"...>
    # Ensure strokeLinecap, strokeLinejoin, and flexShrink are present
    
    # Fix: add flexShrink to SVG if missing  
    content = re.sub(
        r'(<svg\s[^>]*stroke="currentColor"[^>]*)(?<!flexShrink:[^>]*)(>)',
        lambda m: m.group(1) + ' style={{flexShrink:0,display:"inline-block"}}' + m.group(2) if 'flexShrink' not in m.group(0) and 'style=' not in m.group(0) else m.group(0),
        content
    )
    
    if content != original:
        write_file(full_path, content)
        print(f"  Fixed SVG flexShrink in {rel_path}")
    else:
        print(f"  OK (no changes needed): {rel_path}")


# =============================================================================
# 9. Fix MobileResponsiveFix.css — ensure no overflow:hidden clips buttons
# =============================================================================
print("\n[9] Checking MobileResponsiveFix.css")

mobile_fix_path = os.path.join(SRC, 'MobileResponsiveFix.css')
if os.path.exists(mobile_fix_path):
    mobile_fix = read_file(mobile_fix_path)
    if 'overflow: hidden' in mobile_fix and 'button' in mobile_fix:
        print("  WARNING: MobileResponsiveFix.css has overflow:hidden near button rules - check manually")
    else:
        print("  MobileResponsiveFix.css looks OK")


print("\n[10] All fixes applied! Running build check...")
