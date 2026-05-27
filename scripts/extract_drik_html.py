import urllib.request
import re
from html import unescape

url = 'https://www.drikpanchang.com/panchang/day-panchang.html?geoname-id=1262995&date=27/05/2026'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req, timeout=20).read().decode('utf-8', 'ignore')
print('LENGTH', len(html))
keys = re.findall(r'<div class="dpTableCell dpTableKey">(.*?)</div>', html, re.S)
vals = re.findall(r'<div class="dpTableCell dpTableValue">(.*?)</div>', html, re.S)
print('FOUND', len(keys), len(vals))
for k, v in zip(keys[:40], vals[:40]):
    text_k = re.sub(r'<.*?>', '', k).strip()
    text_v = re.sub(r'<.*?>', '', v).strip()
    print(f'{text_k} => {text_v}')
