#!/usr/bin/env python3
"""Generate index.html from kmong-*/project.json files."""

import glob
import json
import re
import sys


def main():
    output_path = sys.argv[1] if len(sys.argv) > 1 else "_site/index.html"

    projects = []
    for pj in sorted(glob.glob("kmong-*/project.json")):
        folder = pj.split("/")[0]
        match = re.match(r"kmong-(\d+)", folder)
        if not match:
            continue
        pid = match.group(1)
        with open(pj, encoding="utf-8") as f:
            data = json.load(f)
        projects.append({
            "id": pid,
            "title": data.get("title", folder),
            "description": data.get("description", ""),
            "pages": data.get("pages", 0),
        })

    cards = ""
    for p in projects:
        badge = f'<span class="badge">{p["pages"]} pages</span>' if p["pages"] else ""
        cards += f"""    <a class="card" href="./kmong-{p['id']}-demo/">
      <h2>{p['title']}</h2>
      <p>{p['description']}</p>
      {badge}
    </a>
"""

    html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Firstpip Demos</title>
  <style>
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; color: #1e293b; min-height: 100vh; }}
    .container {{ max-width: 800px; margin: 0 auto; padding: 40px 20px; }}
    h1 {{ font-size: 24px; margin-bottom: 8px; }}
    .subtitle {{ color: #64748b; font-size: 14px; margin-bottom: 32px; }}
    .card {{ background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 16px; text-decoration: none; display: block; transition: box-shadow 0.2s; }}
    .card:hover {{ box-shadow: 0 4px 12px rgba(0,0,0,0.1); }}
    .card h2 {{ font-size: 18px; color: #1e293b; margin-bottom: 4px; }}
    .card p {{ font-size: 14px; color: #64748b; }}
    .badge {{ display: inline-block; background: #f0fdf4; color: #22c55e; font-size: 12px; padding: 2px 8px; border-radius: 99px; margin-top: 8px; }}
  </style>
</head>
<body>
  <div class="container">
    <h1>Firstpip Demos</h1>
    <p class="subtitle">크몽 프로젝트 데모 모음</p>
{cards}  </div>
</body>
</html>
"""

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"Generated {output_path} with {len(projects)} projects")


if __name__ == "__main__":
    main()
