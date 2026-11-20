content = open(r'c:\Users\Lucif\OneDrive\Desktop\firweb\frontend\src\pages\SmartTaxExpertss.jsx', 'r', encoding='utf-8').read()
idx = content.find('ar\" aria-hidden')
print('ar aria-hidden context:')
if idx >= 0:
    print(repr(content[max(0,idx-50):idx+200]))
else:
    # Find the SVG arrow that replaced
    idx2 = content.find('<svg aria-hidden')
    if idx2 >= 0:
        print('Found SVG:', repr(content[idx2:idx2+300]))
    else:
        print('No SVG found either')
