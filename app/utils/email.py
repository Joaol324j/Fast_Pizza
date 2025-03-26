import smtplib
from email.mime.text import MIMEText

SMTP_SERVER = "smtp.gmail.com"  
SMTP_PORT = 587
EMAIL_SENDER = "joaol324j@gmail.com"
EMAIL_PASSWORD = "psqb hxrv aaby waqi"

def send_email(to_email: str, subject: str, body: str):
    """ Envia um email com o link de recuperação """
    msg = MIMEText(body, "html")
    msg["Subject"] = subject
    msg["From"] = EMAIL_SENDER
    msg["To"] = to_email

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_SENDER, to_email, msg.as_string())
        server.quit()
    except Exception as e:
        print(f"Erro ao enviar email: {e}")
