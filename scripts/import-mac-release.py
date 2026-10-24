#!/usr/bin/env python3
"""Stage a completed release-mac.sh output for the existing website build/deploy."""
import argparse
import hashlib
import json
import re
import shutil
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

SPARKLE = '{http://www.andymatuschak.org/xml-namespaces/sparkle}'
ORIGIN = 'https://winsend.app/'
FEED = 'appcast-mac.xml'


def import_release(release, website):
    release, website = Path(release), Path(website)
    feed = release / FEED
    raw_feed = feed.read_bytes()
    if b'<!-- sparkle-signatures:' not in raw_feed:
        raise ValueError('Only import the signed feed produced by release-mac.sh')
    item = ET.fromstring(raw_feed).find('channel/item')
    if item is None:
        raise ValueError('Missing appcast release')
    version, build = item.findtext(SPARKLE + 'shortVersionString'), item.findtext(SPARKLE + 'version')
    if not re.fullmatch(r'[0-9]+(?:\.[0-9]+)*', version or '') or not re.fullmatch(r'[0-9]+', build or ''):
        raise ValueError('Invalid version/build')
    name = f'WinSend-{version}-{build}.dmg'
    enclosure = item.find('enclosure')
    if enclosure is None or enclosure.get('url') != ORIGIN + name or not enclosure.get(SPARKLE + 'edSignature'):
        raise ValueError('Feed enclosure does not match the versioned WinSend DMG')
    package = release / name
    digest = hashlib.sha256(package.read_bytes()).hexdigest()
    checksum = release / (name + '.sha256')
    if checksum.read_text().split() != [digest, name] or str(package.stat().st_size) != enclosure.get('length'):
        raise ValueError('DMG checksum/length differs from the completed release')
    if json.loads((release / 'notarization.json').read_text()).get('status') != 'Accepted':
        raise ValueError('Apple notarization has not passed')
    existing = website / FEED
    if existing.exists():
        versions = [int(node.text) for node in ET.parse(existing).iter(SPARKLE + 'version')]
        if versions and int(build) <= max(versions) and existing.read_bytes() != raw_feed:
            raise ValueError('Build number must increase; do not replace or downgrade an existing release')
    assets = [package, checksum]
    notes = item.find(SPARKLE + 'releaseNotesLink')
    if notes is not None:
        url = notes.text or ''
        parsed = urlparse(url)
        if url != ORIGIN + f'WinSend-{version}-{build}.html' or parsed.query or parsed.fragment:
            raise ValueError('Unexpected release notes URL')
        assets.append(release / Path(parsed.path).name)
    # Validate every immutable file before touching the website.
    for source in assets:
        data = source.read_bytes()
        target = website / source.name
        if target.exists() and target.read_bytes() != data:
            raise ValueError(f'Cannot replace published artifact: {source.name}')
    product_path = website / 'site/product.json'
    product = json.loads(product_path.read_text())
    product.update(macDownloadUrl='/' + name, macVersion=version)
    for source in assets:
        shutil.copy2(source, website / source.name)
    shutil.copy2(feed, website / FEED)
    product_path.write_text(json.dumps(product, ensure_ascii=False, indent=2) + '\n')
    return name


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('release', type=Path)
    args = parser.parse_args()
    print('Staged ' + import_release(args.release, Path(__file__).resolve().parents[1]))
    print('Run npm run build, review/commit/push, then npm run deploy. All files deploy together.')
