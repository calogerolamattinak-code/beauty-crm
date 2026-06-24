import ftplib
import os

dist = "/opt/data/beauty-crm/dist"

ftp = ftplib.FTP()
ftp.connect("82.198.228.26", 21, timeout=10)
ftp.login("u283873288.leo", "hZ913=36U5J/UK?7")
ftp.cwd("/")

for fname in ["index.html", "logo.jpg", "logo.png", "favicon.svg", "icons.svg"]:
    local = os.path.join(dist, fname)
    with open(local, "rb") as f:
        ftp.storbinary(f"STOR {fname}", f)
    print(f"  OK: {fname}")

with open(os.path.join(dist, ".htaccess"), "rb") as f:
    ftp.storbinary("STOR .htaccess", f)
print("  OK: .htaccess")

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