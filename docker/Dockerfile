FROM python:3.7
WORKDIR /var/www/ws_public_html

ADD requirements.txt .

RUN /usr/local/bin/python -m pip install --upgrade pip
# requirements.txtにリストされたパッケージをインストールする
RUN pip install --trusted-host pypi.python.org -r requirements.txt


CMD ["uvicorn", "main:app", "--reload", "--host", "10.0.1.201", "--port", "8181"]

# Case1: FastAPIをuvicorn8000ポートで起動
#CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]

# Case2: FastAPIをgunicorn8000番ポート経由でuvicorn起動（ワーカー数2）
#CMD ["gunicorn", "main:app", "-w", "2", "--bind", "0.0.0.0:8000", "-k", "uvicorn.workers.UvicornWorker"]

# Case3: Case2の状態を、nginxリバースプロキシ利用するため5000番ポート利用。
#CMD ["gunicorn", "main:app", "-w", "2", "--bind", "0.0.0.0:5000", "-k", "uvicorn.workers.UvicornWorker"]

# Case4: Case3のNginxをTCPではなく、UNIXドメインソケットを使用して起動
#CMD ["gunicorn", "main:app", "-w", "2", "--bind", "unix:./tmp/gunicorn.sock", "-k", "uvicorn.workers.UvicornWorker"]
