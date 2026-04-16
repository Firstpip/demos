#!/usr/bin/env python3
"""Generate index.html from kmong-*/project.json files.

Usage:
  python3 generate-index.py [output_path] [--preview]
"""

import glob
import json
import re
import sys

PALETTE = [
    "#6366f1", "#0ea5e9", "#8b5cf6", "#0d9488",
    "#2563eb", "#7c3aed", "#0284c7", "#0066FF",
]

CATEGORY_LABELS = {
    "corporate": "Corporate",
    "ecommerce": "E-Commerce",
    "landing": "Landing",
    "community": "Community",
    "saas": "SaaS",
    "other": "Other",
}

PREVIEW_PROJECTS = [
    {"id": "225711", "title": "\ud558\uc774\uc5d4\ub4dc \uae30\uc5c5 \ud648\ud398\uc774\uc9c0", "description": "\uc778\ud130\ub799\ud2f0\ube0c \uc694\uc18c\uc640 \uc740\uc720\uc801 \ud45c\ud604 \uae30\ubc95\uc774 \ub2f4\uae34 \uc804\ubb38\uc801\uc778 \uae30\uc5c5 \ud648\ud398\uc774\uc9c0", "pages": 5, "techStack": ["Next.js", "GSAP", "Framer Motion"], "category": "corporate", "color": "#6366f1"},
    {"id": "225685", "title": "SafeWorks \uc194\ub8e8\uc158 \ub79c\ub529\ud398\uc774\uc9c0", "description": "\uac74\uc124 IT \uc194\ub8e8\uc158 \ub79c\ub529\ud398\uc774\uc9c0", "pages": 6, "techStack": ["Next.js"], "category": "landing", "color": "#0ea5e9"},
    {"id": "225630", "title": "\uc2a4\ud3ec\uce20\ub9ac\uadf8 \uacbd\uae30\uc2e0\uccad \ud50c\ub7ab\ud3fc", "description": "\uc2a4\ud3ec\uce20 \uc774\ubca4\ud2b8 \ub4f1\ub85d \ubc0f \ub300\uc9c4\ud45c \uad00\ub9ac \ud558\uc774\ube0c\ub9ac\ub4dc \uc571", "pages": 8, "techStack": ["Next.js", "Lucide"], "category": "community", "color": "#0d9488"},
    {"id": "225624", "title": "\uc778\ud50c\ub8e8\uc5b8\uc11c \uc5ed\uc9c1\uad6c \ucee4\uba38\uc2a4", "description": "\uae00\ub85c\ubc8c \uc5ed\uc9c1\uad6c \ucee4\uba38\uc2a4 \ud50c\ub7ab\ud3fc, \uc778\ud50c\ub8e8\uc5b8\uc11c \ud30c\ud2b8\ub108\uc2ed \ubc0f \uc815\uc0b0 \uc2dc\uc2a4\ud15c", "pages": 12, "techStack": ["Next.js", "shadcn", "Recharts"], "category": "ecommerce", "color": "#8b5cf6"},
    {"id": "225550", "title": "B2B \ud3d0\uc1c4\ubab0 \uc1fc\ud551\ubab0", "description": "Imweb \uae30\ubc18 \ubab0\uc744 \ucee4\uc2a4\ud140 B2B \ud3d0\uc1c4\ubab0\ub85c \uc804\ud658", "pages": 10, "techStack": ["Next.js"], "category": "ecommerce", "color": "#2563eb"},
    {"id": "225526", "title": "\uc1fc\ud551\ubab0 \uc790\uccb4\uad6c\ucd95 \ub9ac\ub274\uc5bc", "description": "\ube4c\ub354 \uae30\ubc18 \uc1fc\ud551\ubab0\uc744 \ucee4\uc2a4\ud140 \uc544\ud0a4\ud14d\ucc98\ub85c \uc7ac\uad6c\ucd95, DB \ub9c8\uc774\uadf8\ub808\uc774\uc158 \ud3ec\ud568", "pages": 7, "techStack": ["Next.js"], "category": "ecommerce", "color": "#7c3aed"},
    {"id": "225469", "title": "\uc5d0\ub108\ub9c1\uac70", "description": "\uc720\uc804\uc790 \ubc0f \uac74\uac15\uac80\uc9c4 \ub370\uc774\ud130 \uae30\ubc18 \uac74\uac15\uae30\ub2a5\uc2dd\ud488 \ucd94\ucc9c \ud50c\ub7ab\ud3fc", "pages": 17, "techStack": ["Next.js"], "category": "ecommerce", "color": "#0284c7"},
]


