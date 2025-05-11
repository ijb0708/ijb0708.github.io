Traefik 을 설치하는 과정이다. k3s의 경우 기본적으로 내장이 되어있음, 하지만 내장의 경우 커스텀이 불가한 부분이 많아서 지우고 helm으로 새로 설치하는 것을 추천, 아래방법은 삭제후 새로설치하는 방법을 설명함.

k3s를 초기에 설치할때 아래와 같이 treafik를 미설치할 수도 있음
```bash
curl -sfL https://get.k3s.io | sh -s - --disable=traefik
```
#### 현재 Traefik 설치여부 확인
k3s의 경우 기본적으로 설치되었음 하지만 따로 확인필요
```bash
kubectl get pods -A | grep traefik
```

### 기본 내장으로 설치했을경우

#### 삭제과정
``` bash
# 기본 Traefik은 manifests 디렉토리에 있으므로 해당 파일을 제거
sudo rm /var/lib/rancher/k3s/server/manifests/traefik.yaml

# Traefik 관련 리소스 삭제 (조금 기다려야 함)
kubectl delete helmcharts.helm.cattle.io traefik -n kube-system
kubectl delete all --selector app.kubernetes.io/name=traefik -n kube-system
kubectl delete crd ingressroutes.traefik.containo.us

```

이후 
``` bash
kubectl get pods -A | grep traefik 
```
했을때 출력되는 것이 없어야함 하지만 출려되는 것이 있을경우 아래 과정으로..

##### 삭제 에러시

```bash
kubectl get pods -A | grep traefik 
# kube-system helm-install-traefik-crd-rk885 0/1 Completed 0 3d17h
```
해당 부분은 잡으로서 삭제되더라도 다시 올려준데 때문에 잡을 제거해야함

```bash
kubectl get job -n kube-system
kubectl delete job helm-install-traefik-crd-rk885 -n kube-system
```

일단 해당방법으로 제거해 볼것 그래도 재복구시,

```bash
ps aux | grep k3s # 또는
kubectl describe job
```
	여기서 `helm-install-traefik-crd` 이 만든것으로 판단되면  아래의 방법으로 삭제

 ```bash
 kubectl delete helmchart traefik-crd -n kube-system 
 ```
	
이후 아래의 명령어로 확인하기

```bash
kubectl delete job helm-install-traefik-crd -n kube-system
kubectl get jobs -n kube-system
```

## kubelctl 네임스페이스 추가하기

```bash
kubectl create namespace traefik-system
```

# 설치하기

## 1.  helm 설치하기




## 2. 커스텀 하기위한 설정파일 등록

traefik-values.yaml 해당파일을 생성 할것

``` yaml
# traefik-values.yaml

additionalArguments:
  - "--api.dashboard=true"
  - "--entrypoints.web.address=:80"
  - "--entrypoints.websecure.address=:443"

ports:
  web:
    expose:
      enabled: true
    port: 80
    protocol: TCP
  websecure:
    expose:
      enabled: true
    port: 443
    protocol: TCP

ingressRoute:
  dashboard:
    enabled: true

service:
  type: NodePort

providers:
  kubernetesCRD:
    enabled: true
  kubernetesIngress:
    enabled: true
```

이후

## 3. 설치하기 

네임스페이스 추가 명령어
``` bash
kubectl create namespace traefik-system
```

traefik의 설치 명령어

``` bash
helm install traefik traefik/traefik \
	-n traefik-system \
	-f traefik-values.yaml
```

### 항목 및 기타 설정의 대한 설명

``` bash
helm install <릴리즈_이름> <차트_이름> \
	-n <네임스페이스이름> \
	-f <커스텀할 파일정보>
```

-n : 네임스페이스 설정부분
-f : 넣을 파일정보

## 4. 설치확인

아래의 명령어로 확인가능

pod를 확인
```bash
kubectl get pods -n traefik-system
```

서비스를 확인
```bash
kubectl get svc -n traefik-system
```

대시보드로 접속하여 확인가능

명령어:
``` bash
kubectl describe ingressroute traefik-dashboard -n traefik-system
# kuberctl describe 
```
결과:
```
Spec: 
	Entry Points: 
		traefik
```
 아래과 같은 형태로 설정되어 있을경우 해당 트러블 슈팅을 이동
