package com.tenalink.auth.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@Configuration
public class UserDbConfig {

    @Value("${spring.datasource.url}")
    private String primaryUrl;

    @Value("${spring.datasource.username}")
    private String primaryUsername;

    @Value("${spring.datasource.password}")
    private String primaryPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        DriverManagerDataSource ds = new DriverManagerDataSource();
        ds.setUrl(primaryUrl);
        ds.setUsername(primaryUsername);
        ds.setPassword(primaryPassword);
        ds.setDriverClassName("org.postgresql.Driver");
        return ds;
    }

    @Value("${userdb.datasource.url}")
    private String url;

    @Value("${userdb.datasource.username}")
    private String username;

    @Value("${userdb.datasource.password}")
    private String password;

    @Bean(name = "userDbDataSource")
    public DataSource userDbDataSource() {
        DriverManagerDataSource ds = new DriverManagerDataSource();
        ds.setUrl(url);
        ds.setUsername(username);
        ds.setPassword(password);
        ds.setDriverClassName("org.postgresql.Driver");
        return ds;
    }

    @Bean(name = "userDbJdbcTemplate")
    public JdbcTemplate userDbJdbcTemplate(@Qualifier("userDbDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
