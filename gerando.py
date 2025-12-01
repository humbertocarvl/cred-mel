import qrcode
import random
import string
import pandas as pd

def gerar_codigo_aleatorio(tamanho=13):
    caracteres = string.ascii_letters + string.digits
    return ''.join(random.choice(caracteres) for _ in range(tamanho))

def gerar_qr_codes(quantidade=700, tamanho_codigo=13):
    dados = []
    for _ in range(quantidade):
        codigo = gerar_codigo_aleatorio(tamanho_codigo)
        qr = qrcode.make(codigo)
        dados.append(codigo)
        # Opcional: salvar cada QR code como imagem se quiser
        # qr.save(f"qrcodes/{codigo}.png")
    
    # Salva tudo em uma planilha Excel ou CSV
    df = pd.DataFrame(dados, columns=['Código'])
    df.to_excel("codigos_qr.xlsx", index=False)

# Chamando a função para gerar 600 códigos
gerar_qr_codes()
