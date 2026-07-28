"""Deploy manuale della SPA su Hostinger via FTP.

Le credenziali si leggono da variabili d'ambiente — MAI committare password.

Uso:
    FTP_USER=u283873288.leo FTP_PASS=... python3 upload_ftp.py

Nota: il deploy normale avviene via GitHub Actions (.github/workflows/deploy.yml).
Questo script resta come fallback manuale.
"""
import ftplib
import os

FTP_HOST = os.environ.get("FTP_HOST", "82.198.228.26")
FTP_USER = os.environ["FTP_USER"]  # obbligatoria
FTP_PASS = os.environ["FTP_PASS"]  # obbligatoria

dist = "/opt/data/beauty-crm/dist"

ftp = ftplib.FTP()
ftp.connect(FTP_HOST, 21, timeout=10)
ftp.login(FTP_USER, FTP_PASS)
ftp.cwd("/")

for fname in ["index.html", "logo.jpg", "logo.png", "favicon.svg", "icons.svg", "og-banner.png", "product-mockup.png", "og-banner.html", "sitemap.xml", "robots.txt", "sw.js", "manifest.json", "favicon.ico"]:
    local = os.path.join(dist, fname)
    if not os.path.isfile(local):
        continue
    with open(local, "rb") as f:
        ftp.storbinary(f"STOR {fname}", f)
    print(f"  OK: {fname}")

with open(os.path.join(dist, ".htaccess"), "rb") as f:
    ftp.storbinary("STOR .htaccess", f)
print("  OK: .htaccess")

# Upload logos
logos_local = os.path.join(dist, "logos")
if os.path.isdir(logos_local):
    try:
        ftp.cwd("logos")
    except:
        ftp.mkd("logos")
        ftp.cwd("logos")
    for fname in sorted(os.listdir(logos_local)):
        local = os.path.join(logos_local, fname)
        if os.path.isfile(local):
            with open(local, "rb") as f:
                ftp.storbinary(f"STOR {fname}", f)
            print(f"  OK: logos/{fname}")
    ftp.cwd("/")

try:
    ftp.cwd("assets")
except:
    ftp.mkd("assets")
    ftp.cwd("assets")

old_assets = set(ftp.nlst()) - {'.', '..'}
new_assets = set(os.listdir(os.path.join(dist, "assets")))

for old in old_assets:
    if old not in new_assets:
        try:
            ftp.delete(old)
            print(f"  DEL: assets/{old}")
        except:
            pass

for fname in sorted(new_assets):
    local = os.path.join(dist, "assets", fname)
    if os.path.isfile(local):
        try:
            ftp.delete(fname)
        except:
            pass
        with open(local, "rb") as f:
            ftp.storbinary(f"STOR {fname}", f)
        print(f"  OK: assets/{fname}")

ftp.quit()
print("\n✅ Upload completato!")
