FROM python:3.9-slim-buster

WORKDIR /app

COPY . /app

# 安装 Flask 和你的其他依赖 (包括 pygame，如果你的应用仍然需要的话)
RUN pip install -r requirements.txt

# 设置容器启动时执行的命令，运行 Flask 应用
CMD ["python3", "main.py"]