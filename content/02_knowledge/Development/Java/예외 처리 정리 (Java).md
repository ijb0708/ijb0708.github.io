---
tags:
  - java
---

 - *체크 예외(Checked Exception) 
 - 논 체크 예외(Unchecked Exception)

---

## 📌 예외 클래스 계층 구조

### `java.lang.Error`

- 시스템의 심각한 오류로 인해 발생
    
- 예: `OutOfMemoryError`, `StackOverflowError`, `ThreadDeath`
    
- **catch로 잡아도 의미 없음**, 복구 불가 상황
    

### `java.lang.Exception`

- 일반적인 예외의 최상위 클래스
    
- **개발자 코드에서 발생 가능한 예외**
    
- 체크 예외의 루트
    

### `java.lang.RuntimeException`

- `Exception`의 하위 클래스
    
- 예외 처리를 **강제하지 않음**
    
- 예: `NullPointerException`, `IndexOutOfBoundsException`, `IllegalArgumentException`
    

---

## ✅ 예외 처리 전략

### 1. 예외 복구 (Recovery)

- 예외가 발생했을 때 **상황을 복구**하여 프로그램을 정상 상태로 되돌림
    
- 예:
    
    ```java
    try {
        connectServer();
    } catch (IOException e) {
        Thread.sleep(3000);
        connectServer(); // 재시도
    }
    ```
    

### 2. 예외 처리 회피 (Propagation)

- 예외를 직접 처리하지 않고, **호출자에게 전달**
    
- `throws` 키워드 또는 `catch` 후 `throw`로 재전달
    
    ```java
    public void someMethod() throws IOException {
        doSomething();
    }
    ```
    

### 3. 예외 전환 (Translation)

- 구체적인 예외를 **의미 있는 사용자 정의 예외로 변환**
    
- 예:
    
    ```java
    catch (SQLException e) {
        if (e.getErrorCode() == MysqlErrorNumbers.ER_DUP_ENTRY) {
            throw new DuplicateUserIdException();
        } else {
            throw e;
        }
    }
    ```
    

---

## 🔁 예외 처리 예시 코드

```java
try {
    doSomethingRisky();
} catch (IOException e) {
    log.error("I/O Error", e);
    throw new MyCustomIOException();
}
```

---

## 🔍 예외 처리 관련 키워드

- `try ~ catch`: 예외를 처리할 코드 블럭
    
- `finally`: 예외 발생 여부와 관계없이 실행
    
- `throw`: 예외를 발생시킴
    
- `throws`: 메서드 시그니처에 예외를 명시
    

---

## 📝 참고

- 자주 사용하는 예외 종류 정리:
    
    - `NullPointerException`: null 참조
        
    - `IllegalArgumentException`: 잘못된 인자 전달
        
    - `IllegalStateException`: 객체 상태가 잘못되었을 때
        
    - `IOException`: 입출력 오류
        
    - `SQLException`: SQL 처리 중 발생한 예외