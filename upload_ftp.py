import ftplib
import os

dist = "/opt/data/beauty-crm/dist"

ftp = ftplib.FTP()
ftp.connect("82.198.228.26", 21, timeout=10)
ftp.login("u283873288.leo", "hZ913=36U5J/UK?7")
ftp.cwd("/")

# Upload root files
for fname in ["index.html", "logo.jpg", "logo.png", "favicon.svg", "icons.svg"]:
    local = os.path.join(dist, fname)
    with open(local, "rb") as f:
        ftp.storbinary(f"STOR {fname}", f)
    print(f"  OK: {fname}")

# Upload .htaccess
with open(os.path.join(dist, ".htaccess"), "rb") as f:
    ftp.storbinary("STOR .htaccess", f)
print("  OK: .htaccess")

# Handle assets
try:
    ftp.cwd("assets")
except:
    ftp.mkd("assets")
    ftp.cwd("assets")

# Upload new assets, delete old ones
old_assets = set(ftp.nlst()) - {'.', '..'}
new_assets = set(os.listdir(os.path.join(dist, "assets")))

# Delete old assets not in new build
for old in old_assets:
    if old not in new_assets:
        try:
            ftp.delete(old)
            print(f"  DEL: assets/{old}")
        except:
            print(f"  SKIP: assets/{old} (could not delete)")

# Upload new assets
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

# Verify
ftp.cwd("/")
print("\nFinal files:")
for f in sorted(ftp.nlst()):
    if f not in ('.', '..'):
        print(f"  {f}")
print("Assets:")
for f in sorted(ftp.nlst("assets")):
    if f not in ('.', '..'):
        print(f"  {f}")

ftp.quit()
print("\n✅ Upload completato!")