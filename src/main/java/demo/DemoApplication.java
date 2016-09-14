package demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
//@EnableAutoConfiguration
@PropertySources({
	@PropertySource("classpath:auth0.properties")
})
@ComponentScan(basePackages = {"com.auth0.spring.security.api","demo.config","demo.controller"})
public class DemoApplication {

	@RequestMapping("/")
	String hello(){
		return "hello world";
	}


	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
}
