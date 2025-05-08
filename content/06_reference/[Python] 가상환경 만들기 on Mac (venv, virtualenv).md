---
source: https://velog.io/@hyangki0119/Python-%EA%B0%80%EC%83%81%ED%99%98%EA%B2%BD-%EB%A7%8C%EB%93%A4%EA%B8%B0-Mac
clipped: 2023-10-19
tags: [clippings]
---

-   가상환경을 만들 파일 디렉토리로 이동

```
$ cd {your directory}
```

-   가상환경 만들기

```
$ python3 -m venv ./{your venv name}
```

-   가상환경 활성화

```
$ source {your venv name}/bin/activate
```

-   가상환경을 만들기 위한 Package : virtualenv, virtualenvwrapper 설치

```
$ pip3 install virtualenv virtualenvwrapper
```

-   가상환경을 만들 파일 디렉토리로 이동

```
$ cd {your directory}
```

-   가상환경 만들기

```
$ python3 -m virtualenv --python={your python version} {your venv name}
```

-   가상환경 활성화

```
$ source {your venv name}/bin/activate
```

```
$ pip install jupyter notebook
```

-   Jupyter notebook에 만든 가상환경 연결하기

```
$ python -m ipykernel install --user --name {가상환경 이름} --display-name "{디스플레이 이름}"
```