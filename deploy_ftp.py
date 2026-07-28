"""Deploy manuale alternativo (walk completo di dist/) su Hostinger via FTP.

Le credenziali si leggono da variabili d'ambiente — MAI committare password.

Uso:
    FTP_USER=u283873288.leo FTP_PASS=... python3 deploy_ftp.py

Nota: il deploy normale avviene via GitHub Actions (.github/workflows/deploy.yml).
Questo script resta come fallback manuale.
"""
import ftplib
import os

FTP_HOST = os.environ.get("FTP_HOST", "82.198.228.26")
FTP_USER = os.environ["FTP_USER"]  # obbligatoria
FTP_PASS = os.environ["FTP_PASS"]  # obbligatoria

ftp = ftplib.FTP(FTP_HOST)
ftp.login(FTP_USER, FTP_PASS)

dist_dir = 'dist'
total = 0

# Upload dist contents to root (FTP root = public_html)
for root, dirs, files in os.walk(dist_dir):
    rel_root = os.path.relpath(root, dist_dir)
    if rel_root == '.':
        rel_root = ''

    # Create remote dirs
    for d in dirs:
        remote_dir = os.path.join(rel_root, d).replace(os.sep, '/')
        try:
            ftp.mkd(remote_dir)
        except:
            pass

    # Upload files
    for f in files:
        local_path = os.path.join(root, f)
        remote_path = os.path.join(rel_root, f).replace(os.sep, '/')
        with open(local_path, 'rb') as fh:
            ftp.storbinary(f'STOR {remote_path}', fh)
        total += 1

# Upload logos directory
logos_local = 'public/logos'
for f in sorted(os.listdir(logos_local)):
    local_path = os.path.join(logos_local, f)
    if os.path.isfile(local_path):
        remote_path = f'logos/{f}'
        with open(local_path, 'rb') as fh:
            ftp.storbinary(f'STOR {remote_path}', fh)
        total += 1

ftp.quit()
print(f'Uploaded {total} files to Hostinger')
