---
tags:
  - java
---

``` java
import com.sun.net.httpserver.HttpExchange;  
import com.sun.net.httpserver.HttpHandler;  
import com.sun.net.httpserver.HttpServer;  
  
import java.io.IOException;  
import java.io.OutputStream;  
import java.net.InetSocketAddress;  
  
public class MainPackage {  
    public static void main(String[] args) {  
      
        HttpServer httpServer;  
        OutputStream responseBody = null;  
          
        try {  
            httpServer = HttpServer.create(new InetSocketAddress("0.0.0.0", 5678), 0);  
            httpServer.createContext("/", new HttpHandler() {  
                @Override  
                public void handle(HttpExchange httpExchange) throws IOException {  
                    String response = "Hello, http";  
                    httpExchange.sendResponseHeaders(404, response.length());  
                      
                    OutputStream os = httpExchange.getResponseBody();  
                    os.write(response.getBytes());  
                    os.close();  
                }  
            });  
              
//            httpServer.createContext("/sum", new HttpHandler() {  
//                @Override  
//                public void handle(HttpExchange httpExchange) throws IOException {  
//  
//                }  
//            });  
            httpServer.setExecutor(null);  
              
            httpServer.start();  
              
        }catch (IOException e) {  
          
        }  
          
    }  
}
```