def load_projects():
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
            "techStack": data.get("techStack", ["Next.js"]),
            "category": data.get("category", "other"),
            "color": data.get("color", ""),
        })
    return projects


def assign_colors(projects):
    for i, p in enumerate(projects):
        if not p["color"]:
            p["color"] = PALETTE[i % len(PALETTE)]


def build_html(projects):
    categories = sorted({p["category"] for p in projects})
    total_pages = sum(p["pages"] for p in projects)

    cat_pills = '<button class="pill active" data-cat="all">All<span class="pill-count">' + str(len(projects)) + '</span></button>\n'
    for cat in categories:
        label = CATEGORY_LABELS.get(cat, cat.title())
        count = sum(1 for p in projects if p["category"] == cat)
        cat_pills += f'      <button class="pill" data-cat="{cat}">{label}<span class="pill-count">{count}</span></button>\n'

    cards_html = ""
    for i, p in enumerate(projects):
        tech_tags = "".join(f'<span class="tech-tag">{t}</span>' for t in p["techStack"])
        cards_html += f"""    <a class="card" href="./kmong-{p['id']}-demo/" data-cat="{p['category']}" style="--ac: {p['color']}" data-index="{i}">
      <div class="card-thumb">
        <img src="./thumbnails/kmong-{p['id']}.png" alt="{p['title']}" loading="lazy" decoding="async"
             onerror="this.style.display='none'" />
        <div class="card-overlay">
          <span class="card-view">View Demo<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-top">
          <h2>{p['title']}</h2>
          <span class="badge">{p['pages']}p</span>
        </div>
        <p>{p['description']}</p>
        <div class="tech-tags">{tech_tags}</div>
      </div>
    </a>
"""

    html = f"""<!DOCTYPE html>
<html lang="ko" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Firstpip Demos</title>
  <meta name="description" content="Firstpip - \ud504\ub85c\uc81d\ud2b8 \ub370\ubaa8 \ud3ec\ud2b8\ud3f4\ub9ac\uc624">
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" rel="stylesheet">
  <style>
*, *::before, *::after {{ margin: 0; padding: 0; box-sizing: border-box; }}

:root {{
  --bg: #FFFFFF;
  --bg-2: #F9FAFB;
  --text: #111111;
  --text-2: #555555;
  --text-3: #999999;
  --border: #E5E7EB;
  --primary: #0066FF;
  --card-bg: #FFFFFF;
  --card-border: #E8E8E8;
  --card-hover-border: #D0D0D0;
  --header-bg: rgba(255,255,255,0.88);
  --filter-bg: rgba(255,255,255,0.92);
  --pill-bg: transparent;
  --pill-hover: #F3F4F6;
  --pill-active-bg: var(--text);
  --pill-active-text: var(--bg);
  --search-bg: #F3F4F6;
  --tag-bg: #F3F4F6;
  --tag-text: #6B7280;
  --overlay-bg: rgba(0,0,0,0.5);
  --font: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}}

[data-theme="dark"] {{
  --bg: #09090B;
  --bg-2: #0F0F12;
  --text: #FAFAFA;
  --text-2: #A1A1AA;
  --text-3: #52525B;
  --border: #27272A;
  --card-bg: #0F0F12;
  --card-border: #1C1C20;
  --card-hover-border: #333338;
  --header-bg: rgba(9,9,11,0.88);
  --filter-bg: rgba(9,9,11,0.92);
  --pill-bg: transparent;
  --pill-hover: #18181B;
  --pill-active-bg: var(--text);
  --pill-active-text: var(--bg);
  --search-bg: #18181B;
  --tag-bg: #18181B;
  --tag-text: #71717A;
  --overlay-bg: rgba(0,0,0,0.65);
}}

html {{ scroll-behavior: smooth; }}
body {{
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}}

/* HEADER */
.header {{
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 0 clamp(20px, 4vw, 48px); height: 56px;
  display: flex; align-items: center; justify-content: space-between;
  transition: background 0.4s, backdrop-filter 0.4s;
}}
.header.scrolled {{
  background: var(--header-bg);
  backdrop-filter: blur(20px) saturate(1.2);
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
}}
.logo {{
  font-size: 14px; font-weight: 700; color: var(--text);
  text-decoration: none; letter-spacing: 0.04em; text-transform: uppercase;
}}
.header-right {{ display: flex; align-items: center; gap: 8px; }}
.theme-toggle {{
  background: none; border: none;
  color: var(--text-3); width: 32px; height: 32px;
  border-radius: 8px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: color 0.2s, background 0.2s;
}}
.theme-toggle:hover {{ color: var(--text); background: var(--pill-hover); }}

/* HERO */
.hero {{
  padding: clamp(100px, 14vh, 160px) clamp(20px, 4vw, 48px) clamp(48px, 8vh, 80px);
  max-width: 900px;
}}
.hero-label {{
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 600; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--text-3);
  margin-bottom: 20px;
}}
.hero-label .dot {{
  width: 6px; height: 6px; border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34,197,94,0.5);
  animation: pulse-dot 2s ease-in-out infinite;
}}
@keyframes pulse-dot {{
  0%, 100% {{ opacity: 1; }}
  50% {{ opacity: 0.4; }}
}}
.hero h1 {{
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 800; letter-spacing: -0.04em;
  line-height: 1.08; margin-bottom: 16px;
}}
.hero h1 .gradient-text {{
  background: linear-gradient(135deg, #6366f1, #0ea5e9, #8b5cf6, #0ea5e9, #6366f1);
  background-size: 300% 100%;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 8s ease infinite;
}}
@keyframes gradient-shift {{
  0% {{ background-position: 0% 50%; }}
  50% {{ background-position: 100% 50%; }}
  100% {{ background-position: 0% 50%; }}
}}
.hero .desc {{
  font-size: clamp(15px, 1.8vw, 18px);
  color: var(--text-2); line-height: 1.6;
  max-width: 480px;
}}

/* FILTER */
.filter-section {{
  position: sticky; top: 56px; z-index: 90;
  padding: 12px clamp(20px, 4vw, 48px);
  background: var(--filter-bg);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  transition: border-color 0.3s;
}}
.filter-inner {{
  max-width: 1280px; margin: 0 auto;
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
}}
.search-box {{
  position: relative; flex: 0 1 240px;
}}
.search-box input {{
  width: 100%; padding: 7px 10px 7px 30px;
  background: var(--search-bg); border: 1px solid transparent;
  border-radius: 8px; font-size: 13px;
  font-family: var(--font); color: var(--text); outline: none;
  transition: border-color 0.2s, background 0.2s;
}}
.search-box input:focus {{ border-color: var(--text-3); }}
.search-box svg {{
  position: absolute; left: 9px; top: 50%;
  transform: translateY(-50%); width: 13px; height: 13px;
  color: var(--text-3);
}}
.divider {{
  width: 1px; height: 20px; background: var(--border); margin: 0 4px;
}}
.pills {{ display: flex; flex-wrap: wrap; gap: 4px; }}
.pill {{
  padding: 5px 10px; border: 1px solid transparent;
  border-radius: 6px; background: var(--pill-bg);
  color: var(--text-3); font-size: 12px;
  font-family: var(--font); font-weight: 500;
  cursor: pointer; transition: all 0.2s;
  display: inline-flex; align-items: center; gap: 5px;
}}
.pill:hover {{ background: var(--pill-hover); color: var(--text-2); }}
.pill.active {{
  background: var(--pill-active-bg);
  color: var(--pill-active-text);
  border-color: transparent;
}}
.pill-count {{
  font-size: 10px; opacity: 0.5; font-weight: 400;
}}
.pill.active .pill-count {{ opacity: 0.7; }}

/* GRID */
.grid-section {{
  max-width: 1280px; margin: 0 auto;
  padding: 32px clamp(20px, 4vw, 48px) 100px;
}}
.grid {{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}}
.grid-empty {{
  grid-column: 1 / -1; text-align: center;
  padding: 80px 20px; color: var(--text-3); font-size: 14px;
}}

/* CARDS */
.card {{
  position: relative;
  text-decoration: none; color: inherit;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px; overflow: hidden;
  display: flex; flex-direction: column;
  transition: border-color 0.3s, transform 0.3s;
  /* BlurFade */
  opacity: 0; filter: blur(8px);
  transform: translateY(20px);
}}
.card::before {{
  content: ''; position: absolute;
  top: 0; left: 0; right: 0; height: 2px;
  background: var(--ac, var(--primary));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
  z-index: 2;
}}
.card:hover::before {{ transform: scaleX(1); }}
.card.visible {{
  opacity: 1; filter: blur(0);
  transform: translateY(0);
  transition: opacity 0.5s cubic-bezier(0.22,1,0.36,1),
              filter 0.5s cubic-bezier(0.22,1,0.36,1),
              transform 0.5s cubic-bezier(0.22,1,0.36,1),
              border-color 0.3s;
}}
.card.hidden {{ display: none; }}
.card:hover {{
  border-color: var(--card-hover-border);
  transform: translateY(-3px);
}}

/* CARD THUMB */
.card-thumb {{
  position: relative; aspect-ratio: 16 / 10; overflow: hidden;
  background: linear-gradient(145deg,
    color-mix(in srgb, var(--ac, var(--primary)) 15%, var(--bg-2)),
    var(--bg-2));
}}
.card-thumb img {{
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
}}
.card:hover .card-thumb img {{ transform: scale(1.05); }}
.card-overlay {{
  position: absolute; inset: 0;
  background: var(--overlay-bg);
  display: flex; align-items: center; justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}}
.card:hover .card-overlay {{ opacity: 1; }}
.card-view {{
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  color: #fff; font-size: 13px; font-weight: 500;
  transform: translateY(8px);
  transition: transform 0.3s cubic-bezier(0.22,1,0.36,1),
              background 0.2s;
}}
.card:hover .card-view {{ transform: translateY(0); }}
.card-view:hover {{ background: rgba(255,255,255,0.2); }}

/* CARD BODY */
.card-body {{
  padding: 18px 20px 20px; flex: 1;
  display: flex; flex-direction: column; gap: 8px;
}}
.card-top {{
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 8px;
}}
.card-body h2 {{
  font-size: 16px; font-weight: 700;
  letter-spacing: -0.02em; line-height: 1.3;
  flex: 1;
}}
.card-body p {{
  font-size: 13px; color: var(--text-2);
  line-height: 1.55;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}}
.tech-tags {{
  display: flex; flex-wrap: wrap; gap: 4px;
  margin-top: auto; padding-top: 4px;
}}
.tech-tag {{
  padding: 3px 8px;
  background: var(--tag-bg); color: var(--tag-text);
  font-size: 11px; font-weight: 500;
  border-radius: 4px; white-space: nowrap;
}}
.badge {{
  flex-shrink: 0; padding: 3px 8px;
  background: color-mix(in srgb, var(--ac, var(--primary)) 12%, transparent);
  color: var(--ac, var(--primary));
  font-size: 11px; font-weight: 600;
  border-radius: 5px; white-space: nowrap;
  height: fit-content;
}}

/* FOOTER */
.footer {{
  border-top: 1px solid var(--border);
  padding: 32px clamp(20px, 4vw, 48px);
  display: flex; align-items: center; justify-content: space-between;
  color: var(--text-3); font-size: 12px;
}}
.footer a {{
  color: var(--text-2); text-decoration: none;
  transition: color 0.2s;
}}
.footer a:hover {{ color: var(--text); }}

/* RESPONSIVE */
@media (max-width: 640px) {{
  .grid {{ grid-template-columns: 1fr; }}
  .filter-inner {{ flex-direction: column; align-items: stretch; }}
  .search-box {{ flex: 1 1 100%; }}
  .divider {{ display: none; }}
  .hero h1 {{ letter-spacing: -0.03em; }}
  .footer {{ flex-direction: column; gap: 8px; text-align: center; }}
}}
@media (max-width: 380px) {{
  .grid {{ grid-template-columns: 1fr; gap: 12px; }}
  .card-body {{ padding: 14px 16px 16px; }}
}}
  </style>
</head>
<body>

  <header class="header" id="header">
    <a href="./" class="logo">Firstpip</a>
    <div class="header-right">
      <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
        <svg id="iconSun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        <svg id="iconMoon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
    </div>
  </header>

  <section class="hero">
    <div class="hero-label"><span class="dot"></span>{len(projects)} projects / {total_pages}+ pages</div>
    <h1><span class="gradient-text">Project</span><br>Demos</h1>
    <p class="desc">\uc2e4\uc81c \ub3d9\uc791\ud558\ub294 \ub370\ubaa8\ub97c \uc9c1\uc811 \ud655\uc778\ud574 \ubcf4\uc138\uc694.<br>\uae30\ud68d\ubd80\ud130 \uad6c\ud604\uae4c\uc9c0, \ubaa8\ub4e0 \uacfc\uc815\uc744 \ud22c\uba85\ud558\uac8c.</p>
  </section>

  <section class="filter-section" id="filterBar">
    <div class="filter-inner">
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="search" id="searchInput" placeholder="\uac80\uc0c9..." />
      </div>
      <div class="divider"></div>
      <div class="pills" id="categoryPills">
      {cat_pills}      </div>
    </div>
  </section>

  <section class="grid-section">
    <div class="grid" id="projectGrid">
{cards_html}    </div>
  </section>

  <footer class="footer">
    <span>&copy; 2025 Firstpip</span>
    <a href="https://firstpip.co.kr" target="_blank" rel="noopener">firstpip.co.kr</a>
  </footer>

<script>
(function() {{
  // Theme
  var html = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  var sun = document.getElementById('iconSun');
  var moon = document.getElementById('iconMoon');
  function setTheme(t) {{
    html.setAttribute('data-theme', t);
    localStorage.setItem('fp-theme', t);
    sun.style.display = t === 'dark' ? 'none' : 'block';
    moon.style.display = t === 'dark' ? 'block' : 'none';
  }}
  var s = localStorage.getItem('fp-theme');
  if (s) setTheme(s);
  else if (window.matchMedia('(prefers-color-scheme: light)').matches) setTheme('light');
  toggle.addEventListener('click', function() {{
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }});

  // Header blur on scroll
  var header = document.getElementById('header');
  var raf = false;
  window.addEventListener('scroll', function() {{
    if (!raf) {{ requestAnimationFrame(function() {{
      header.classList.toggle('scrolled', window.scrollY > 32);
      raf = false;
    }}); raf = true; }}
  }});

  // BlurFade reveal
  var cards = document.querySelectorAll('.card');
  var obs = new IntersectionObserver(function(entries) {{
    entries.forEach(function(en) {{
      if (en.isIntersecting) {{
        var i = parseInt(en.target.dataset.index || '0');
        setTimeout(function() {{ en.target.classList.add('visible'); }},
          Math.floor(i / 3) * 100 + (i % 3) * 50);
        obs.unobserve(en.target);
      }}
    }});
  }}, {{ rootMargin: '-30px', threshold: 0.05 }});
  cards.forEach(function(c) {{ obs.observe(c); }});

  // Search
  var input = document.getElementById('searchInput');
  var timer;
  input.addEventListener('input', function() {{
    clearTimeout(timer); timer = setTimeout(filter, 120);
  }});

  // Category
  var pills = document.getElementById('categoryPills');
  var cat = 'all';
  pills.addEventListener('click', function(e) {{
    var p = e.target.closest('.pill');
    if (!p) return;
    pills.querySelectorAll('.pill').forEach(function(x) {{ x.classList.remove('active'); }});
    p.classList.add('active');
    cat = p.dataset.cat;
    filter();
  }});

  function filter() {{
    var q = input.value.toLowerCase().trim();
    var grid = document.getElementById('projectGrid');
    var n = 0;
    cards.forEach(function(c) {{
      var ok = (cat === 'all' || c.dataset.cat === cat) &&
               (!q || c.querySelector('h2').textContent.toLowerCase().indexOf(q) > -1 ||
                c.querySelector('p').textContent.toLowerCase().indexOf(q) > -1);
      if (ok) {{
        c.classList.remove('hidden');
        if (!c.classList.contains('visible'))
          setTimeout(function() {{ c.classList.add('visible'); }}, n * 50);
        n++;
      }} else c.classList.add('hidden');
    }});
    var em = grid.querySelector('.grid-empty');
    if (!n && !em) {{
      em = document.createElement('div');
      em.className = 'grid-empty';
      em.textContent = '\uac80\uc0c9 \uacb0\uacfc\uac00 \uc5c6\uc2b5\ub2c8\ub2e4';
      grid.appendChild(em);
    }} else if (n && em) em.remove();
  }}
}})();
</script>
</body>
</html>
"""
    return html


def main():
    output_path = "index.html"
    preview = False
    for arg in sys.argv[1:]:
        if arg == "--preview":
            preview = True
        else:
            output_path = arg
    projects = PREVIEW_PROJECTS if preview else load_projects()
    assign_colors(projects)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(build_html(projects))
    print(f"Generated {output_path} with {len(projects)} projects")


if __name__ == "__main__":
    main()
