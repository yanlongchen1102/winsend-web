"""Dependency-free product-copy, JSON-LD and FAQ visibility regression checks."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.hidden = 0
        self.in_body = False
        self.visible = []
        self.ids = []
        self.canonicals = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'body':
            self.in_body = True
        if tag in ('script', 'style'):
            self.hidden += 1
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonicals.append(attrs.get('href'))

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.hidden -= 1
        if tag == 'body':
            self.in_body = False

    def handle_data(self, data):
        if self.in_body and not self.hidden:
            self.visible.append(data)


def normalized(text):
    return re.sub(r'\s+', ' ', text).strip()

BANNED = (
    'Seamlessly transfer files between iPhone and Windows via local Wi-Fi or internet.',
    '通过本地 Wi-Fi 或互联网在 iPhone 和 Windows 之间无缝传输文件。',
    'WinSend never relays anything', 'WinSend works only on the local network',
    'WinSend entirely uses local network', 'absolutely secure', 'no tracking',
    'not yet code-signed', 'nothing is stored', 'every byte stays',
    'WinSend 从不中继任何数据', '数据绝对安全', '完美无感传输', '无跟踪',
    '没有任何账号或云端组件', '数据永远不会离开你的 Wi-Fi',
    'iOS 15+', 'automatically appears on iPhone, and vice versa',
    '无需任何手动操作', '我们会用签名安装包彻底消除这个提示',
    'Clipboard text sync and triggered Shortcuts requires Pro',
    '本地文件和剪贴板传输只需两台设备连接同一个 Wi-Fi。',
)
errors = []
config = json.loads((ROOT / 'site/config.json').read_text(encoding='utf-8'))
published = [locale['code'] for locale in config['locales'] if locale['status'] == 'published']
shared = {code: json.loads((ROOT / f'site/content/{code}/shared.json').read_text(encoding='utf-8')) for code in published}
pages = sorted(path for code in published for path in (ROOT / code).rglob('*.html'))
faq_count = 0
for path in pages:
    text = path.read_text(encoding='utf-8')
    relative = path.relative_to(ROOT).as_posix()
    page = Page()
    page.feed(text)
    visible = normalized(' '.join(page.visible))
    for old in BANNED:
        if old in text:
            errors.append(f'{relative}: obsolete claim: {old}')
    if len(page.ids) != len(set(page.ids)):
        errors.append(f'{relative}: duplicate HTML ids')
    if 'noindex' not in text:
        expected = 'https://winsend.app/' + relative.removesuffix('index.html')
        if page.canonicals != [expected]:
            errors.append(f'{relative}: canonical mismatch: {page.canonicals}')
        if path.parent.name not in ('privacy', 'safety'):
            if 'product-scope' not in page.ids:
                errors.append(f'{relative}: missing visible feature-access explanation')
            scope = normalized(shared[relative.split('/')[0]]['productScope'])
            if scope not in visible:
                errors.append(f'{relative}: missing or incorrect free/Pro distinction')
    for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S):
        try:
            data = json.loads(raw)
        except ValueError as exc:
            errors.append(f'{relative}: invalid JSON-LD: {exc}')
            continue
        nodes = data.get('@graph', [data]) if isinstance(data, dict) else data
        for node in nodes:
            if node.get('@type') != 'FAQPage':
                continue
            for question in node.get('mainEntity', []):
                faq_count += 1
                for field in (question['name'], question['acceptedAnswer']['text']):
                    if normalized(field) not in visible:
                        errors.append(f'{relative}: JSON-LD FAQ is not visible: {field[:90]}')

llms = (ROOT / 'llms.txt').read_text(encoding='utf-8')
for old in BANNED:
    if old in llms:
        errors.append(f'llms.txt: obsolete claim: {old}')
ET.parse(ROOT / 'sitemap.xml')
if errors:
    print('\n'.join(errors))
    sys.exit(1)
print(f'PASS: {len(pages)} HTML pages; {faq_count} visible FAQ answers; canonical, IDs, JSON-LD, sitemap and obsolete-claim checks')
