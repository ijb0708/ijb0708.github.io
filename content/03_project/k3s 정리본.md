---
tags:
  - linux
title: k3s 정리본
---
# kubectl 의 기본적인 명령어

## 클러스터 정보확인
```bash
kubectl get nodes -o wide # 노드정보 보기
kubectl get namespaces    # 네임스페이스 조회 
kubectl get svc    
kubectl get pods -o wide  # 팟들 정보 학인
````
## 리소스 삭제하기

``` bash
kubectl delete svc nginx-test
kubectl delete deployment nginx-test
kubectl delete pod busybox-test
```

## kubectl 에서 sudo 없이 사용하는버

```bash
mkfir -p ~/.kuber
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown 
```


# Ingress 설치방법

## 사용가능한 Ingress

| 이름                  | 설명                          | 장점                   | 단점                  |
| ------------------- | --------------------------- | -------------------- | ------------------- |
| **nginx-ingress**   | 가장 널리 쓰이는 전통적인 컨트롤러         | 안정성, 문서 풍부           | 정적 설정 위주, 이벤트 반응 느림 |
| **[[Traefik]]**         | K3s에서 기본 제공, 자동 감지, 대시보드 제공 | 자동화, 빠름, 가벼움         | 익숙하지 않을 수 있음        |
| **HAProxy Ingress** | 성능 좋고 대형 서비스에 사용            | 빠르고 가벼움              | 설정 복잡, 사용자 적음       |
| **Contour**         | Envoy 기반 고성능 컨트롤러           | 최신 기술 기반, TLS 지원 뛰어남 | nginx보다 사용자 적음      |
| **Istio Gateway**   | 서비스 메시용 Ingress (무거움)       | 보안/정책 제어 강력          | 리소스 많이 먹음, 복잡함      |

# yaml 파일 관리 

## 정리를 위한 파일 구조

```
k8s-config/
├── helm/
│   └── traefik/
│       ├── traefik-values.yaml
│       └── traefik-dashboard-auth.yaml
├── manifests/
│   ├── ingress-nginx.yaml
│   └── namespace-dev.yaml
├── scripts/
│   └── install-traefik.sh
├── .gitignore
└── README.md
```
파일구조는 다음과 같이 구성함, 

### 주의사항
|항목|이유|
|---|---|
|**Secret, ConfigMap (민감 정보)**|환경 변수에 API 키, 비밀번호 있을 수 있음|
|**TLS 인증서, private key**|인증 뚫림|
|**기밀 토큰 (Webhook, Bot 등)**|악용 가능|
|**Cluster kubeconfig, .kube/config**|클러스터 탈취 위험|

> `values.yaml`에도 `auth`, `cert`, `password`, `accessKey` 같은 항목이 들어가지 않도록 주의!

다음같은 항목은 넣지 말것

```
*.pem
*.key
*.crt
*.enc
secrets/
.kube/
.env
// .gitignore
```

# helm 에대하여

## Helm이란?

Helm은 Kubernetes에서 애플리케이션을 더 쉽게 설치하고 관리할 수 있게 해주는 **패키지 매니저**이다.  
일반적인 OS의 `apt`, `yum`, `brew`처럼, Helm은 **Chart**라는 단위로 Kubernetes 리소스를 배포한다.

---

## 핵심 개념

- **Chart**: Helm 패키지. 여러 Kubernetes 리소스 정의(YAML)를 템플릿 형태로 포함.
- **Release**: Chart가 Kubernetes 클러스터에 실제로 설치된 인스턴스.
- **Repository**: Chart들을 모아둔 저장소. 로컬 또는 원격(GitHub, S3 등)에서 호스팅 가능.
- **values.yaml**: 템플릿에 적용될 사용자 설정 파일.

---

## 동작 원리

```text
Helm Chart + values.yaml ─▶ 템플릿 렌더링 ─▶ YAML 생성 ─▶ Kubernetes API 호출
````

- `helm install` 명령을 실행하면, Chart의 템플릿과 설정을 바탕으로 리소스가 생성되고 클러스터에 올라간다.
    
- 이 리소스들은 `kubectl get all`로 확인 가능하다.
    
- 반대로 `helm uninstall`로 쉽게 제거 가능하다.
    

---

## 설치 예시

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-nginx bitnami/nginx
```

- 위 명령으로 NGINX Chart를 설치하고 클러스터에 Deployment, Service 등 리소스가 생성된다.
    

---

## Chart 직접 만들기

```bash
helm create mychart
```

- 위 명령으로 기본 템플릿이 생성됨.
    
- `templates/`, `Chart.yaml`, `values.yaml` 등을 수정해서 커스텀 Chart 구성 가능.
    

설치:

```bash
helm install myapp ./mychart
```

---

## 로컬에서 Chart 관리하기

### 1. 로컬 디렉토리에서 직접 설치

```bash
helm install myapp ./mychart
```

### 2. 로컬 저장소처럼 만들기

```bash
helm package ./mychart
helm repo index . --url http://localhost:8000
```

- `.tgz`와 `index.yaml` 파일을 정적 서버(Nginx, GitHub Pages 등)로 호스팅하면 Helm 저장소로 사용 가능.
    
- 등록:
    

```bash
helm repo add myrepo http://localhost:8000
```

---

## 왜 설정파일을 따로 만들까?

Helm을 쓸 때 `values.yaml`이나 `.sh` 스크립트 등을 별도로 관리하는 이유는 다음과 같다:

1. **버전 관리 (GitOps)**: 설정을 Git에 올려서 추적/협업 가능
    
2. **자동화 (CI/CD)**: 스크립트를 이용한 반복 설치, 테스트 등 가능
    
3. **환경 분리**: dev/prod 등 상황에 따라 설정 분리 가능
    
4. **보안 분리**: 비밀 설정은 `.gitignore` 등으로 따로 관리
    

예시 구조:

```
k8s-config/
├── helm/
│   └── traefik/
│       ├── traefik-values.yaml
│       └── traefik-dashboard-auth.yaml
├── manifests/
│   ├── ingress-nginx.yaml
│   └── namespace-dev.yaml
├── scripts/
│   └── install-traefik.sh
└── README.md
```

---

## 🧪 실전 확인

설치 후 확인:

```bash
kubectl get all
```

템플릿만 출력하고 싶을 때:

```bash
helm template myapp ./mychart
```

---

## 🔐 인증된 저장소 사용

```bash
helm repo add myrepo https://mydomain.com/charts --username admin --password s3cret
```

- Basic Auth를 사용하는 Helm 저장소에 접근할 수 있음.
    

---

## 📎 참고 링크

- [Helm 공식 문서](https://helm.sh/docs/)
    
- [Bitnami Chart 레포지토리](https://bitnami.com/stacks/helm)
    
